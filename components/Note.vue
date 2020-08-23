<template lang="pug">
  client-only
    quill-editor(
      ref="editor"
      :content="data"
      :options="options"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onChange($event)"
    )
      #toolbar(slot="toolbar")
        slot(
          name="toolbar"
          :content="data"
        )
</template>

<script>
export default {
  props: {
    data: {
      type: String,
      default: '',
    },
    toolbarOptions: {
      type: [String, Array, Boolean],
      default: false,
    },
  },

  data() {
    return {
      options: {
        theme: 'snow',
        modules: {
          toolbar: this.toolbarOptions,
        },
      },
    }
  },

  methods: {
    onChange(editor) {
      this.$emit('update:data', editor.html)
    },
    onEditorBlur(editor) {
      // this.content = this.data
    },
    onEditorFocus(editor) {
      console.log('editor focus!', editor)
    },
  },
}
</script>

<style lang="sass" scoped>
.container
  width: 60%
  margin: 0 auto
  padding: 50px 0
  .quill-editor
    min-height: 200px
    max-height: 400px
    overflow-y: auto
</style>
