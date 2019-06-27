import { shallowMount, createLocalVue } from '@vue/test-utils'
import JusEngagementsDialog from '@/components/dialogs/JusEngagementsDialog.vue'
import Vuex from 'vuex'
import Element from 'element-ui'

const localVue = createLocalVue()
localVue.component('JusEngagementsDialog', JusEngagementsDialog)
localVue.use(Vuex)
localVue.use(Element)

describe('JusEngagementsDialog.vue', () => {
  let store
  let state
  beforeEach(() => {
    store = new Vuex.Store({ state })
  })
  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(JusEngagementsDialog, { store, localVue })
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('Inicia fechado', () => {
    const wrapper = shallowMount(JusEngagementsDialog, { store, localVue })
    expect(wrapper.props().dialogVisible).toBe(false)
    expect(wrapper.props().strategyId).toBe(0)
    expect(wrapper.vm.dialog).toBe(false)
    expect(wrapper.vm.strategyEngagements.length).toBe(0)
  })
})
