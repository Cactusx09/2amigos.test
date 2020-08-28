<template lang="pug">
  div.section.signup
    .container
      .columns
        .column.is-one-third.is-offset-one-third
          h1.title.has-text-centered Signup
          form(@submit.prevent="userSignup()")
            .field.signup__username.mb-5
              label.label Username
              .control.has-icons-left.has-icons-right
                input.input(
                  :class="{ 'is-danger': login.error }"
                  v-model="login.value"
                  type='text'
                )
                span.icon.is-small.is-left
                  v-icon(name="user")
                template(v-if="login.error")
                  p.help.is-danger {{ login.error }}!
                    nuxt-link.ml-1(to="login") Login
                  a.icon.is-small.is-right.has-text-danger(
                    @click.prevent="login.value = ''; login.error = null"
                  )
                    v-icon(name="times")
            .field.signup__password
              label.label Password
              .control.has-icons-left.has-icons-right
                input.input(
                  :class="{ 'is-danger': password.error }"
                  v-model="password.value"
                  type="password"
                )
                span.icon.is-small.is-left
                  v-icon(name="envelope")
                template(v-if="password.error")
                  p.help.is-danger {{ password.error }}!
                    nuxt-link.ml-1(to="password") Login
                  a.icon.is-small.is-right.has-text-danger(
                    @click.prevent="password.value = ''; password.error = null"
                  )
                    v-icon(name="times")

            .columns.pt-4
              .column
                button.button.is-medium.is-success.is-fullwidth(
                  :disabled="login.value.length === 0 || password.value.length === 0"
                  type="submit"
                ) Submit
</template>

<script>
export default {
  auth: false,

  data() {
    return {
      login: {
        value: '',
        error: null,
      },
      password: {
        value: '',
        error: null,
      },
    }
  },
  methods: {
    async userSignup() {
      const data = {
        login: this.login.value,
        password: this.password.value,
      }
      await this.$axios
        .post('/signup', data)
        .then(() => {
          this.$auth
            .loginWith('local', { data })
            .then(() => this.$router.push('/'))
        })
        .catch(({ response }) => {
          this.login.error = null
          this.password.error = null

          const { field, message } = response.data
          this[field].error = message
        })
    },
  },
}
</script>

<style lang="sass" scoped>
.signup
  &__username,
  &__password
    .icon.is-small.is-right
      pointer-events: all
</style>
