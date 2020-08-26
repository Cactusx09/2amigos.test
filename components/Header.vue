<template lang="pug">
  header.box.py-1
    nav.navbar
      .navbar-brand
        .navbar-item
          h2
            b 2amigos-notes

      .navbar-end
        .navbar-item
          .buttons
            template(v-if="!$auth.user")
              nuxt-link.button.is-small.is-primary(to="signup") sign up
              nuxt-link.button.is-small.is-success.is-light(to="login") login
            template(v-else)
              p.mb-1 Hi, #[b {{ $auth.user.login }}]! Let's note!
              button.button.is-small.is-danger.is-light.ml-4(@click="logout") logout
</template>

<script>
export default {
  methods: {
    data() {
      return {
        error: null,
      }
    },
    async logout() {
      try {
        const logout = await this.$auth.logout()
        console.log(logout)
      } catch (error) {
        this.error = error
      }
    },
  },
}
</script>
