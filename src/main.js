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
import '@/styles/transitions.scss'
import '@/styles/helpers.scss'
import '@/styles/views/container.scss'
import '@/styles/views/external.scss'
import '@/styles/views/onboarding.scss'
import '@/styles/overrides/override.scss'
import '@/styles/overrides/notification.scss'
import '@/styles/overrides/message.scss'

import JusIcon from '@/components/images/JusIcon'
import UserAvatar from '@/components/images/UserAvatar'
import ContentView from '@/components/layouts/ContentView'

Vue.component('jus-icon', JusIcon)
Vue.component('user-avatar', UserAvatar)
Vue.component('content-view', ContentView)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
