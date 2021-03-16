import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Sentence from "../views/Sentence";
import Login from "@/views/Login";
import AllSentencesForUser from "@/views/AllSentencesForUser";
import EditSentence from "@/views/EditSentence";
import {TokenService} from "@/services/token";

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/sentence',
    name: 'Sentence',
    component: Sentence,
    meta: {requiresAuth: true},
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/all-sentences',
    name: 'AllSentencesForUser',
    component: AllSentencesForUser,
    meta: {requiresAuth: true},
  },
  {
    path: '/edit-sentence/:id',
    name: 'EditSentence',
    component: EditSentence,
    meta: {requiresAuth: true},
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)) {
    if (TokenService.getToken()) {
      next()
      return
    }
    next('/login')
  } else {
    next()
  }
})

export default router
