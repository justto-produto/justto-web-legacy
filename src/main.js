import Vue from 'vue'
import App from '@/App.vue'
import router from './router'
import store from './store'
import i18n from './vueI18n'

// plugin
import '@/plugins/registerServiceWorker'
import '@/plugins/axios'
import '@/plugins/element'
import '@/plugins/scrollTo'
import '@/plugins/awesomeSwiper'

// css
import '@/styles/reset.scss'
import '@/styles/override.scss'
import '@/styles/transitions.scss'
import '@/styles/helpers.scss'
import '@/styles/views/external.scss'
import '@/styles/views/onboarding.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
