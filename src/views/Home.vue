<template>
  <v-container fluid class="home">
    <v-row justify="center"class="elevation-0 grey lighten-5 display-3">
      <v-col cols="4">
        <v-row
          align="center"
          justify="start"
          class="font-weight-thin"
          style="min-height: 300px;"
        >
          EFM Tool helps product design teams succeed
        </v-row>
        <v-row>
          <v-btn router to="Signup" color="success" dark large rounded>Get started</v-btn>
        </v-row>
      </v-col>
      <v-col cols="2">
        <v-row
          align="center"
          justify="center"
          style="min-height: 300px;"
        >
            <v-img src="logo.png" aspect-ratio="1" max-width="128" max-height="128"></v-img>
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
  },
  computed: {
  },
  created() {
  },
  mounted(){
  }
}
</script>

<style scoped>

</style>
