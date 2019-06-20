import { shallowMount, createLocalVue } from '@vue/test-utils'
import DisputeMessages from '@/views/main/management/partials/DisputeMessages.vue'
import Vuex from 'vuex'
import Element from 'element-ui'
import JusIcon from '@/components/images/JusIcon.vue'
import JusAvatarUser from '@/components/images/JusAvatarUser.vue'

const localVue = createLocalVue()
localVue.component('JusIcon', JusIcon)
localVue.component('JusAvatarUser', JusAvatarUser)
localVue.use(Vuex)
localVue.use(Element)

describe('DisputeMessages.vue', () => {
  let actions
  let store
  beforeEach(() => {
    actions = {
      watch: jest.fn(),
    }
    store = new Vuex.Store({
      actions
    })
  })


  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(DisputeMessages, { store, localVue })
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('Inicia...', () => {
    const wrapper = shallowMount(DisputeMessages, { store, localVue })
    expect(wrapper.props().loading).toBe(true)
    expect(wrapper.props().showScheduled).toBe(false)
    expect(wrapper.props().currentTab).toBe('1')
  })
})
