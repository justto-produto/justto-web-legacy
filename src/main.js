import 'systemjs-webpack-interop/auto-public-path'
import Vue from 'vue'
import App from '@/App.vue'
import singleSpaVue from 'single-spa-vue'
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
import '@/plugins/ckEditor'

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
  // eslint-disable-next-line no-undef
  axios.defaults.headers.common.Workspace = store.getters.workspaceSubdomain
}

const vueLifecycles = singleSpaVue({
  Vue,
  appOptions: {
    render(h) {
      return h(App, {
        props: {
          // single-spa props are available on the "this" object. Forward them to your component as needed.
          // https://single-spa.js.org/docs/building-applications#lifecycle-props
          // if you uncomment these, remember to add matching prop definitions for them in your App.vue file.
          /*
          name: this.name,
          mountParcel: this.mountParcel,
          singleSpa: this.singleSpa,
          */
        }
      })
    },
    router,
    store,
    i18n
  }
})

const init = (props) => vueLifecycles.mount(props).then(() => {
  validateWorkspace()
})

export const bootstrap = vueLifecycles.bootstrap
export const mount = (props) => Promise.resolve().then(() => {
  if (store.getters.isLoggedIn) {
    store.dispatch('myAccount')
      .then(() => {
        store.dispatch('getWorkspaceMembers')
        store.dispatch('getWorkspaceTags')
      }).catch(() => {
        store.commit('logout')
      }).finally(() => {
        return init(props)
      })
  } else {
    return init(props)
  }
})
export const unmount = vueLifecycles.unmount
