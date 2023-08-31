import Vue from 'vue'
import App from '@/App.vue'
import router from './router'
import store from './store'
import { registerServiceWorker } from '@/utils'
import { validateWorkspace } from '@/utils/validations'

import CKEditor from '@ckeditor/ckeditor5-vue2'

// PLUGINS
import i18n from '@/plugins/vueI18n'
import '@/plugins/axios'
import '@/plugins/element'
import '@/plugins/jusNotification'
import '@/plugins/jusSegment'
import '@/plugins/socket'
import '@/plugins/vueAwesomeSwiper'
import '@/plugins/vueChatScroll'
import '@/plugins/vueMoment'
import '@/plugins/vueMoney'
import '@/plugins/vueTheMask'
import '@/plugins/shortkey'
import '@/plugins/vueHtml2pdf'
// import '@/plugins/amplify'

// FILTERS
import '@/filters/numberFormat'
import '@/filters/capitalize'
import '@/filters/cpfCnpj'
import '@/filters/filterTj'
import '@/filters/currency'
import '@/filters/firstName'
import '@/filters/phoneNumber'
import '@/filters/resumedName'
import '@/filters/ownName'
import '@/filters/oab'

// STYLES
import '@/styles/core.scss'
import '@/styles/transitions.scss'
import '@/styles/perfect-scroll.scss'
import '@/styles/quill-editor.scss'

// GLOBAL COMPONENTS
import JusIcon from '@/components/images/JusIcon'
import JusAvatarUser from '@/components/images/JusAvatarUser'
import JusViewMain from '@/components/layouts/JusViewMain'
import JusButtonBack from '@/components/buttons/JusButtonBack'
Vue.use(CKEditor)

Vue.component('JusIcon', JusIcon)
Vue.component('JusAvatarUser', JusAvatarUser)
Vue.component('JusViewMain', JusViewMain)
Vue.component('JusButtonBack', JusButtonBack)

Vue.config.productionTip = false

registerServiceWorker()

if (store.getters.workspaceSubdomain) {
  // eslint-disable-next-line
  axios.defaults.headers.common['Workspace'] = store.getters.workspaceSubdomain
}

if (store.getters.isLoggedIn) {
  store.dispatch('myAccount')
    .then(responses => {
      store.dispatch('getWorkspaceMembers')
      store.dispatch('getWorkspaceTags')
    }).catch(() => {
      store.commit('logout')
    }).finally(() => {
      initVue()
    })
} else {
  initVue()
}

function initVue() {
  new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
  }).$mount('#app')
  validateWorkspace()
}
