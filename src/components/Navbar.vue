<template>
  <nav>

    <v-app-bar text app class="elevation-0 grey lighten-5">
      <v-app-bar-nav-icon v-if="userLogedIn()" @click="drawer = !drawer" class="grey--text"></v-app-bar-nav-icon>
      <router-link :to="{ name: 'Home' }">
        <v-img
          class="mx-2"
          src="/logo.png"
          max-height="24"
          max-width="24"
          contain
        ></v-img>
      </router-link>
      <v-toolbar-title class="toolbar-title text-uppercase">
        <router-link :to="{ name: 'Home' }">
          <span class="grey--text">E-FM</span>
          <span class="grey--text font-weight-light">TOOL{{ this.$store.user }}</span>
        </router-link>
      </v-toolbar-title>
      
      <v-spacer></v-spacer>
      
      <v-btn v-if="!userLogedIn()" text color="grey" :to="{ path: '/signup'}" append>
        <span>Sign Up</span>
        <v-icon right>mdi-account-plus</v-icon>
      </v-btn>
      <v-btn v-if="!userLogedIn()" text color="grey" :to="{ path: '/login'}" append>
        <span>Login</span>
        <v-icon right>mdi-login</v-icon>
      </v-btn>
      <v-btn v-if="userLogedIn()" text color="grey" @click="logout">
        <span>Logout</span>
        <v-icon right>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-if="userLogedIn()" app v-model="drawer" class="secondary">
      <v-layout column align-center>
        <v-flex class="mt-5 text-center">
          <v-avatar size="100">
            <img src="/user.png">
          </v-avatar>
          <p class="white--text subheading mt-1">{{ this.userName() }}</p>
        </v-flex>
      </v-layout>

      <v-list>
        <v-list-item router :to="'/profile/' + this.userSlug()">
          <v-list-item-action>
            <v-icon class="white--text">mdi-account-circle</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text">Profile</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item router :to="'/dashboard'">
          <v-list-item-action>
            <v-icon class="white--text">dashboard</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text">Dashboard</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

      </v-list>

      <template v-slot:append>
        <div class="text-center">
                    
          <v-dialog v-model="dialogTerms" width="500">
              <template v-slot:activator="{ on }">        
                    <v-chip class="ma-2" pill v-on="on">
                      <v-icon left>mdi-file-document-box-check-outline</v-icon>
                      Terms
                    </v-chip>
              </template>

              <v-card>
                  <v-card-title class="headline grey lighten-2" primary-title>
                      Terms
                  </v-card-title>

                  <v-card-text>
                    <p></p>
                    <p>Welcome to our website. If you continue to browse and use this website, you are agreeing to comply with and be bound by the following terms and conditions of use, which together with our privacy policy govern our relationship with you in relation to this website. If you disagree with any part of these terms and conditions, please do not use our website.</p>
                    <p>The term 'EFM Tool' or 'us' or 'we' refers to the owner of the website. The term 'you' refers to the user or viewer of our website.</p>
                    <p>The use of this website is subject to the following terms of use:</p>
                    <ul>
                      <li>
                        Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.
                      </li>
                      <li>
                        Your use of any information or materials on this website is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.
                      </li>
                      <li>
                        This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.
                      </li>
                      <li>
                        All trade marks reproduced in this website which are not the property of, or licensed to, the operator are acknowledged on the website.
                      </li>
                      <li>
                        Unauthorised use of this website may give rise to a claim for damages and/or be a criminal offence.
                      </li>
                      <li>
                        From time to time this website may also include links to other websites. These links are provided for your convenience to provide further information. They do not signify that we endorse the website(s). We have no responsibility for the content of the linked website(s).
                      </li>
                      <li>
                        Your use of this website and any dispute arising out of such use of the website is subject to the laws of Sweden.
                      </li>
                    </ul>

                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="dialogTerms = false">
                          Accept
                      </v-btn>
                  </v-card-actions>
              </v-card>
          </v-dialog>

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
                    The EU General Data Protection Regulation (GDPR) applies when having different users, so this will be updated accordingly soon. So far, we only store your name and email if you sign up for an account.
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="primary" text @click="dialogPrivacy = false">
                          Accept
                      </v-btn>
                  </v-card-actions>
              </v-card>
          </v-dialog>

        </div>
      </template>
    </v-navigation-drawer>



    <v-dialog v-model="betaNotice">
      <v-card class="text-center" color="error" dark>
        <v-card-title class="text-center">Warning</v-card-title>
        <v-card-text>This site is under development, it will eat your homework. Also, there might be cookies involved in its operation. You can't eat them though.</v-card-text>
        <v-card-text><v-btn outlined color="white" class="" @click="betaNotice = !betaNotice">Acknowledge</v-btn></v-card-text>
      </v-card>
    </v-dialog>

  </nav>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth';
import db from '@/fb'

export default {
  name: 'Navbar',
  data() {
    return {
      betaNotice: true,
      drawer: false,
      id: '',
      profile: null,
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
      this.$store.dispatch('logoutAction')
        .then(() => {
          this.$router.push({ name: 'Home' })
        })
    },
    userLogedIn () {
      return Boolean(this.$store.getters.user)
    },
    userSlug () {
      let user = this.$store.getters.user
      return user.slug
    },
    userName () {
      let user = this.$store.getters.user
      try {
        return user.name
      } catch {
        return ''
      }
    },
  },
  created() {
    // Get the current user if it is signed-in
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        let ref = db.collection('users')

        //get current user
        ref.where('user_id', '==', firebase.auth().currentUser.uid).get()
          .then(snapshot => {
            snapshot.forEach(doc => {
              let name = doc.data().name;
              let slug = doc.id;
              this.$store.commit('setUser', {name: name, slug: slug, user_id: user.uid})
            })
          })
      } else {
        // No user is signed in.
        this.$store.commit('setUser', null)
      }
    });
  }
}
</script>

<style>
.toolbar-title a {
  text-decoration: none;
}
</style>
