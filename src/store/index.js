import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import project from './project'
import diagram from './diagram'

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    auth,
    project,
    diagram,
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