<template lang="pug">
  div.section
    .container
      .columns
        .column.is-one-third.is-offset-one-third
          //- .error {{ error }}
          h1.title.has-text-centered Signup
          form(@submit.prevent="userSignup")
            .field.my-5
              label.label Username
              .control.has-icons-left.has-icons-right
                input.input(
                  v-model="login.login"
                  type='text'
                )
                span.icon.is-small.is-left
                  v-icon(name="user")
                //- span.icon.is-small.is-right
              //- p.help.is-success This username is available
            .field
              label.label Password
              .control.has-icons-left.has-icons-right
                input.input(
                  v-model="login.password"
                  type="password"
                )
                span.icon.is-small.is-left
                  v-icon(name="envelope")
                //- span.icon.is-small.is-right
              //- p.help.is-danger This email is invalid

            .columns.pt-4
              .column
                button.button.is-medium.is-success.is-fullwidth(type="submit") Submit
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
