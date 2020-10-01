import { shallowMount, createLocalVue } from '@vue/test-utils'
import JusManagementFilters from '@/components/others/JusManagementFilters.vue'
import Vuex from 'vuex'
import Element from 'element-ui'
import JusIcon from '@/components/images/JusIcon.vue'

const localVue = createLocalVue()
localVue.component('JusIcon', JusIcon)
localVue.use(Vuex)
localVue.use(Element)

describe('JusManagementFilters.vue', () => {
  let actions
  let store
  beforeEach(() => {
    actions = {
      getCampaigns: jest.fn(),
      getMyStrategies: jest.fn()
    }
    store = new Vuex.Store({
      actions,
      namespaced: true
    })
  })
  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(JusManagementFilters, {
      store,
      localVue,
      propsData: {
        tabIndex: '2',
        filters: {}
      }
    })
    expect(wrapper.isVueInstance()).toBe(true)
  })
})
