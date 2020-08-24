<template lang="pug">
  div.container
    div(v-if="$auth.loggedIn")
      note-list
</template>

<script>
import NoteList from '~/components/Note/NoteList'

export default {
  components: { NoteList },
}
</script>
