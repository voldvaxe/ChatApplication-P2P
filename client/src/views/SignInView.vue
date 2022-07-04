<template>
    <v-container class="my-10">
        <v-card class = 'mx-auto pa-10'
            elevation="4"
        > 
            <v-row>

                <v-col cols="12" md="6">
            <div class = 'text-h3 ml-4 mb-2'>
                Sign In
            </div>
  <v-form
    ref="form"
    v-model="valid"
    lazy-validation
  >

    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
    ></v-text-field>

    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="password"
      required
      type="password"
    ></v-text-field>


    <v-btn
        large
      :disabled="!valid"
      color="primary"
      class="mt-2"
      @click="submit"
    >
      Sing In
    </v-btn>
  </v-form>
                </v-col>
                
                <v-col cols="12" md="6">
                    <img  src="../assets/1.svg" >
                    <div align="center" class = 'mt-4'>
                        <router-link :to="{name: 'signUp'}">Create an Account</router-link>
                        </div>
                </v-col>


            </v-row>
        
        </v-card>
    </v-container>
</template>

<script>
import axios from 'axios';
    export default {
        name: 'SignIp',
        data: () => ({
      valid: true,
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      password: '',
        passwordRules:[
            v => !!v || 'you must type the password',
        ],
    }),

    methods: {
       submit : async function () {
        this.$refs.form.validate()
            try {
              await axios.post('user/login', {email: this.email, password: this.password}, {withCredentials: true});
              localStorage.setItem('firstLogin', true)
              window.location.href = "/";
            } catch (err) {
                console.log(err)
            }
          },
    },
    }
</script>

<style scoped>
  @media screen and (max-width: 610px) {
    img{
      display: none;
    }
  }
</style>
