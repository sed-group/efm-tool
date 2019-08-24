<template>
  <v-dialog max-width="600px" v-model="dialog">
    <template v-slot:activator="{ on }">
      <v-btn small color="success" v-on="on">
        <v-icon small left>add</v-icon>
        <span class="caption text-uppercase">Project</span>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <h2 class="title">Add a New Project</h2>
      </v-card-title>
      <v-card-text>
        <v-form class="px-3" ref="form">
          <v-text-field v-model="title" label="Title" prepend-icon="folder" :rules="inputRules"></v-text-field>
          <v-textarea v-model="description" label="Information" prepend-icon="edit" :rules="inputRules"></v-textarea>
          <v-select v-model="status" prepend-icon="mdi-traffic-light" :items="projectStatuses" :hint="`${status}`" item-text="status" item-value="abbr" label="Status"></v-select>

          <v-spacer></v-spacer>

          <v-btn text @click="submit" class="success mx-0 mt-3" :loading="loading">Add Project</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import db from '@/fb'
import firebase from 'firebase/app';
import 'firebase/auth';
import router from '@/router'

export default {
  name: 'PopupProject',
  data() {
    return {
      title: '',
      description: '',
      inputRules: [
        v => !!v || 'This field is required',
        v => v.length >= 3 || 'Minimum length is 3 characters'
      ],
      loading: false,
      dialog: false,
      user: null,
      status: '',
      projectStatuses: [
        {status: 'Complete, archived', abbr: 'complete'}, 
        {status: 'Ongoing, active', abbr: 'ongoing'}, 
        {status: 'Upcoming, early planning', abbr: 'upcoming'}
      ],
    }
  },
  methods: {
    submit() {
      if(this.$refs.form.validate()) {
        this.loading = true
        const project = { 
          title: this.title,
          description: this.description,
          person: this.user.id,
          status: this.status,
        }
        db.collection('projects').add(project).then((docRef) => {
          this.loading = false
          this.dialog = false
          this.reset()
          this.resetValidation()
          // insert first element to the diagram
          let ref = db.collection("nodes").doc();
          let id = ref.id;
          let node = { 
            id: id,
            name: 'Click me',
            description: this.description,
            type: 'FR',
            parent: '',
            creator: this.user.id,
            project: docRef.id,
          }
          ref.set(node).then(() => {
            //this.$emit('nodeAdded')
          })
          //this.$emit('projectAdded')
          router.push('/project/' + docRef.id);
        })
      }
    },
    reset () {
      //this.$refs.form.reset()
      this.title = ''
      this.description = ''
      this.status = ''
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
  },
  created() {
    let ref = db.collection('users')

    //get current user
    ref.where('user_id', '==', firebase.auth().currentUser.uid).get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.user = doc.data();
          this.user.id = doc.id;
        })
      })
  }
}
</script>
