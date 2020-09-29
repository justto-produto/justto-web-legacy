import { shallowMount, createLocalVue } from '@vue/test-utils'
import NewPassword from '@/views/external/NewPassword.vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Element from 'element-ui'
import JusButtonBack from '@/components/buttons/JusButtonBack.vue'

const localVue = createLocalVue()
localVue.component('JusButtonBack', JusButtonBack)
localVue.use(VueRouter)
localVue.use(Vuex)
localVue.use(Element)

describe('NewPassword.vue', () => {
  let actions
  let store
  const router = new VueRouter()
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
    const wrapper = shallowMount(NewPassword, { store, localVue, router })
    expect(wrapper.isVueInstance()).toBe(true)
  })
})
