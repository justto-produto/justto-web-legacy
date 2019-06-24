import { shallowMount, createLocalVue } from '@vue/test-utils'
import Dispute from '@/views/main/management/Dispute.vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Element from 'element-ui'
import JusIcon from '@/components/images/JusIcon.vue'
import DisputeMessages from '@/views/main/management/partials/DisputeMessages.vue'
import DisputeOverview from '@/views/main/management/partials/DisputeOverview.vue'
import DisputeSummary from '@/views/main/management/partials/DisputeSummary.vue'
// import ManagementActions from '@/views/main/management/partials/ManagementActions.vue'
// import ManagementCarousel from '@/views/main/management/partials/ManagementCarousel.vue'

const localVue = createLocalVue()
localVue.component('JusIcon', JusIcon)
localVue.component('DisputeSummary', DisputeSummary)
localVue.component('DisputeMessages', DisputeMessages)
localVue.component('DisputeOverview', DisputeOverview)
// localVue.component('ManagementActions', ManagementActions)
// localVue.component('ManagementCarousel', ManagementCarousel)
localVue.use(VueRouter)
localVue.use(Vuex)
localVue.use(Element)

describe('Dispute.vue', () => {
  let store
  let actions
  let state
  let mutations
  let getters
  let router = new VueRouter()
  beforeEach(() => {
    state = {
      personModule: { person: {} },
      accountModule: {},
      workspaceModule: { members: { map: jest.fn() } }
    },
    actions = {
      getDispute: jest.fn(),
      getDisputeMessages: jest.fn(),
      getDisputeStatuses: jest.fn()
    },
    getters = {
      disputeStatuses: () => (arg) => arg
    },
    mutations = {
    },
    store = new Vuex.Store({
      actions,
      getters,
      state,
      mutations
    })
  })

  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(Dispute, { store, localVue, router })
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('Contem o componente JusIcon', () => {
    const wrapper = shallowMount(Dispute, { store, localVue, router })
    expect(wrapper.contains(JusIcon)).toBe(true)
  })
  // it('Contem o componente Summary', () => {
  //   const wrapper = shallowMount(Dispute, { store, localVue, router })
  //   expect(wrapper.contains(DisputeSummary)).toBe(true)
  // })
  it('Contem o componente Messages', () => {
    const wrapper = shallowMount(Dispute, { store, localVue, router })
    expect(wrapper.contains(DisputeMessages)).toBe(true)
  })
  it('Contem o componente Overview', () => {
    const wrapper = shallowMount(Dispute, { store, localVue, router })
    expect(wrapper.contains(DisputeOverview)).toBe(true)
  })
  it('Inicia com dados vazios e modais', () => {
    const wrapper = shallowMount(Dispute, { store, localVue, router })
    expect(wrapper.vm.editNegotiatorDialogVisible).toBe(false)
    expect(wrapper.vm.chooseUnsettledDialogVisible).toBe(false)
    expect(wrapper.vm.dispute).toEqual({})
    // expect(wrapper.vm.loadingDispute).toBe(false)
    expect(wrapper.vm.disputeMessages.length).toBe(0)
    expect(wrapper.vm.filteredDisputeMessages.length).toBe(0)
    expect(wrapper.vm.loadingDisputeMessages).toBe(false)
    expect(wrapper.vm.showSearch).toBe(false)
    expect(wrapper.vm.searchTerm).toBe('')
    expect(wrapper.vm.messageType).toBe('email')
    expect(wrapper.vm.newMessage).toBe('')
    expect(wrapper.vm.newNote).toBe('')
    expect(wrapper.vm.showScheduled).toBe(false)
    expect(wrapper.vm.activePerson).toEqual({})
    expect(wrapper.vm.newChatMessage).toBe('')
    expect(wrapper.vm.componentKey).toBe(0)
    expect(wrapper.vm.disputeNegotiators.length).toBe(0)
    expect(wrapper.vm.negotiatorsForm).toEqual({})
    expect(wrapper.vm.negotiatorsRules).toEqual({})
    expect(wrapper.vm.unsettledTypes.length).toBe(0)
    expect(wrapper.vm.unsettledType).toBe(null)
    expect(wrapper.vm.typingTab).toBe('1')
  })
})
