<template lang="pug">
  div
      client-only
        dashboard#dahboard
          dash-layout(v-bind="layout")
            dash-item.box(
              v-bind.sync="newNote"
              :key="newNote.id"
              :resize="false"
              :draggable="false"
            )
              note(
                :data.sync="newNote.content"
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

            dash-item.box(
              v-for="item in layout.items"
              v-bind.sync="item"
              :key="item.id"
              @moveEnd="savePositions"
              @resizeEnd="savePositions"
            )
              note.note(:data="item.content")


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
      newNote: {
        id: 1,
        x: 0,
        y: 0,
        width: 12,
        height: 2,
        content: '',
      },
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
      layout: {
        breakpoint: 'xl',
        numberOfCols: 12,
        items: [],
      },
    }
  },

  // created() {

  // },

  created() {
    this.$axios
      .get('/notes', {
        params: {
          userId: this.$auth.user.id,
        },
      })
      .then(({ data }) => {
        const items = data.notes.map((note) => ({
          ...JSON.parse(note.layout),
          id: note.id,
        }))
        this.layout.items = items
      })
  },

  methods: {
    moveEnd(e) {
      console.log(e)

      debugger
    },
    async addNote() {
      // calculateHeight() {
      let maxY = 1
      let bottomY = 0
      for (const item of this.layout.items) {
        bottomY = item.y + item.height
        if (bottomY > maxY) maxY = bottomY
      }
      //   return maxY * (this.rowHeight + this.margin.y) + this.margin.y
      // }
      const newLayout = { ...this.newNote, y: maxY + 1 }
      const { data } = await this.$axios.post('/note', {
        user: this.$auth.user.id,
        layout: newLayout,
      })

      this.layout.items.push({
        ...newLayout,
        id: data.id,
      })
      this.newNote.content = ''
    },
    async savePositions() {
      const response = await this.$axios.post('/notes/savePositions', {
        user: this.$auth.user.id,
        items: this.layout.items,
      })
      console.log(response)
    },
  },
}
</script>

<style lang="sass">
.packery-item
  width: 33.3333%
  &.is-dragging,
  &.is-positioning-post-drag
    background: #EA0
    z-index: 2
.packery-drop-placeholder
  outline: 3px dashed #444
  outline-offset: -6px
  transition: transform 0.2s
</style>
