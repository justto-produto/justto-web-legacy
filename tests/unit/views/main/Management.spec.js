// import { shallowMount, createLocalVue } from '@vue/test-utils'
// import Management from '@/views/main/management/Management.vue'
// import Vuex from 'vuex'
// import VueRouter from 'vue-router'
// import Element from 'element-ui'
// import JusIcon from '@/components/images/JusIcon.vue'
// import JusViewMain from '@/components/layouts/JusViewMain'
//
// const localVue = createLocalVue()
// localVue.component('JusIcon', JusIcon)
// localVue.component('JusViewMain', JusViewMain)
// localVue.use(VueRouter)
// localVue.use(Vuex)
// localVue.use(Element)
//
// describe('Management.vue', () => {
//   let store
//   let actions
//   let getters
//   let router = new VueRouter()
//   beforeEach(() => {
//     actions = {
//       getCampaigns: jest.fn(),
//       getStrategies: jest.fn()
//     }
//     getters = {
//       campaignList: () => (arg) => arg,
//       disputeFilters: () => (arg) => arg,
//       strategyList: () => (arg) => arg
//     },
//     store = new Vuex.Store({
//       actions,
//       getters
//     })
//   })
//
//   it('É um objeto Vue.', () => {
//     const wrapper = shallowMount(Management, { store, localVue, router })
//     wwrapper.setData({
//       filters: {
//         terms: {}
//       }
//     })
//     expect(wrapper.isVueInstance()).toBe(true)
//   })
//
//   // it('Inicia vazio.', () => {
//   //   const wrapper = shallowMount(Management, { store, localVue, router })
//   //   // tableKey: 0,
//   //   // tabKey: false,
//   //   // showFilters: false,
//   //   // selectedIds: [],
//   //   // activeFilters: {},
//   //   // activeTab: '0',
//   //   // loadingExport: false,
//   //   // loadingDisputes: false
//   //   expect(wrapper.attributes()).toBe(0)
//   // })
// })
