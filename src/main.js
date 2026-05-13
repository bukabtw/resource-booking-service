import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  icons: { defaultSet: 'mdi' },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#667eea',
          secondary: '#764ba2',
          error: '#dc3545',
          success: '#21ba45',
          warning: '#fb8c00',
          info: '#2185d0',
          background: '#f5f5f5'
        }
      }
    }
  }
})

createApp(App).use(vuetify).use(router).use(store).use(i18n).mount('#app')
