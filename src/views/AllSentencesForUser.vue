<template>
  <div class="container text-center">
    <div class="row">
      <a :href="'/login'" class="bg-light btn text-primary">Логирај се</a>
      <a :href="'/'" class="bg-light btn text-primary">Речник</a>
      <a :href="'/sentence'" class="bg-light btn text-primary" v-if="token !== null">Сегментација</a>
      <a :href="'/all-sentences'" class="btn text-white btn-info" v-if="token !== null">Сите реченици</a>
    </div>
    <h1 class="mt-5">All sentences for user</h1>
    <div class="col-12 mt-5">
      <table class="table">
        <thead class="thead-dark">
        <tr>
          <th>
            Sentence
          </th>
          <th>
            Words
          </th>
          <th>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="sentence in sentences" v-bind:key="sentence.id">
          <td>
            {{ sentence.sentence }}
          </td>
          <td>
            {{ sentence.words }}
          </td>
          <td>
            <a class="btn btn-sm btn-primary mr-2" v-bind:href='"/edit-sentence/" + sentence.id'>Edit</a>
            <a class="btn btn-sm btn-danger" v-on:click="deleteSentence(sentence.id)">Delete</a>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {TokenService} from "@/services/token";

export default {
  name: "AllSentencesForUser",
  data() {
    return {
      token: TokenService.getToken(),
      sentences: null
    }
  },
  methods: {
    deleteSentence(id) {
      console.log("Sentence deleted " + id)
      this.sentences = this.sentences.filter(function (sentence) {
        return sentence.id !== id
      })
      axios({
        method: 'delete',
        url: 'http://127.0.0.1:8000/sentence/' + id,
        headers: {
          'Authorization': "Token " + this.token,
        }
        // eslint-disable-next-line no-unused-vars
      }).then(response => {
      })
          // eslint-disable-next-line no-unused-vars
          .catch(error => console.log(error));
    }
  },
  created() {
    axios({
      method: 'get',
      url: 'http://127.0.0.1:8000/sentence/?search=' + this.token,
      headers: {
        'Authorization': "Token " + this.token,
      }
    }).then(response => {
      this.sentences = response.data.results
    })
        // eslint-disable-next-line no-unused-vars
        .catch(error => console.log(error));
  }
}
</script>

<style scoped>

</style>