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
localVue.component('DisputeMessages', DisputeMessages)
localVue.component('DisputeOverview', DisputeOverview)
localVue.component('DisputeSummary', DisputeSummary)
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
  it('Contem o componente Summary', () => {
    const wrapper = shallowMount(Dispute, { store, localVue, router })
    expect(wrapper.contains(DisputeSummary)).toBe(true)
  })
  it('Contem o componente Messages', () => {
    const wrapper = shallowMount(Dispute, { store, localVue, router })
    expect(wrapper.contains(DisputeMessages)).toBe(true)
  })
  it('Contem o componente Overview', () => {
    const wrapper = shallowMount(Dispute, { store, localVue, router })
    expect(wrapper.contains(DisputeOverview)).toBe(true)
  })
})
