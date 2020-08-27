import Vue from 'vue'

// import 'vue-awesome/icons/trash-alt'
import 'vue-awesome/icons'

import Icon from 'vue-awesome/components/Icon'

Icon.register({
  opacity: {
    width: 16,
    height: 20,
    d:
      'M14.9 12H14v1.3c.3-.4.7-.8.9-1.3zM16 8c0 .7-.1 1.4-.3 2H14V8h2zm-6 2V8h2v2h-2zm4.9-6c.4.6.6 1.3.8 2H14V4h.9zM12 14.9V14h1.3c-.4.3-.8.7-1.3.9zm2-4.9v2h-2v-2h2zM10 .3c.7.2 1.4.5 2 .8V2h-2V.3zM10 4h2v2h-2V4zm2 8v2h-2v-2h2zm0-10h1.3c.3.2.5.5.7.7V4h-2V2zM8 4v2h2v2H8v2h2v2H8v2h2v1.7c-.6.2-1.3.3-2 .3-4.4 0-8-3.6-8-8s3.6-8 8-8v2h2v2H8zm4 4V6h2v2h-2z',
  },
})

Vue.component('v-icon', Icon)
