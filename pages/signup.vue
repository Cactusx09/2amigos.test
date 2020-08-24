<template lang="pug">
  div
    h2 Signup
    form(@submit.prevent="userSignup")
      div
        label Username
        input(
          v-model="login.login"
          type="text"
        )

      div
        label Password
        input(
          v-model="login.password"
          type="text"
        )

      div
        button(type="submit") Submit
</template>

<script>
export default {
  auth: false,

  data() {
    return {
      login: {
        login: '',
        password: '',
      },
    }
  },
  methods: {
    async userSignup() {
      try {
        const response = await this.$axios.post('/signup', this.login)
        console.log(response)
        this.$auth.loginWith('local', {
          data: this.login,
        })
        this.$router.push('/')
      } catch (err) {
        console.log(err)
      }
    },
  },
}
</script>
