<template lang="pug">
  div
    .error {{ error }}
    h2 Login
    form(@submit.prevent="userLogin")
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
  data() {
    return {
      login: {
        login: '',
        password: '',
      },
      error: null,
    }
  },
  methods: {
    async userLogin() {
      try {
        const response = await this.$auth.loginWith('local', {
          data: this.login,
        })
        console.log(response)
      } catch (err) {
        console.log(err)
        this.error = err
      }
    },
  },
}
</script>
