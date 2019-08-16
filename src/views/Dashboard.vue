<template>
  <div class="dashboard">

    <v-snackbar v-model="snackbarProject" :timeout="4000" top color="success">
      <span>Awesome! You added a new project.</span>
      <v-btn color="white" text @click="snackbarProject = false">Close</v-btn>
    </v-snackbar>

    <h1 class="subtitle-1 grey--text">Dashboard</h1>

    <v-container class="my-5">

      <v-layout row justify-start class="mb-3">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn small text color="grey" @click="sortBy('title')" v-on="on">
              <v-icon small left>folder</v-icon>
              <span class="caption text-lowercase">By project name</span>
            </v-btn>
          </template>
          <span>Sort by project name</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn small text color="grey" @click="sortBy('person')" v-on="on">
              <v-icon small left>person</v-icon>
              <span class="caption text-lowercase">By Person</span>
            </v-btn>
          </template>
          <span>Sort by project author</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn small text color="grey" @click="sortBy('status')" v-on="on">
<v-icon small left>mdi-traffic-light</v-icon>
              <span class="caption text-lowercase">By Status</span>
            </v-btn>
          </template>
          <span>Sort by project status</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <PopupProject @projectAdded="snackbarProject = true" />
      </v-layout>
      
      <v-card v-if="myProjects.length == 0" class="d-flex align-center" height="100">
        <v-layout>
          <v-flex xs12>
            <div class="text-center grey--text">
              You don't have any projects.
            </div>
          </v-flex>
        </v-layout>
      </v-card>
      <template v-for="project in myProjects">
        <v-hover v-slot:default="{ hover }" :key="project.title">
          <v-card class="px-3 elevation-0" :class="{ 'on-hover': hover }" text :style="{ cursor: 'pointer'}">
            <v-layout row wrap :class="`pa-3 project ${project.status}`" @click="goToProject(project.id)">
              <v-flex xs12 md3>
                <div class="caption grey--text">Project title</div>
                <div>{{ project.title }}</div>
              </v-flex>
              <v-flex xs12 md5>
                <div class="caption grey--text">Description</div>
                <div>{{ project.description }}</div>
              </v-flex>
              <v-flex xs6 md2>
                <div class="caption grey--text">Person</div>
                <div>{{ project.person }}</div>
              </v-flex>
              <v-flex xs6 md2>
                <div class="text-end">
                  <v-chip small :class="`${project.status} white--text my-2 caption`">{{ project.status }}</v-chip>
                </div>
              </v-flex>
            </v-layout>
            <v-divider></v-divider>
          </v-card>
        </v-hover>
      </template>

    </v-container>
   
  </div>
</template>

<script>
import PopupProject from '@/components/PopupProject'
import db from '@/fb'
import firebase from 'firebase/app';
import 'firebase/auth';

export default {
  name: 'Dashboard',
  components: { 
    PopupProject,
  },
  data() {
    return {
      snackbarProject: false,
      projects: [],
      name: '',
      id: '',
    }
  },
  methods: {
    sortBy(prop) {
      this.projects.sort((a,b) => a[prop] < b[prop] ? -1 : 1)
    },
    goToProject(id) {
      this.$router.push({ name: 'ViewProject', params: { id: id } });
    }
  },
  computed: {
    myProjects() {
      return this.projects.filter(project => {
        return project.person === this.id && project.status != 'TODO'
      })
    }
  },
  created() {
    db.collection('projects').onSnapshot(res => {
      const changes = res.docChanges();

      changes.forEach(change => {
        if (change.type === 'added') {
          this.projects.push({
            ...change.doc.data(),
            id: change.doc.id
          })
        }  
      })
    })
  },
  mounted(){
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        //console.log(user)
      } else {
        // No user is signed in.
        //console.log('No user is signed in')
      }
    });

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
    })
  }
}
</script>

<style scoped>
.v-card {
  transition: background-color .4s ease-in-out;
}
.v-card.on-hover {
  background-color: #F5F5F5;
 }

.project.complete{
  border-left: 4px solid #3cd1c2;
}
.project.ongoing{
  border-left: 4px solid #ffaa2c;
}
.project.upcoming{
  border-left: 4px solid #f83e70;
}
.v-chip.complete{
  background: #3cd1c2 !important;
}
.v-chip.ongoing{
  background: #ffaa2c !important;
}
.v-chip.upcoming{
  background: #f83e70 !important;
}

</style>
