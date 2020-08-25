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

      .note__buttons.px-1.py-1
        slot(name="buttons")

        template(v-if="!newNote")
          span.icon.mx-2(@click="activateCroppa")
            v-icon(
              name="image"
            )
          span.icon.mx-2(v-show="!croppaOptions.isActive")
            v-icon(
              name="palette"
            )
          span.icon.mx-2(@click="deleteNote")
            v-icon(
              name="trash"
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
    newNote: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      quillOptions: {
        theme: this.newNote ? 'snow' : 'bubble',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [],
            [{ script: 'sub' }, { script: 'super' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ font: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [],
            [{ color: [] }, { background: [] }],
            [],
            [{ align: [] }],
            [],
            ['clean'],
            [],
            ['link', 'image', 'video'],
          ],
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

<style lang="sass">
.note
  &:hover
    .ql-editor
      padding-top: 2rem
  .ql
    &-editor
      transition: .2s
    &-container.ql-snow
      border: none
    &-tooltip
      min-width: 330px
      max-width: 330px
      z-index: 7
      border-radius: 0.375rem
    &-bubble .ql-toolbar .ql-formats
      margin: 0.25rem
</style>

<style lang="sass" scoped>
.note
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 100%
  display: flex
  align-items: stretch
  &:hover
    z-index: 5
    .note__buttons
      opacity: 1
      // transform: translateX(calc(-100% + 5px)) scale(1)
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
    opacity: 0
    // background-color: #fff
    position: absolute
    top: 0
    left: 0
    width: 100%
    display: flex
    justify-content: center
    // transform: translateY(-50%) scale(.8)
    // transform: translateY(-50%)
    transition: opacity .5s, transform .2s
    z-index: 5
    &::before
      content: ''
      position: absolute
      left: 0
      top: 0
      width: 100%
      height: 105%
      background: #fff
      background: linear-gradient(180deg, rgba(#fff,1) 0%, rgba(#fff,0.8) 75%, rgba(#fff,0) 100%)
      z-index: -1
    .icon
      cursor: pointer

// .quill-editor
//   min-height: 200px
//   max-height: 400px
//   overflow-y: auto
</style>
