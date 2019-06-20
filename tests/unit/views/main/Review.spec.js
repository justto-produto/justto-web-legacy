import { shallowMount, createLocalVue } from '@vue/test-utils'
import Review from '@/views/main/management/Review.vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Element from 'element-ui'
import JusViewMain from '@/components/layouts/JusViewMain.vue'
import JusIcon from '@/components/images/JusIcon.vue'

const localVue = createLocalVue()
localVue.component('JusViewMain', JusViewMain)
localVue.component('JusIcon', JusIcon)
localVue.use(VueRouter)
localVue.use(Vuex)
localVue.use(Element)

describe('Review.vue', () => {
  let actions
  let store
  let router = new VueRouter()
  beforeEach(() => {
    actions = {
      sendBatchAction: jest.fn(),
    }
  })
  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(Review, { store, localVue, router })
    expect(wrapper.isVueInstance()).toBe(true)
  })
})
