<template lang="pug">
  div {{ error }}
    div(v-if="$auth.loggedIn")
      h1 WOW!!!
      div {{ $auth.user }}
      note-list
      button(@click="createNote") create note
      button(@click="logout") logout
    div(v-else)
      nuxt-link(to="sign-up") sign up
      nuxt-link(to="login") login
</template>

<script>
import NoteList from '~/components/NoteList'

export default {
  components: { NoteList },
  data() {
    return {
      error: null,
    }
  },
  methods: {
    async logout() {
      try {
        const logout = await this.$auth.logout()
        console.log(logout)
      } catch (error) {
        debugger
        this.error = error
      }
    },
    createNote() {
      console.log('lll')
    },
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
