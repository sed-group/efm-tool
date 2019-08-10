<template>
  <nav>

    <v-snackbar v-model="snackbarProject" :timeout="4000" top color="success">
      <span>Awesome! You added a new project.</span>
      <v-btn color="white" text @click="snackbarProject = false">Close</v-btn>
    </v-snackbar>

    <v-app-bar text app class="elevation-0 grey lighten-5">
      <v-app-bar-nav-icon @click="drawer = !drawer" class="grey--text"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase grey--text">
        <span>E-FM</span>
        <span class="font-weight-light">TOOL</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- dropdown menu -->
<!--       <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on" color="grey">
            <v-icon left>expand_more</v-icon>
            <span>Menu</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu> -->

      <v-btn v-if="!user" text color="grey" :to="{ path: '/signup'}" append>
        <span>Sign Up</span>
        <v-icon right>mdi-account-plus</v-icon>
      </v-btn>
      <v-btn v-if="!user" text color="grey" :to="{ path: '/login'}" append>
        <span>Login</span>
        <v-icon right>mdi-login</v-icon>
      </v-btn>
      <v-btn v-if="user" text color="grey" @click="logout">
        <span>Logout</span>
        <v-icon right>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-if="user" app v-model="drawer" class="primary">
      <v-layout column align-center>
        <v-flex class="mt-5 text-center">
          <v-avatar size="100">
            <img src="/inigo-alonso-fernandez.jpg">
          </v-avatar>
          <p class="white--text subheading mt-1">{{ this.name }}</p>
        </v-flex>
        <v-flex class="mt-4 mb-3">
          <Popup @projectAdded="snackbarProject = true" />
        </v-flex>
      </v-layout>
      <v-list>
        <v-list-item v-for="link in links" :key="link.text" router :to="link.route">
          <v-list-item-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text">{{ link.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

  </nav>
</template>

<script>
import Popup from './Popup'
import firebase from 'firebase'
import db from '@/fb'

export default {
  components: { Popup },
  name: 'Navbar',
  data() {
    return {
      drawer: false,
      links: [
        { icon: 'dashboard', text: 'Dashboard', route: '/' },
        { icon: 'folder', text: 'My Projects', route: '/projects' },
        { icon: 'person', text: 'Team', route: '/team' },
        { icon: 'poll', text: 'Diagram', route: '/diagram' }
      ],
      snackbarProject: false,
      user: '',
      name: '',
    }
  },
  created(){
    // let user = firebase.auth().currentUser
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        this.user = user
      } else {
        this.user = null
      }
    })    
  },
  methods: {
    logout(){
      firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'Login' })
      })
    },
  },
  mounted(){
    // get current user
    let user = firebase.auth().currentUser
    // find the user record and then update geocoords
    db.collection('users').where('user_id', '==', user.uid).get()
    .then(snapshot => {
      snapshot.forEach((doc) => {
        this.name = doc.data().name
      })
    })
  }
}
</script>

<style>

</style>
