<template>
    <div class="signup container">
        <h2>Create an account</h2>
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field clearable v-model="name" :rules="nameRules" label="Name" required></v-text-field>
            <v-text-field clearable v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
            <v-text-field clearable v-model="password" :rules="passwordRules" label="Password" :append-icon="showPassword ? 'visibility' : 'visibility_off'" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" required></v-text-field>
            <v-checkbox v-model="checkbox" :rules="[v => !!v || 'You must agree the terms to continue.']" label="Do you agree to the Terms and Privacy Policy?"
                required></v-checkbox>
            <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate">
                Sign Up
            </v-btn>
            <v-btn color="error" class="mr-4" @click="reset">
                Reset
            </v-btn>
            <v-alert class="mt-4" dense outlined type="error" v-if="feedback">{{ this.feedback }}</v-alert>
        </v-form>
        <p class="text-center"><router-link :to="{ name: 'Login' }">Already have an account? Login</router-link></p>
    </div>
</template>


<script>
import slugify from 'slugify'
import db from '@/fb'

  export default {
    name: 'Signup',
    data: () => ({
      showPassword: false,
      valid: false,
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length >= 3) || 'Name must be more than 3 characters',
      ],
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      password: '',
      passwordRules: [
          v => v.length >= 8 || 'Min 8 characters',
      ],
      checkbox: false,
      slug: '',
      feedback: '',
    }),
    methods: {
      validate () {
        if (this.$refs.form.validate()) {
          this.snackbarProject = true;

          let slug = slugify(this.name, {
            replacement: '-',
            remove: /[$*_+~.()'"!\-:@]/g,
            lower: true
          })
          
          let newUser = {name: this.name, email: this.email, password: this.password, slug: slug}

          this.$store.dispatch('signupAction', newUser)
            .then(() => {
              this.$router.push({ name: 'Dashboard' })
            })
            .catch(err => {
              this.feedback = err.message
            })
        }
      },
      reset () {
        this.name = '';
        this.email = '';
        this.password = '';
        this.checkbox = false;
        this.resetValidation();
      },
      resetValidation () {
        this.$refs.form.resetValidation()
      },
    },
  }
</script>
<style>
.signup {
    max-width: 400px;
    margin-top: 60px;
}
.signup p {
    margin-top: 60px;
}
</style>