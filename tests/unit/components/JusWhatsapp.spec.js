import { shallowMount, createLocalVue } from '@vue/test-utils'
import JusWhatsapp from '@/components/layouts/JusWhatsapp.vue'
import Vuex from 'vuex'
import Element from 'element-ui'
import JusStatusDot from '@/components/others/JusStatusDot.vue'
import JusIcon from '@/components/images/JusIcon.vue'
import { mask } from 'vue-the-mask'

const localVue = createLocalVue()
localVue.directive('mask', mask)
localVue.component('JusIcon', JusIcon)
localVue.component('JusStatusDot', JusStatusDot)
localVue.use(Vuex)
localVue.use(Element)

describe('JusWhatsapp.vue', () => {
  let store
  let actions
  let state
  let mutations
  let getters
  beforeEach(() => {
    state = {
      socketModule: {
        whatsapp: {}
      },
    },
    actions = {
    },
    getters = {
    },
    mutations = {
    },
    store = new Vuex.Store({
      actions,
      getters,
      state,
      mutations
    })
  })
  // it('É um objeto Vue.', () => {
  //   const wrapper = shallowMount(JusWhatsapp, { store, localVue })
  //   expect(wrapper.isVueInstance()).toBe(true)
  // })
})
