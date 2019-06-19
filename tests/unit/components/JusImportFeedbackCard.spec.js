import { shallowMount, createLocalVue } from '@vue/test-utils'
import JusImportFeedbackCard from '@/components/layouts/JusImportFeedbackCard.vue'
import Vuex from 'vuex'
import Element from 'element-ui'
import JusIcon from '@/components/images/JusIcon.vue'
import JusAvatarUser from '@/components/images/JusAvatarUser.vue'
import JusEngagementsDialog from '@/components/dialogs/JusEngagementsDialog.vue'

const localVue = createLocalVue()
localVue.component('JusIcon', JusIcon)
localVue.component('JusAvatarUser', JusAvatarUser)
localVue.component('JusEngagementsDialog', JusEngagementsDialog)
localVue.use(Vuex)
localVue.use(Element)

describe('JusImportFeedbackCard.vue', () => {
  let actions
  let store
  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(JusImportFeedbackCard, { store, localVue })
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('Inicia indefinido', () => {
    const wrapper = shallowMount(JusImportFeedbackCard, { store, localVue })
    expect(wrapper.props().mappedCampaign).toBe({})
    expect(wrapper.props().color).toBe('')
    expect(wrapper.props().index).toBe(1)
  })
})
