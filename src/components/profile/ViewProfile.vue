<template>
  <div class="view-profile">
    <div v-if="profile" class="card">
      <h1 class="subtitle-1 grey--text">Profile</h1>

      <v-card class="px-3 elevation-0" text>
        <v-layout row wrap class="pa-3">
          <v-flex xs12 md6>
            <div class="caption grey--text">Name</div>
            <div>{{ profile.name }}</div>
          </v-flex>
          <v-flex xs12 md6>
            <div class="caption grey--text">Email</div>
            <div>{{ profile.email }}</div>
          </v-flex>
          <v-flex xs12 md6>
            <div class="caption grey--text">User ID</div>
            <div>{{ profile.user_id }}</div>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
      </v-card>

    </div>
  </div>
</template>

<script>
import db from '@/fb'

export default {
  name: 'ViewProfile',
  data(){
    return{
      profile: null
    }
  },
  created(){
    let ref = db.collection('users')
    ref.doc(this.$route.params.id).get()
    .then(user => {
      this.profile = user.data()
    })
  }
}
</script>

<style>

</style>

