<template>
  <div class="container">
    <div class="row">
      <a :href="'/login'" class="bg-light btn text-primary">Логирај се</a>
      <a :href="'/'" class="bg-light btn text-primary">Речник</a>
      <a :href="'/sentence'" class="btn text-white btn-info" v-if="token !== null">Сегментација</a>
      <a :href="'/all-sentences'" class="bg-light btn text-primary" v-if="token !== null">Сите реченици</a>
    </div>
    <div class="text-center">
      <h1 class="h1 mt-5 mb-5">Сегментација на реченици</h1>
      <form v-on:submit.prevent="calculateForSentence">
        <div class="form-group">
          <label for="sentenceInput">Внеси реченица</label>
          <textarea v-model="msg" id="sentenceInput" class="form-control" rows="3"></textarea>
        </div>
        <input class="btn btn-primary" type="submit" value="Прикажи информации за зборовите">
      </form>
    </div>
    <p v-if="tmpMsg !== ''" class="mt-5">Текстот кој го внесовте е: <span class="font-weight-bold">{{ tmpMsg }}</span></p>
    <p class="mt-3">{{ tmpSearching }}</p>
    <p class="mt-3">{{ tmpCreating }}</p>
    <div v-for="word in words" v-bind:key="word">
      <div class="tooltip">{{ word }}
        <span class="tooltiptext" v-if="tmp[word] !== undefined && tmp[word].length > 0">
        {{ getTypeOfWord(tmp[word]) }}</span>
        <span class="tooltiptext" v-else>
          Нема таков збор
        </span>
      </div>
    </div>
  </div>
</template>

<script>

import axios from "axios";
import {TokenService} from "@/services/token";

export default {
  name: "Sentence",
  components: {},
  data() {
    return {
      msg: "",
      tmpMsg: "",
      tmpWords: "",
      words: [],
      tmp: [],
      toSendWords: [],
      returned: [],
      tmpSearching: "",
      tmpCreating: "",
      token: TokenService.getToken()
    }
  },
  methods: {
    async calculateForSentence() {
      this.tmpMsg = this.msg
      this.tmpWords = this.msg.replaceAll(/[.,?!]/g, ' ')
      this.words = this.tmpWords.split(/\s+/)
      this.tmp = []
      this.words.forEach((el, ind) => {
        this.getWordDescription(el, ind)
        this.returned.push(false)
      })
      while (this.returned.length > 0){
        console.log(this.returned)
        await new Promise(r => setTimeout(r, 2000));
      }
      this.tmpCreating = "Се додава реченицата"
      console.log(this.token)
      axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/sentence/',
        headers: {
          'Authorization': "Token " + this.token,
        },
        data: {
          sentence: this.tmpMsg,
          words: this.toSendWords.toString(),
          token: this.token
        }
      })
          // eslint-disable-next-line no-unused-vars
          .then(response => { this.tmpCreating = ""})
          .catch(error => console.log(error));
    },
    getWordDescription(word, index) {
      this.tmpSearching = "Се вчитува..."
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8000/words/?search=' + word,
        headers: {
          'Authorization': "Token " + this.token,
        }
      }).then(response => {
        this.tmpSearching = ""
        this.tmp[word] = (response.data.results)
        this.returned.splice(this.returned.indexOf(false), 1)
        this.toSendWords[index] = (this.getTypeOfWord(response.data.results))
      })
          // eslint-disable-next-line no-unused-vars
          .catch(error => console.log(error));
    },
    getTypeOfWord(word){
      if (word.length > 1)
        return "Повеќе можни"
      else{
        switch (word[0].encoding[0]){
          case 'N':
            return "Подмет или предмет"
          case 'V':
            return "Прилог"
          default :
            return "Недефинирано"
        }
      }
    }
  }
}
</script>

<style scoped>
.tooltip {
  position: relative;
  display: inline-block;
  border-bottom: 1px dotted black;
  opacity: 1;
}

.tooltip .tooltiptext {
  visibility: hidden;
  width: 120px;
  background-color: black;
  color: #fff;
  text-align: center;
  padding: 5px 0;
  border-radius: 6px;

  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
</style>