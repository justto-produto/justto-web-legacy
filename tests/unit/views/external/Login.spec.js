import { shallowMount, createLocalVue } from '@vue/test-utils'
import Login from '@/views/external/Login.vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Element from 'element-ui'
import JusIcon from '@/components/images/JusIcon.vue'

const localVue = createLocalVue()
localVue.component('JusIcon', JusIcon)
localVue.use(VueRouter)
localVue.use(Vuex)
localVue.use(Element)

describe('Login.vue', () => {
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
    const wrapper = shallowMount(Login, { store, localVue, router })
    expect(wrapper.isVueInstance()).toBe(true)
  })
  // it('Inicia formulário inválido.', () => {
  //   const wrapper = shallowMount(Login, { store, localVue, router })
  //   wrapper.setData({
  //     loginForm: {
  //       email: 'a@a.com',
  //       password: 'a@a.com'
  //     }
  //   })
  //   wrapper.find('[nativetype="submit"]').trigger('click')
  //   expect(wrapper.find({ name: 'ElFormItem' }).vm.$attrs).toBe(true)
  // })
})
