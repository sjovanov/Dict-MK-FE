<template>
  <div class="home container">
    <div class="text-center">
      <h1 class="h1 mt-5 mb-5">Речник</h1>
    </div>
    <div class="row mb-5">
      <div class="text-center col-6">
        <div class="form-group">
          <label for="limitInput">Број на зборови</label>
          <input type="number" v-model="limit" class="form-control" id="limitInput">
        </div>
        <div class="form-group">
          <label for="offsetInput">Поместување</label>
          <input type="number" v-model="offset" class="form-control" id="offsetInput">
        </div>
        <button class="btn btn-primary" v-on:click="getWords(limit,offset)">Прикажи резултати</button>
      </div>
      <div class="text-center col-6">
        <div class="form-group">
          <label for="wordInput">Збор</label>
          <input type="text" v-model="wordForSearching" class="form-control" id="wordInput">
        </div>
        <button class="btn btn-primary" v-on:click="getSingleWord(wordForSearching)">Пребарај по збор</button>
        <p class="mt-3">{{ tmpSearching }}</p>
      </div>
    </div>
    <div v-if="words.length > 0">
      <div class="card mb-3" v-for="word in words" v-bind:key="word.id">
        <div class="card-header">
          <span class="font-weight-bold">{{ word.word }}</span> : {{ word.base }}
        </div>
        <div class="card-body">
          {{ word.encoding }}
          <div v-if="word.encoding.charAt(0) === 'N'">
            <span>{{ getTypeNoun(word.encoding.charAt(1)) }}</span><br>
            <span>{{ getGender(word.encoding.charAt(2)) }}</span><br>
            <span>{{ getNumber(word.encoding.charAt(3)) }}</span><br>
            <span>{{ getCase(word.encoding.charAt(4)) }}</span><br>
            <span>{{ getDefiniteness(word.encoding.charAt(5)) }}</span>
          </div>
          <div v-else-if="word.encoding.charAt(0) === 'V'">
            <span>{{ getTypeVerb(word.encoding.charAt(1)) }}</span><br>
            <span>{{ getFormVerb(word.encoding.charAt(2)) }}</span><br>
            <span>{{ getTenseVerb(word.encoding.charAt(3)) }}</span><br>
            <span>{{ getPersonVerb(word.encoding.charAt(4)) }}</span><br>
            <span>{{ getNumber(word.encoding.charAt(5)) }}</span><br>
            <span>{{ getGender(word.encoding.charAt(6)) }}</span><br>
            <span>{{ getVoiceVerb(word.encoding.charAt(7)) }}</span><br>
            <span>{{ getYesNo(word.encoding.charAt(8)) }}</span><br>
            <span>{{ getAspectVerb(word.encoding.charAt(14)) }}</span>
          </div>
          <div v-else-if="word.encoding.charAt(0) === 'A'">
            <span>{{ getTypeAdjective(word.encoding.charAt(1)) }}</span><br>
            <span>{{ getDegreeAdjective(word.encoding.charAt(2)) }}</span><br>
            <span>{{ getGender(word.encoding.charAt(3)) }}</span><br>
            <span>{{ getNumber(word.encoding.charAt(4)) }}</span><br>
            <span>{{ getDefiniteness(word.encoding.charAt(6)) }}</span>
          </div>
          <!--        <div v-else-if="word.encoding.charAt(0) === 'P'">-->
          <!--          <span>{{word.encoding.charAt(1))}}</span>-->
          <!--          <span>{{word.encoding.charAt(2))}}</span>-->
          <!--          <span>{{word.encoding.charAt(3))}}</span>-->
          <!--          <span>{{word.encoding.charAt(4))}}</span>-->
          <!--          <span>{{word.encoding.charAt(5))}}</span>-->
          <!--          <span>{{word.encoding.charAt(6))}}</span>-->
          <!--          <span>{{word.encoding.charAt(7))}}</span>-->
          <!--          <span>{{word.encoding.charAt(8))}}</span>-->
          <!--          <span>{{word.encoding.charAt(9))}}</span>-->
          <!--        </div>-->
        </div>
      </div>
    </div>
    <div v-else class="text-center">
      <h3>No words to show</h3>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Home',
  data() {
    return {
      words: [],
      limit: '',
      offset: '',
      wordForSearching: '',
      tmpSearching: ''
    }
  },
  mounted() {
    // this.getWords(this.limit, this.offset)
  },
  methods: {
    getWords(limit, offset) {
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8000/words/?limit=' + limit + '&offset=' + offset,
        auth: {
          username: 'admin',
          password: 'admin'
        }
      }).then(response => this.words = response.data.results)
          // eslint-disable-next-line no-unused-vars
          .catch(error => this.words = [{word: "No words"}]);
    },
    getSingleWord(word){
      this.tmpSearching = "Searching..."
      axios({
        method: 'get',
        url: 'http://127.0.0.1:8000/words/?search=' + word,
        auth: {
          username: 'admin',
          password: 'admin'
        }
      }).then(response => {
        this.words = response.data.results
        this.tmpSearching = ''
      })
          // eslint-disable-next-line no-unused-vars
          .catch(error => this.words = [{word: "No words"}]);
    },
    getGender(l) {
      switch (l) {
        case 'm':
          return "машки"
        case 'n':
          return "среден"
        case 'f':
          return "женски"
        default :
          return ""
      }
    },
    getTypeNoun(l) {
      switch (l) {
        case 'c':
          return "општа"
        case 'p':
          return "сопствена"
        default :
          return ""
      }
    },
    getNumber(l) {
      switch (l) {
        case 's':
          return "еднина"
        case 'p':
          return "множина"
        case 't':
          return "бројна"
        default :
          return ""
      }
    },
    getCase(l) {
      switch (l) {
        case 'n':
          return "номинатив"
        case 'v':
          return "вокатив"
        case 'o':
          return "акузатив"
        case 'd':
          return "датив"
        case 'a':
          return "акузатив"//од заменки
        default :
          return ""
      }
    },
    getDefiniteness(l) {
      switch (l) {
        case 'n':
          return "неопределен"
        case 'y':
          return "определен"
        case 'p':
          return "proximal - блиску"
        case 'd':
          return "distal - далеку"
        default :
          return ""
      }
    },
    getTypeVerb(l) {
      switch (l) {
        case 'm':
          return "главен"
        case 'a':
          return "помошен"
        case 'o':
          return "модален"
        default :
          return ""
      }
    },
    getFormVerb(l) {
      switch (l) {
        case 'i':
          return "индикативен - исказен"
        case 'm':
          return "императивен - заповеден"
        case 'p':
          return "партиципален - погодбен (Можен)????????"
        default :
          return ""
      }
    },
    getTenseVerb(l) {
      switch (l) {
        case 'p':
          return "сегашно"
        case 'i':
          return "имперфект - минато определено несвршено"
        case 'a':
          return "аорист - минато определно свршено"
        default :
          return ""
      }
    },
    getPersonVerb(l) {
      switch (l) {
        case '1':
          return "прво"
        case '2':
          return "второ"
        case '3':
          return "трето"
        default :
          return ""
      }
    },
    getVoiceVerb(l) { // залог
      switch (l) {
        case 'a':
          return "активен (глаголска Л-форма)"
        case 'p':
          return "пасивен (verbal adjective, neuter gender, singular) "//Vo notes 3.13.3.1 treta podtochka
        default :
          return ""
      }
    },
    getYesNo(l) {
      switch (l) {
        case 'n':
          return "не"
        case 'y':
          return "да"
        default :
          return ""
      }
    },
    getAspectVerb(l) {
      switch (l) {
        case 'p':
          return "progressive - продолжено"
        case 'e':
          return "perfective - непродолжено"
        default :
          return "both"
      }
    },
    getTypeAdjective(l) {
      switch (l) {
        case 'f':
          return "квалитативни"
        case 's':
          return "присвојни"
        case 'o':
          return "редна? - ordinal"
        default :
          return ""
      }
    },
    getDegreeAdjective(l) {
      switch (l) {
        case 'p':
          return "позитивна"
        case 'c':
          return "компаративна - споредбена"
        case 's':
          return "суперлативна"
        case 'e':
          return "elative (со пре напред)"
        default :
          return ""
      }
    },
    getTypePronoun(l) {
      switch (l) {
        case 'p':
          return "лична"
        case 'd':
          return "показна"
        case 'i':
          return "неопределена"
        case 's':
          return "присвојна"
        case 'q':
          return "прашална"
        case 'r':
          return "односна??"
        case 'x':
          return "reflexive"
        case 'z':
          return "негативна"
        case 'g':
          return "general"
        default :
          return ""
      }
    },

  }
}
</script>
<!--<style lang="scss">-->