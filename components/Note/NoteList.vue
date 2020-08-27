<template lang="pug">
  div
      client-only
        dashboard#dahboard
          dash-layout(v-bind="layout")
            dash-item.box.new-note(
              v-bind.sync="newNote"
              :key="newNote.id"
              :draggable="false"
              locked
            )
              note(
                :data.sync="newNote.content"
                @on-add="addNote"
                new-note
              )
              button.button(@click="addNote")
                span.icon
                  v-icon(
                    name="plus"
                  )

            dash-item.box(
              v-for="(item, index) in layout.items"
              v-bind.sync="item"
              :key="item.id"
              @moveEnd="savePositions"
              @resizeEnd="savePositions"
              :minWidth="2"
              resizeEdges="left top bottom right",
            )
              note(
                v-bind.sync="item"
                :data.sync="item.content"
                @changed="saveNote(item)"
                @delete="layout.items.splice(index, 1)"
              )


</template>

<script>
import Note from '~/components/Note/Note'
export default {
  components: {
    Note,
  },

  data() {
    return {
      newNote: {
        id: 0,
        x: 0,
        y: 0,
        width: 12,
        height: 2,
        content: '',
      },
      layout: {
        breakpoint: 'xl',
        numberOfCols: 12,
        items: [],
      },
    }
  },

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
          content: note.content,
          image: note.image,
        }))
        this.layout.items = items
      })
  },

  methods: {
    async addNote() {
      const { data } = await this.$axios.post('/note/create', {
        user: this.$auth.user.id,
        layout: {
          x: this.newNote.x,
          y: this.newNote.y,
          width: this.newNote.width,
          height: this.newNote.height,
        },
        content: this.newNote.content,
      })

      if (data) {
        this.layout.items.push({
          ...this.newNote,
          id: data.id,
        })
        this.newNote.content = ''
      }
    },
    async savePositions() {
      const response = await this.$axios.post('/notes/save', {
        user: this.$auth.user.id,
        items: this.layout.items,
      })
      console.log(response)
    },
    async saveNote(note) {
      const response = await this.$axios.post('/note/save', {
        id: note.id,
        note,
      })
      console.log(response)
    },
  },
}
</script>

<style lang="sass">
.new-note
  position: relative
  z-index: 3
  padding-bottom: 32px
  background: transparent
  .button
    position: absolute
    left: 50%
    bottom: 0
    transform: translate(-50%, 50%)
    border-radius: 50%
    z-index: 10
</style>
