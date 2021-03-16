<template>
  <div class="container">
    <div class="row">
      <a :href="'/login'" class="bg-light btn text-primary">Логирај се</a>
      <a :href="'/'" class="bg-light btn text-primary">Речник</a>
      <a :href="'/sentence'" class="bg-light btn text-primary" v-if="token !== null">Сегментација</a>
      <a :href="'/all-sentences'" class="btn text-white btn-info" v-if="token !== null">Сите реченици</a>
    </div>
    <div class="text-center">
      <h1 class="mt-5 mb-5">Edit sentence</h1>
      <div v-for="result in results" v-bind:key="result">
        <div class="row mt-2">
          <label class="col-form-label offset-4 col-2" for="wordType">{{ result[0] }} : </label>
          <select class="form-control col-2" name="wordType" id="wordType">
            <option :selected="result[1] === ''" value="">Не посотои</option>
            <option :selected="result[1] === 'Прилог'" value="Прилог">Прилог</option>
            <option :selected="result[1] === 'Повеќе можни'" value="Повеќе можни">Повеќе можни</option>
            <option :selected="result[1] === 'Недефинирано'" value="Недефинирано">Недефинирано</option>
            <option :selected="result[1] === 'Подмет или предмет'" value="Подмет или предмет">Подмет или предмет
            </option>
          </select>
        </div>
      </div>
      <button class="btn btn-primary mt-5" v-on:click="patchSentence()">Промени</button>
    </div>
    <a :href="'/all-sentences'" class="btn btn-info" v-if="token !== null">Врати се</a>
  </div>
</template>

<script>
import axios from "axios";
import {TokenService} from "@/services/token";

export default {
  name: "EditSentence",
  data() {
    return {
      results: [],
      token: TokenService.getToken()
    }
  },
  methods: {
    tokenizeWords(response) {
      let sentence = response.sentence.split(" ")
      let words = response.words.split(",")
      for (let i = 0; i < sentence.length; i++) {
        this.results.push([sentence[i], words[i]])
      }
    },
    patchSentence() {
      let toChange = Array.from(document.getElementsByName('wordType')).map(e => e.options[e.selectedIndex].value).join(",")
      axios({
        method: 'patch',
        url: 'http://127.0.0.1:8000/sentence/' + this.$route.params.id + '/',
        headers: {
          'Authorization': "Token " + this.token,
        },
        data: {
          words: toChange
        }
      }).then(response => {
        this.tokenizeWords(response.data)
        this.$router.push('/all-sentences')
      })
          // eslint-disable-next-line no-unused-vars
          .catch(error => console.log(error));
      this.results = []
    }
  },
  created() {
    axios({
      method: 'get',
      url: 'http://127.0.0.1:8000/sentence/' + this.$route.params.id + '/',
      headers: {
        'Authorization': "Token " + this.token,
      }
    }).then(response => {
      this.tokenizeWords(response.data)
    })
        // eslint-disable-next-line no-unused-vars
        .catch(error => console.log(error));
  }
}
</script>

<style scoped>

</style>