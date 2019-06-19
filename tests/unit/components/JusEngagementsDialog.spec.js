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
    store = new Vuex.Store({
      state
    })
  })
  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(JusEngagementsDialog, {
      store,
      localVue
    })
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('Inicia vazio', () => {
    const wrapper = shallowMount(JusEngagementsDialog, {
      store,
      localVue
    })
    expect(wrapper.props().type).toBe(undefined)
  })
})
