<template lang="pug">
  div
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
      }
    },
  },
}
</script>
