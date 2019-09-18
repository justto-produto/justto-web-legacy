import { shallowMount, createLocalVue } from '@vue/test-utils'
import Register from '@/views/external/Register.vue'
import Vuex from 'vuex'
import Element from 'element-ui'
import JusIcon from '@/components/images/JusIcon.vue'

const localVue = createLocalVue()
localVue.component('JusIcon', JusIcon)
localVue.use(Vuex)
localVue.use(Element)

describe('Register.vue', () => {
  let actions
  let store
  beforeEach(() => {
    actions = {
      logout: jest.fn()
    }
    store = new Vuex.Store({
      actions,
      namespaced: true
    })
  })
  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(Register, { store, localVue })
    expect(wrapper.isVueInstance()).toBe(true)
  })
})
