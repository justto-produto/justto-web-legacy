import Vue from 'vue'
import App from '@/App.vue'
import router from './router'
import store from './store'

// plugin
import i18n from '@/plugins/vueI18n'
import '@/plugins/registerServiceWorker'
import '@/plugins/axios'
import '@/plugins/element'
import '@/plugins/scrollTo'
import '@/plugins/awesomeSwiper'

// css
import '@/styles/core.scss'
import '@/styles/transitions.scss'

import '@/styles/overrides/badge.scss'
import '@/styles/overrides/button.scss'
import '@/styles/overrides/card.scss'
import '@/styles/overrides/carousel.scss'
import '@/styles/overrides/checkbox.scss'
import '@/styles/overrides/collapse.scss'
import '@/styles/overrides/container.scss'
import '@/styles/overrides/dialog.scss'
import '@/styles/overrides/dropdown.scss'
import '@/styles/overrides/form.scss'
import '@/styles/overrides/menu.scss'
import '@/styles/overrides/message-box.scss'
import '@/styles/overrides/message.scss'
import '@/styles/overrides/notification.scss'
import '@/styles/overrides/radio.scss'
import '@/styles/overrides/radio-group.scss'
import '@/styles/overrides/steps.scss'
import '@/styles/overrides/tabs.scss'
import '@/styles/overrides/tag.scss'
import '@/styles/overrides/upload.scss'

// Global components
import JusIcon from '@/components/images/JusIcon'
import JusAvatarUser from '@/components/images/JusAvatarUser'
import JusViewMain from '@/components/layouts/JusViewMain'
import JusButtonBack from '@/components/buttons/JusButtonBack'
import JusStatusDot from '@/components/others/JusStatusDot'

Vue.component('JusIcon', JusIcon)
Vue.component('JusAvatarUser', JusAvatarUser)
Vue.component('JusViewMain', JusViewMain)
Vue.component('JusButtonBack', JusButtonBack)
Vue.component('JusStatusDot', JusStatusDot)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
