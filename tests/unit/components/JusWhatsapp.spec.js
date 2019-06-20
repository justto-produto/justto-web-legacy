import { shallowMount, createLocalVue } from '@vue/test-utils'
import JusWhatsapp from '@/components/layouts/JusWhatsapp.vue'
import { getters } from '@/components/layouts/JusWhatsapp.vue'
import Vuex from 'vuex'
import Element from 'element-ui'
import JusIcon from '@/components/images/JusIcon.vue'
import JusStatusDot from '@/components/others/JusStatusDot.vue'

const localVue = createLocalVue()
localVue.component('JusIcon', JusIcon)
localVue.component('JusStatusDot', JusStatusDot)
localVue.use(Vuex)
localVue.use(Element)

describe('JusWhatsapp.vue', () => {
  let store
  let actions
  beforeEach(() => {
    actions = {
      toggleDevice: jest.fn()
    }
    store = new Vuex.Store({
      modules: {
      	auth: {
          state: {},
          getters
      },
      actions
    })
  })
  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(JusWhatsapp, { store, localVue })
    expect(wrapper.isVueInstance()).toBe(true)
  })
})
