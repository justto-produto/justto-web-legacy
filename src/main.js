import Vue from 'vue'
import App from '@/App.vue'
import router from './router'
import store from './store'

// plugin
import i18n from '@/plugins/vueI18n'
import '@/plugins/registerServiceWorker'
import '@/plugins/axios'
import '@/plugins/element'
import '@/plugins/awesomeSwiper'
import '@/plugins/moment'
import '@/plugins/chatScroll'
import '@/plugins/jusNotification'
import '@/plugins/jusSegment'
import '@/plugins/socket'
// import '@/plugins/sentry'

// filters
import '@/filters/capitalize'
import '@/filters/currency'
import '@/filters/firstName'
import '@/filters/cpfCnpjMask'
import '@/filters/phoneMask'

// css
import '@/styles/core.scss'
import '@/styles/transitions.scss'

import '@/styles/overrides/alert.scss'
import '@/styles/overrides/badge.scss'
import '@/styles/overrides/button.scss'
import '@/styles/overrides/card.scss'
import '@/styles/overrides/carousel.scss'
import '@/styles/overrides/checkbox.scss'
import '@/styles/overrides/collapse.scss'
import '@/styles/overrides/container.scss'
import '@/styles/overrides/dialog.scss'
import '@/styles/overrides/divider.scss'
import '@/styles/overrides/dropdown.scss'
import '@/styles/overrides/form.scss'
import '@/styles/overrides/icon.scss'
import '@/styles/overrides/input.scss'
import '@/styles/overrides/menu.scss'
import '@/styles/overrides/message-box.scss'
import '@/styles/overrides/message.scss'
import '@/styles/overrides/notification.scss'
import '@/styles/overrides/pagination.scss'
import '@/styles/overrides/radio.scss'
import '@/styles/overrides/popover.scss'
import '@/styles/overrides/radio-group.scss'
import '@/styles/overrides/table.scss'
import '@/styles/overrides/select.scss'
import '@/styles/overrides/steps.scss'
import '@/styles/overrides/tabs.scss'
import '@/styles/overrides/tag.scss'
import '@/styles/overrides/tooltip.scss'
import '@/styles/overrides/upload.scss'
import '@/styles/perfect-scroll.scss'
import '@/styles/quill-editor.scss'

// utils
import { validateWorkspace } from '@/utils/validateWorkspace'

// Global components
import VueTheMask from 'vue-the-mask'
import money from 'v-money'
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

// mask
Vue.use(VueTheMask)
Vue.use(money, {
  decimal: ',',
  thousands: '.',
  prefix: 'R$ ',
  precision: 2
})

Vue.config.productionTip = false

if (store.getters.workspaceSubdomain) {
  // eslint-disable-next-line
  axios.defaults.headers.common['Workspace'] = store.getters.workspaceSubdomain
}

if (store.getters.isLoggedIn) {
  store.dispatch('myAccount')
    .then(responses => {
      store.dispatch('getWorkspaceMembers')
    }).catch(() => {
      store.commit('logout')
    }).finally(() => {
      initVue()
    })
} else {
  initVue()
}

function initVue () {
  new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
  }).$mount('#app')
  validateWorkspace()
}
