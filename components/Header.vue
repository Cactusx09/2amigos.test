<template lang="pug">
  header
    nav.navbar
      .navbar-brand
        .navbar-item
          h2
            b 2amigos-notes

      .navbar-end
        .navbar-item
          .buttons
            template(v-if="!$auth.user")
              nuxt-link.button(to="signup") sign up
              nuxt-link.button(to="login") login
            template(v-else)
              span Hi, #[b {{ $auth.user.login }}]! Let's note!
              button.button(@click="logout") logout
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
