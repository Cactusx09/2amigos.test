<template lang="pug">
  client-only
    div.note
      quill-editor.note__editor(
        ref="editor"
        :content="data"
        :options="quillOptions"
        @change="onChange($event)"
        @focus="onFocus($event)"
      )
      croppa.note__image(
        v-if="croppaOptions.isActive"
        v-model="croppa"
        :width="croppaOptions.width"
        :height="croppaOptions.height"
        placeholder="Yes, you can modify the text here"
        placeholder-color="#000"
        prevent-white-space
        accept="image/jpeg,image/png"
        :placeholder-font-size="16"
        canvas-color="transparent"
        :show-remove-button="false"
        show-loading
        :loading-size="50"
        loading-color="#606060"
      )

      .note__buttons
        slot(name="buttons")

        template(v-if="!newNote")
          button.button(@click="deleteNote")
            span.icon
              v-icon(
                name="trash"
              )
          button.button(v-show="!croppaOptions.isActive")
            span.icon
              v-icon
                v-icon(
                  name="expand"
                  :scale="1.6"
                )
                v-icon(
                  name="pen"
                  :scale="0.8"
                )
          button.button(@click="activateCroppa")
            span.icon
              v-icon(
                name="image"
              )
          button.button(v-show="!croppaOptions.isActive")
            span.icon
              v-icon(
                name="palette"
              )
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    id: {
      type: Number,
      default: 0,
    },
    data: {
      type: String,
      default: '',
    },
    toolbarOptions: {
      type: [String, Array, Boolean],
      default: false,
    },
    newNote: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      quillOptions: {
        theme: 'snow',
        modules: {
          toolbar: this.toolbarOptions,
        },
      },
      croppa: null,
      croppaOptions: {
        isActive: false,
        width: null,
        height: null,
      },
    }
  },

  methods: {
    async deleteNote() {
      await this.$axios.post('/note/delete', {
        id: this.id,
      })
      await this.$emit('delete')
    },
    activateCroppa() {
      const { offsetWidth, offsetHeight } = this.$el.offsetParent
      this.croppaOptions.isActive = true
      this.croppaOptions.width = offsetWidth
      this.croppaOptions.height = offsetHeight
    },
    onFocus(event) {
      // this.options = {
      //   theme: 'snow',
      //   modules: {
      //     toolbar: [
      //       ['bold', 'italic', 'underline', 'strike'],
      //       ['blockquote', 'code-block'],
      //       [{ header: 1 }, { header: 2 }],
      //       [{ list: 'ordered' }, { list: 'bullet' }],
      //       [{ script: 'sub' }, { script: 'super' }],
      //       [{ indent: '-1' }, { indent: '+1' }],
      //       [{ direction: 'rtl' }],
      //       [{ size: ['small', false, 'large', 'huge'] }],
      //       [{ header: [1, 2, 3, 4, 5, 6, false] }],
      //       [{ font: [] }],
      //       [{ color: [] }, { background: [] }],
      //       [{ align: [] }],
      //       ['clean'],
      //       ['link', 'image', 'video'],
      //     ],
      //   },
      // }
      // debugger
    },
    onChange: _.debounce(function (editor) {
      this.$emit('changed')
      this.$emit('update:data', editor.html)
    }, 2000),
  },
}
</script>

<style lang="sass" scoped>
.note
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  display: flex
  align-items: stretch
  &__editor
    width: 100%
    display: flex
    flex-direction: column
    align-items: stretch
  &__image
    position: absolute
    top: 0
    left: 0
    z-index: 3
  &__buttons
    position: absolute
    top: 0
    right: 0
    height: 100%
    display: flex
    flex-direction: column
    justify-content: flex-end
    transform: translateX(50%)
    z-index: 5
    .button
      border-radius: 50%
// .quill-editor
//   min-height: 200px
//   max-height: 400px
//   overflow-y: auto
</style>
