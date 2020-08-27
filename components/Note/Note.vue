<template lang="pug">
  client-only
    div.note(
      :style="`background-image: url('${imageUrl}'); border-color: ${color}`"
      :class="[{ 'new-item': newNote }, { 'is-active-img': croppaOptions.isActive }]"
    )
      .note__overlay(:style="`opacity: ${opacity/100}; background-color: ${color}`")

      quill-editor.note__editor(
        ref="editor"
        :content="content"
        :options="quillOptions"
        @change="$emit('update:content', $event.html); onChange()"
      )

      croppa.note__image(
        v-if="croppaOptions.isActive"
        v-model="croppa"
        :width="croppaOptions.width"
        :height="croppaOptions.height"
        placeholder="Drag image or click"
        placeholder-color="#000"
        prevent-white-space
        accept="image/jpeg,image/png"
        :placeholder-font-size="15"
        canvas-color="transparent"
        :show-remove-button="false"
        show-loading
        :loading-size="50"
        loading-color="#606060"
        @new-image="croppaOptions.isUploaded = true"
        ref="croppa"
      )

      .note__buttons.px-1.py-1(
        @mouseover="$emit('enable-drag')"
        @mouseleave="$emit('disable-drag')"
      )
        slot(name="buttons")

        template(v-if="!newNote & !croppaOptions.isActive")
          span.note__buttons_opacity.icon.mx-2(
            v-if="imageUrl || color"
          )
            v-icon(
              name="opacity"
              :scale="1.2"
            )
            input.slider.is-small.box.is-marginless(
              v-model.number="opacityModel"
              @input="$emit('update:opacity', Number(opacityModel)); onChange()"
              @mouseover.stop="$emit('disable-drag')"
              @mouseleave.stop="$emit('enable-drag')"
              step="1"
              min="0"
              max="100"
              type="range"
            )
          span.icon.mx-2(@click="activateCroppa()")
            v-icon(
              name="image"
            )

          span.note__buttons_resize.icon.mx-2
            v-icon(
              name="arrows-alt"
            )

          span.icon.mx-2
            v-swatches(
              @input="$emit('update:color', $event); onChange()"
              show-fallback
            )
              v-icon(
                slot="trigger"
                name="palette"
              )
          span.icon.mx-2(@click="onDeleteNote()")
            v-icon(
              name="trash"
            )

        template(v-if="croppaOptions.isActive")
          template(v-if="croppaOptions.isUploaded")
            span.icon(@click="croppa.rotate(1)")
              v-icon(
                flip="horizontal"
                name="redo"
              )
            span.icon.ml-2.mr-4(@click="croppa.rotate(-1)")
              v-icon(
                name="redo"
              )
            span.icon.ml-3.mr-2(
              v-if="croppaOptions.isUploaded"
              @click="saveImage()"
            )
              v-icon(
                name="check"
              )

          span.icon.mr-3.ml-2(
            v-if="croppaOptions.isUploaded"
            @click="croppaOptions.isUploaded = false; croppa.remove()"
          )
            v-icon(
              name="times"
            )
          span.icon.mr-3.ml-2(
            v-else
            @click="croppaOptions.isActive = false"
          )
            v-icon(
              name="times"
            )
          span.icon.mr-3.ml-2(
            v-if="imageUrl"
            @click="deleteImage()"
          )
            v-icon(
              name="trash"
            )


          template(v-if="croppaOptions.isUploaded")
            span.icon.ml-4.mr-2(@click="croppa.flipX()")
              v-icon(
                flip="horizontal"
                name="arrows-alt-h"
              )
            span.icon(@click="croppa.flipY()")
              v-icon(
                name="arrows-alt-v"
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
    imageUrl: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    opacity: {
      type: Number,
      default: 50,
    },
    content: {
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
        isUploaded: false,
        width: null,
        height: null,
      },
      opacityModel: this.opacity,
    }
  },

  methods: {
    onChange: _.debounce(function () {
      this.$emit('changed')
    }, 1500),
    async onDeleteNote() {
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
    async saveImage() {
      const blob = await this.croppa.promisedBlob()
      const formData = new FormData()
      formData.append('data', blob)
      formData.append('noteId', this.id)

      const { data } = await this.$axios.post('/note/saveImage', formData, {
        header: { 'Content-Type': 'multipart/form-data' },
      })

      this.$emit('update:imageUrl', data.path)

      this.croppaOptions.isUploaded = false
      this.croppa.remove()
    },
    async deleteImage() {
      await this.$axios.post('/note/deleteImage', {
        noteId: this.id,
        path: this.imageUrl,
      })

      this.croppaOptions.isUploaded = false
      this.croppaOptions.isActive = false
      this.croppa.remove()

      this.$emit('update:imageUrl', '')
    },
  },
}
</script>

<style lang="sass">
.note
  &:not(.new-item):hover
    .ql-editor
      padding-top: 2rem
  .ql
    &-editor
      transition: .2s
      border-radius: 0.375rem
    &-container.ql-snow
      border-radius: 0.375rem
      border: none
    &-toolbar.ql-snow
      border: none
      box-shadow: 0px 8px 14px -8px rgba(#000, 0.1)
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
  z-index: 0
  background-position: center
  background-size: cover
  background-repeat: no-repeat
  border-radius: 0.375rem
  &__overlay
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%
    opacity: 0.8
    pointer-events: none
    border-radius: 0.375rem
    z-index: -1
  &:hover
    z-index: 5
    .note__buttons
      opacity: 1
      transform: none
      .icon
        transform: none
  &.is-active-img
    .note__buttons
      opacity: 1
      transform: none
      &::before
        opacity: 0.9
        background: linear-gradient(180deg, rgba(#e6e6e6,0.9) 0%, rgba(#e6e6e6,0.6) 55%, rgba(#e6e6e6,0) 100%)
      .icon
        transform: none

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
    border-radius: 0.375rem
    overflow: hidden
    &:hover
      opacity: 0.92
  &__buttons
    position: absolute
    top: 0
    left: 0
    width: 100%
    display: flex
    justify-content: center
    align-items: center
    opacity: 0
    transform: translateY(-50%)
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
      border-radius: 0.375rem
      z-index: -1
      opacity: 0.5
    .icon
      cursor: pointer
      transform: translateY(80%) scale(0.8)
      transition: 0.2s
    &_resize.icon
        cursor: move
    &_opacity
      position: relative
      &:hover
        .slider
          opacity: 1
          transform: translateX(-50%) scale(1)
          pointer-events: all
      .slider
        position: absolute
        bottom: 100%
        left: 50%
        padding: 1rem
        transform: translateY(20%) translateX(-50%) scale(.8)
        transition: 0.3s
        width: 170px
        border-radius: 0.375rem
        background-color: #fff
        opacity: 0
        pointer-events: none
</style>
