import '@/plugins/jusNotification'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import Element from 'element-ui'
import Import from '@/views/main/import/Import.vue'
import JusIcon from '@/components/images/JusIcon.vue'
import JusViewMain from '@/components/layouts/JusViewMain'
import VueRouter from 'vue-router'
import Vuex from 'vuex'

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
  const router = new VueRouter()
  beforeEach(() => {
    state = {
      accountModule: {},
      workspaceModule: {}
    }

    actions = {
      getImportsHistory: jest.fn()
    }

    getters = {
    }

    mutations = {
      removeImportsFile: jest.fn()
    }

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

  it('Somente arquivos xlsx, xls, csv e até 20 mb.', () => {
    const wrapper = shallowMount(Import, { store, localVue, router })
    expect(wrapper.vm.beforeUpload({
      name: 'teste.xlsx',
      size: 200000000
    })).toBe(false)
    expect(wrapper.vm.beforeUpload({
      name: 'teste.xlsx',
      size: 100
    })).toBe(true)
    expect(wrapper.vm.beforeUpload({
      name: 'teste.pdf',
      size: 100
    })).toBe(false)
    expect(wrapper.vm.beforeUpload({
      name: 'teste.exe',
      size: 100
    })).toBe(false)
    expect(wrapper.vm.beforeUpload({
      name: 'teste.xls',
      size: 100
    })).toBe(true)
    expect(wrapper.vm.beforeUpload({
      name: 'teste.csv',
      size: 100
    })).toBe(true)
  })
})
