<template lang="pug">
  div
    .note-list
      .note(
        v-for="note in notes"
        :key="note.id"
      ) {{ note.id }}
        note(:data="note.content")

    note(
      :data.sync="newNoteContent"
      :toolbarOptions="toolbarOptions.custom"
    )
      template(#toolbar="{ content }")
        button.ql-bold Bold
        button.ql-italic Italic
        select.ql-size
          option(value="small")
          option(selected)
          option(value="large")
          option(value="huge")
        select.ql-font
          option(selected="selected")
          option(value="serif")
          option(value="monospace")
        button.ql-script(value="sub")
        button.ql-script(value="super")
        button.ql-custom-button(@click="addNote(content)") Add Note
</template>

<script>
import Note from '~/components/Note'

export default {
  components: {
    Note,
  },

  data() {
    return {
      notes: [],
      newNoteContent: '',
      toolbarOptions: {
        custom: '#toolbar',
        extended: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ script: 'sub' }, { script: 'super' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ direction: 'rtl' }],
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['clean'],
          ['link', 'image', 'video'],
        ],
      },
    }
  },

  async created() {
    const { data } = await this.$axios.get('/notes', {
      params: {
        userId: this.$auth.user.id,
      },
    })
    this.notes = data.notes
  },

  methods: {
    async addNote(content) {
      this.notes.push({
        id: this.notes.length + 1,
        content,
      })

      this.newNoteContent = ''
      const response = await this.$axios.post('/note', {
        user: this.$auth.user.id,
        content,
      })
      console.log(response)
    },
  },
}
</script>
