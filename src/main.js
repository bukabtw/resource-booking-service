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
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          background: '#0a0a1a',
          surface: 'rgba(255, 255, 255, 0.05)',
          primary: '#7c3aed',
          secondary: '#a78bfa',
          accent: '#06b6d4',
          error: '#ef4444',
          success: '#10b981',
          warning: '#f59e0b',
          info: '#3b82f6',
          'on-background': '#ffffff',
          'on-surface': '#ffffff',
        }
      },
      light: {
        dark: false,
        colors: {
          background: '#f0f2f5',
          surface: 'rgba(255, 255, 255, 0.7)',
          primary: '#7c3aed',
          secondary: '#a78bfa',
          accent: '#06b6d4',
          error: '#ef4444',
          success: '#10b981',
          warning: '#f59e0b',
          info: '#3b82f6',
          'on-background': '#1a1a2e',
          'on-surface': '#1a1a2e',
        }
      }
    }
  }
})

createApp(App).use(vuetify).use(router).use(store).use(i18n).mount('#app')
