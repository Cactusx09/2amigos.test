<template lang="pug">
  client-only
    quill-editor(
      ref="editor"
      :content="data"
      :options="options"
      @change="onChange($event)"
      @blur="onBlur"
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
    onBlur() {
      this.$emit('blur')
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
