import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase'
import db from '@/fb'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user: null,
    userLoginStatus: null,
    userLoginError: null,
    project: null,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    removeUser(state, payload) {
      state.user = null;
    },
    setUserLoginStatus(state, payload) {
      state.userLoginStatus = payload;
    },
    setUserLoginError(state, payload) {
      state.userLoginError = payload;
    },
  },
  actions: {
    signupAction({commit}, payload) {
      commit('setUserLoginStatus', 'loading')
      // Convert the name to a slug
      let slug = slugify(payload.name, {
        replacement: '-',
        remove: /[$*_+~.()'"!\-:@]/g,
        lower: true
      })
      // Check if the slug is already in use
      let ref = db.collection('users').doc(slug)
      ref.get().then(doc => {
        if (doc.exists) {
          throw 'This a user with this name already exists, please choose another.'
        } else {
          // This alias does not yet exists in the db
          firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then(cred => {
              // Save the user in the 'users' collection too
              ref.set({
                name: payload.name,
                user_id: cred.user.uid
              })
            })
            .then(() => {
              commit('setUserLoginStatus', response.user.uid)
              commit('setUserLoginStatus', 'in')
              commit('setUserLoginError', null)
            })
            .catch(err => {
              commit('setUserLoginStatus', 'failure')
              commit('setUserLoginError', err.message)
            })
        }
      })
    },
    loginAction({commit}, payload) {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(response => {
          commit('setUserLoginStatus', response.user.uid)
          commit('setUserLoginStatus', 'in')
          commit('setUserLoginError', null)
        }).catch(err => {
          commit('setUserLoginStatus', 'failure')
          commit('setUserLoginError', err.message)
        })
    },
    logoutAction() {
      firebase.auth().signOut()
        .then(response => {
          commit('setUserLoginStatus', null)
          commit('setUserLoginStatus', 'out')
          commit('setUserLoginError', null)
        }).catch(err => {
          commit('setUserLoginStatus', 'failure')
          commit('setUserLoginError', err.message)
        })
    },
  },
  getters: {
    user(state) {
      return state.user
    },
    userLoginStatus(state) {
      return state.userLoginStatus
    },
    userLoginError(state) {
      return state.userLoginError
    },
  },
})