import { createI18n } from 'vue-i18n'
import ru from './locales/ru.json'
import en from './locales/en.json'

function getDefaultLocale() {
  const saved = localStorage.getItem('app-locale')
  if (saved && ['ru', 'en'].includes(saved)) return saved
  const browserLang = navigator.language.split('-')[0]
  return ['ru', 'en'].includes(browserLang) ? browserLang : 'ru'
}

export default createI18n({
  legacy: false,
  locale: getDefaultLocale(),
  fallbackLocale: 'ru',
  messages: { ru, en }
})
