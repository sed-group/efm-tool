<template>
  <nav>

    <v-app-bar text app class="elevation-0 grey lighten-5">
      <v-app-bar-nav-icon v-if="user" @click="drawer = !drawer" class="grey--text"></v-app-bar-nav-icon>
      <v-img
        class="mx-2"
        src="/logo.png"
        max-height="24"
        max-width="24"
        contain
      ></v-img>
      <v-toolbar-title class="text-uppercase grey--text">
        <span>E-FM</span>
        <span class="font-weight-light">TOOL</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

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

    <v-navigation-drawer v-if="user" app v-model="drawer" class="secondary">
      <v-layout column align-center>
        <v-flex class="mt-5 text-center">
          <v-avatar size="100">
            <img src="/user.png">
          </v-avatar>
          <p class="white--text subheading mt-1">{{ this.name }}</p>
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

<!--         <v-list-group class="white--text" v-for="item in items" :key="item.title" v-model="item.active" :prepend-icon="item.action"
            no-action>
            <template v-slot:activator>
                <v-list-item-content>
                    <v-list-item-title class="white--text" v-text="item.title"></v-list-item-title>
                </v-list-item-content>
            </template>

            <v-list-item v-for="subItem in item.items" :key="subItem.title" @click="">
                <v-list-item-content>
                    <v-list-item-title class="white--text" v-text="subItem.title"></v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list-group> -->

      </v-list>

      <template v-slot:append>
        <div class="text-center">

          <v-dialog v-model="dialogPrivacy" width="500">
              <template v-slot:activator="{ on }">        
                    <v-chip class="ma-2" pill v-on="on">
                      <v-icon left>mdi-incognito</v-icon>
                      Privacy Policy
                    </v-chip>
              </template>

              <v-card>
                  <v-card-title class="headline grey lighten-2" primary-title>
                      Privacy Policy
                  </v-card-title>

                  <v-card-text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                      dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                      ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                      nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                      anim id est laborum.
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="dialogPrivacy = false">
                          Sounds fair
                      </v-btn>
                  </v-card-actions>
              </v-card>
          </v-dialog>
                    
          <v-dialog v-model="dialogTerms" width="500">
              <template v-slot:activator="{ on }">        
                    <v-chip class="ma-2" pill v-on="on">
                      <v-icon left>mdi-file-document-box-check-outline</v-icon>
                      Terms & Conditions
                    </v-chip>
              </template>

              <v-card>
                  <v-card-title class="headline grey lighten-2" primary-title>
                      Terms & Conditions
                  </v-card-title>

                  <v-card-text>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                      dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                      ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                      nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                      anim id est laborum.
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="dialogTerms = false">
                          Sounds fair
                      </v-btn>
                  </v-card-actions>
              </v-card>
          </v-dialog>

        </div>
      </template>
    </v-navigation-drawer>



    <v-bottom-sheet v-model="betaNotice" persistent>
      <v-sheet class="text-center" height="250px">
        <div class="py-3"><p class="title"><v-icon color="red">mdi-alert</v-icon> Warning <v-icon color="red">mdi-alert</v-icon></p></div>
        <div class="py-3">This site is under development, it will eat your homework.</div>
        <div class="py-3">Also, there might be cookies involved in its operation. You can't eat them though.</div>
        <v-btn
          class="mt-6"
          color="error"
          @click="betaNotice = !betaNotice"
        >Acknowledge</v-btn>
      </v-sheet>
    </v-bottom-sheet>

  </nav>
</template>

<script>
import firebase from 'firebase'
import db from '@/fb'

export default {
  name: 'Navbar',
  data() {
    return {
      betaNotice: true,
      drawer: false,
      user: '',
      name: '',
      id: '',
      profile: null,
      links: [],
      dialogPrivacy: false,
      dialogTerms: false,
      items: [
        {
          action: 'mdi-clipboard-text-outline',
          title: 'Projects',
          active: false,
          items: [
            { title: 'Project 1' },
            { title: 'Project 2' },
            { title: 'Project 3' },
          ],
        },
      ],
    }
  },
  methods: {
    logout(){
      firebase.auth().signOut().then(() => {
        this.$router.push({ name: 'Login' })
      })
    },
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
    
    // get current user
    let user = firebase.auth().currentUser
    // find the user record
    db.collection('users').where('user_id', '==', user.uid).get()
    .then(snapshot => {
      snapshot.forEach((doc) => {
        this.name = doc.data().name;
        //console.log(this.name);
        this.id = doc.id;
        //console.log(this.id);
      });
      this.links = [
        { icon: 'mdi-account-circle', text: 'Profile', route: '/profile/'+this.id },
        { icon: 'dashboard', text: 'Dashboard', route: '/' },
        // { icon: 'folder', text: 'My Projects', route: '/projects' },
        // { icon: 'person', text: 'Team', route: '/team' },
      ]
    })
  }
}
</script>

<style>

</style>
