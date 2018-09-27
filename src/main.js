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
import '@/styles/views/profile.scss'
import '@/styles/views/import/import.scss'
import '@/styles/views/import/new.scss'

import '@/styles/overrides/override.scss'
import '@/styles/overrides/notification.scss'
import '@/styles/overrides/message.scss'
import '@/styles/overrides/carousel.scss'
import '@/styles/overrides/form.scss'
import '@/styles/overrides/button.scss'
import '@/styles/overrides/dialog.scss'
import '@/styles/overrides/tabs.scss'
import '@/styles/overrides/dropdown.scss'
import '@/styles/overrides/tag.scss'
import '@/styles/overrides/collapse.scss'
import '@/styles/overrides/card.scss'
import '@/styles/overrides/steps.scss'

import JusIcon from '@/components/images/JusIcon'
import UserAvatar from '@/components/images/UserAvatar'
import ContentView from '@/components/layouts/ContentView'
import BackButton from '@/components/buttons/BackButton'

Vue.component('jus-icon', JusIcon)
Vue.component('user-avatar', UserAvatar)
Vue.component('content-view', ContentView)
Vue.component('back-button', BackButton)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
