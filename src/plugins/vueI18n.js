import Vue from 'vue'
import VueI18n from 'vue-i18n'
import brlocale from 'element-ui/lib/locale/lang/pt-br'
import enLocale from 'element-ui/lib/locale/lang/en'

Vue.use(VueI18n)

function loadLocaleMessages() {
  const locales = require.context('../locales', true, /[A-Za-z0-9-_,\s]+\.json$/i)
  const messages = {}
  locales.keys().forEach(key => {
    const matched = key.match(/([a-z-9]+)\./i)
    if (matched && matched.length > 1) {
      const locale = matched[1]
      messages[locale] = locales(key)
    }
  })
  // eslint-disable-next-line no-prototype-builtins
  if (messages.hasOwnProperty('en')) {
    messages.en.el = Object.assign(enLocale.el, messages.en.el)
  }
  // eslint-disable-next-line no-prototype-builtins
  if (messages.hasOwnProperty('pt-br')) {
    messages['pt-br'].el = Object.assign(brlocale.el, messages['pt-br'].el)
  }
  return messages
}

export default new VueI18n({
  locale: process.env.VUE_APP_I18N_LOCALE || 'pt-br',
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'pt-br',
  messages: loadLocaleMessages()
})
