import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import './registerServiceWorker'
import './plugins/axios'
import './plugins/element'
import './plugins/scrollTo'
import './plugins/awesomeSwiper'
import './styles/transitions.scss'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
