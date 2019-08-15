import firebase from 'firebase/app';
import 'firebase/auth';
import db from '@/fb'

export default {
  signupAction({commit}, payload) {
    return new Promise((resolve, reject) => {
      commit('setUserLoginStatus', 'loading')
      // Check if the slug is already in use
      let ref = db.collection('users').doc(payload.slug)
      ref.get().then(doc => {
        if (doc.exists) {
          throw {message: 'The name is already in use by another account.'}
        } else {
          // This alias does not yet exists in the db
          firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
            .then(cred => {
              // Save the user in the 'users' collection too
              ref.set({
                name: payload.name,
                user_id: cred.user.uid
              })
              .then(() => {
                commit('setUser', {name: payload.name, slug: payload.slug, user_id: cred.user.uid})
                commit('setUserLoginStatus', 'success')
                commit('setUserLoginError', null)
                resolve()
              })
            })
            .catch(err => {
              commit('setUserLoginStatus', 'failure')
              commit('setUserLoginError', err)
              reject(err)
            })
        }
      })
      .catch(err => {
        commit('setUserLoginStatus', 'failure')
        commit('setUserLoginError', err)
        reject(err)
      })
    })
  },
  loginAction({commit}, payload) {
    return new Promise((resolve, reject) => {
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(cred => {
          // Get additional user data from the database
          let ref = db.collection('users').where('user_id', '==', cred.user.uid)
          ref.get().then(snapshot => {
            snapshot.forEach(doc => {
              commit('setUser', {name: doc.data().name, slug: doc.id, user_id: cred.user.uid})
              commit('setUserLoginStatus', 'success')
              commit('setUserLoginError', null)
              resolve()
            })
          })

        })
        .catch(err => {
          commit('setUserLoginStatus', 'failure')
          commit('setUserLoginError', err)
          reject(err)
        })
    })
  },
  logoutAction({commit}) {
    firebase.auth().signOut()
      .then(() => {
        commit('setUser', null)
        commit('setUserLoginStatus', null)
        commit('setUserLoginError', null)
      })
      .catch(err => {
        commit('setUserLoginStatus', 'failure')
        commit('setUserLoginError', err.message)
      })
  },
}