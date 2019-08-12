<template>
  <div class="view-project">

    <h1 class="subtitle-1 grey--text">Project: {{ project.title }}</h1>

    <v-card class="px-3 elevation-0 grey lighten-5" text>
      <v-layout row wrap class="pa-3">
        <v-flex xs12 md6>
          <div class="caption grey--text">Title</div>
          <div>{{ project.title }}</div>
        </v-flex>
        <v-flex xs12 md6>
          <div class="caption grey--text">Description</div>
          <div>{{ project.description }}</div>
        </v-flex>
        <v-flex xs12 md6>
          <div class="caption grey--text">Person</div>
          <div>{{ project.person }}</div>
        </v-flex>
        <v-flex xs12 md6>
          <div class="caption grey--text">Status</div>
          <div>{{ project.status }}</div>
        </v-flex>
      </v-layout>
      <v-divider></v-divider>
    </v-card>

    <v-card class="px-3 elevation-0 grey lighten-5" text>
      <ViewDiagram />
    </v-card>

  </div>
</template>

<script>
import ViewDiagram from '@/components/project/ViewDiagram'
import db from '@/fb'

export default {
  name: 'ViewProject',
  components: { 
    ViewDiagram,
  },
  data(){
    return{
      project: {title: ''},
      tab: null,
      items: [
        'Overview', 'Elements', 'Diagram',
      ],
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',

    }
  },
  created(){
    let ref = db.collection('projects')
    ref.doc(this.$route.params.id).get()
    .then(project => {
      this.project = project.data()
    })
  }
}
</script>

<style>

</style>

