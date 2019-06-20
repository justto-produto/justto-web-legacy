import { shallowMount, createLocalVue } from '@vue/test-utils'
import Import from '@/views/main/import/Import.vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Element from 'element-ui'
import JusIcon from '@/components/images/JusIcon.vue'
import JusViewMain from '@/components/layouts/JusViewMain'

const localVue = createLocalVue()
localVue.component('JusIcon', JusIcon)
localVue.component('JusViewMain', JusViewMain)
localVue.use(VueRouter)
localVue.use(Vuex)
localVue.use(Element)

describe('Import.vue', () => {
  let store
  let actions
  let state
  let mutations
  let getters
  let router = new VueRouter()
  beforeEach(() => {
    state = {
      accountModule: {},
      workspaceModule: {}
    },
    actions = {
      getImportsHistory: jest.fn()
    },
    getters = {
    },
    mutations = {
      removeImportsFile: jest.fn()
    },
    store = new Vuex.Store({
      actions,
      getters,
      state,
      mutations
    })
  })

  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(Import, { store, localVue, router })
    expect(wrapper.isVueInstance()).toBe(true)
  })

  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(Import, { store, localVue, router })
    expect(wrapper.isVueInstance()).toBe(true)
  })

})
