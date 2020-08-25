<template lang="pug">
  client-only
    quill-editor(
      ref="editor"
      :content="data"
      :options="options"
      @change="$emit('update:data', $event.html); onChange($event)"
    )
      #toolbar(slot="toolbar")
        slot(
          name="toolbar"
          :content="data"
        )
</template>

<script>
import _ from 'lodash'

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
    onChange: _.debounce(function () {
      this.$emit('changed')
    }, 2000),
    // onBlur() {
    //   this.$emit('blur')
    // },
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
