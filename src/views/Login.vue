<template>
  <div class="container text-center">
    <div class="row">
      <a :href="'/login'" class="btn text-white btn-info">Логирај се</a>
      <a :href="'/'" class="bg-light btn text-primary">Речник</a>
      <a :href="'/sentence'" class="bg-light btn text-primary" v-if="token !== null">Сегментација</a>
      <a :href="'/all-sentences'" class="bg-light btn text-primary" v-if="token !== null">Сите реченици</a>
    </div>
    <h1 class="h1 mt-5">Логирај се</h1>
    <div class="col-6 offset-3 mt-5">
      <div class="form-group">
        <label for="username">Корисничко име</label>
        <input type="text" v-model="username" class="form-control" id="username">
      </div>
      <div class="form-group">
        <label for="pass">Лозинка</label>
        <input type="password" v-model="password" class="form-control" id="pass">
      </div>
      <button class="btn btn-primary ent" v-on:click="login()" v-if="token==null">Логирај се</button>
      <button class="btn btn-primary ent" v-on:click="logout()" v-if="token!=null">Одлогирај се</button>
      <br><button class="btn btn-primary mt-3" v-on:click="register()" v-if="token==null">Регистрирај се</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {TokenService} from "@/services/token";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      token: TokenService.getToken()
    }
  },
  methods: {
    login(){
      axios.post('http://127.0.0.1:8000/auth/', {
        username: this.username,
        password: this.password
      })
        .then(resp => {
          this.token = resp.data.token
          sessionStorage.setItem('user-token', resp.data.token)
          this.username = ""
          this.password = ""
        })
          // eslint-disable-next-line no-unused-vars
        .catch(error => {
          sessionStorage.removeItem('user-token')
        })
    },
    logout(){
      sessionStorage.removeItem('user-token')
      this.token = null
    },
    register(){
      axios.post('http://127.0.0.1:8000/users/', {
        username: this.username,
        password: this.password
      })
          .then(resp => console.log(resp))
          // eslint-disable-next-line no-unused-vars
          .catch(error => console.log(error))
    },
    setEnter(){
      document.querySelector("#pass").addEventListener("keyup", event => {
        if(event.key !== "Enter") return;
        document.querySelector(".ent").click();
        event.preventDefault();
      });

      document.querySelector("#username").addEventListener("keyup", event => {
        if(event.key !== "Enter") return;
        document.querySelector(".ent").click();
        event.preventDefault();
      });
    }
  },
  mounted() {
    this.setEnter()
  }
}
</script>

<style scoped>

</style>