<template lang="pug">
  div.section.login
    .container
      .columns
        .column.is-one-third.is-offset-one-third
          h1.title.has-text-centered Login
          form(@submit.prevent="userLogin")
            .field.login__username.mb-5
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
                    nuxt-link.ml-1(to="signup") Signup
                  a.icon.is-small.is-right.has-text-danger(
                    @click.prevent="login.value = ''; login.error = null"
                  )
                    v-icon(name="times")
            .field.login__password
              label.label Password
              .control.has-icons-left.has-icons-right
                input.input(
                  :class="{ 'is-danger': password.error }"
                  v-model="password.value"
                  type="password"
                )
                span.icon.is-small.is-left
                  v-icon(name="envelope")
                span.icon.is-small.is-right
                template(v-if="password.error")
                  p.help.is-danger {{ password.error }}
                  a.icon.is-small.is-right.has-text-danger(
                    @click.prevent="password.value = ''; password.error = ''"
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
    async userLogin() {
      await this.$auth
        .loginWith('local', {
          data: {
            login: this.login.value,
            password: this.password.value,
          },
        })
        .then(() => {
          console.log('Successully login')
        })
        .catch(({ response }) => {
          if (response.status === 401) {
            this.login.error = null
            this.password.error = null

            const { field, message } = response.data
            this[field].error = message
          }
        })
    },
  },
}
</script>

<style lang="sass" scoped>
.login
  &__username,
  &__password
    .icon.is-small.is-right
      pointer-events: all
</style>
