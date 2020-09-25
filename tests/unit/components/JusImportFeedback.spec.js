// erro de getters, de resto ok

import { createLocalVue, shallowMount } from '@vue/test-utils'

import Element from 'element-ui'
import JusAvatarUser from '@/components/images/JusAvatarUser.vue'
import JusEngagementsDialog from '@/components/dialogs/JusEngagementsDialog.vue'
import JusIcon from '@/components/images/JusIcon.vue'
import JusImportFeedbackCard from '@/components/layouts/JusImportFeedbackCard.vue'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.component('JusIcon', JusIcon)
localVue.component('JusAvatarUser', JusAvatarUser)
localVue.component('JusEngagementsDialog', JusEngagementsDialog)
localVue.use(Vuex)
localVue.use(Element)

describe('JusImportFeedbackCard.vue', () => {
  let store
  let state
  let getters
  beforeEach(() => {
    getters = {
      strategyList: jest.fn(),
      campaignList: jest.fn()
    }

    state = {
      workspaceModule: jest.fn()
    }

    store = new Vuex.Store({
      getters,
      state
    })
  })
  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(JusImportFeedbackCard, { store, localVue })
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('Inicia indefinido', () => {
    const wrapper = shallowMount(JusImportFeedbackCard, { store, localVue })
    expect(wrapper.props().color).toBe('')
    expect(wrapper.props().index).toBe(1)
  })
})
