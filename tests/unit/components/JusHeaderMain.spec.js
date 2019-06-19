import { shallowMount, createLocalVue } from '@vue/test-utils'
import JusHeaderMain from '@/components/layouts/JusHeaderMain.vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Element from 'element-ui'
import JusIcon from '@/components/images/JusIcon.vue'
import JusAvatarUser from '@/components/images/JusAvatarUser.vue'

const localVue = createLocalVue()
localVue.component('JusIcon', JusIcon)
localVue.component('JusAvatarUser', JusAvatarUser)
localVue.use(VueRouter)
localVue.use(Vuex)
localVue.use(Element)

describe('JusHeaderMain.vue', () => {
  let actions
  let store
  let router = new VueRouter()
  beforeEach(() => {
    actions = {
      logout: jest.fn(),
    }
    // não entendi muito bem
    // store = new Vuex.Store({
    //   actions,
    //   namespaced: true
    // })
  })
  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(JusHeaderMain, { store, localVue, router })
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('Inicia indefinido', () => {
    const wrapper = shallowMount(JusHeaderMain, { store, localVue, router })
    expect(wrapper.props().items).toBe(undefined)
  })
})
