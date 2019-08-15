<template>
  <v-container fluid class="home">
    <v-row justify="center" class="elevation-0 display-3">
      <v-col cols="10">
        <v-row
          align="center"
          justify="start"
          class="font-weight-thin"
          style="min-height: 300px;"
        >
          EFM Tool helps product design teams succeed
        </v-row>
        <v-row>
          <v-btn v-if="userLogedIn()" class="ma-2" router to="Dashboard" color="success" dark large rounded>Get started</v-btn>
          <v-btn v-if="!userLogedIn()" class="ma-2" router to="Signup" color="success" dark large rounded>Get started</v-btn>
          <v-btn class="ma-2" router to="docs" color="primary" dark large rounded text>
            <v-icon left>mdi-information</v-icon> Learn more
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

export default {
  name: 'Home',
  components: { 
  },
  data() {
    return {
    }
  },
  methods: {
    userLogedIn () {
      return Boolean(this.$store.getters.user)
    },
  },
  computed: {
  },
  created() {
  },
  mounted(){
  }
}
</script>

<style>
main {
  background: url("/background.jpg") fixed 10% 10%;
}
</style>
