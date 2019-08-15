<template>
    <div class="login container">
        <h2>Login</h2>
        <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field clearable v-model="email" label="E-mail" required></v-text-field>
            <v-text-field clearable v-model="password" label="Password" :append-icon="showPassword ? 'visibility' : 'visibility_off'" :type="showPassword ? 'text' : 'password'" @click:append="showPassword = !showPassword" required></v-text-field>
            <v-btn :disabled="!valid" color="success" class="mr-4" @click="login">Login</v-btn>
            <v-btn color="error" class="mr-4" @click="reset">Reset</v-btn>
            <v-alert class="mt-4" dense outlined type="error" v-if="feedback">{{ this.feedback }}</v-alert>
        </v-form>
        <p class="text-center"><router-link :to="{ name: 'Signup' }">Don't have an account? Sign Up</router-link></p>
    </div>
</template>

<script>

export default {
    name: 'Login',
    data(){
        return {
            showPassword: false,
            valid: false,
            email: '',
            password: '',
            feedback: '',
        }
    },
    methods: {
    login(){
        if(this.email && this.password){
            this.feedback = null
            
            let user = {email: this.email, password: this.password}

            this.$store.dispatch('loginAction', user)
                .then(() => {
                    this.$router.push({ name: 'Dashboard' })
                })
                .catch(err => {
                    this.feedback = err.message
                })
        } else {
            this.feedback = 'Please fill in both fields'
        }
    },
    reset () {
        this.email = '';
        this.password = '';
    },

    }
}
</script>

<style>
.login {
    max-width: 400px;
    margin-top: 60px;
}
.login p {
    margin-top: 60px;
}
</style>
