import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import project from './project'

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    auth,
    project,
  },
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
})