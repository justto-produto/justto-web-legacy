import { shallowMount, createLocalVue } from '@vue/test-utils'
import JusCarouselCard from '@/components/layouts/JusCarouselCard.vue'
import VueRouter from 'vue-router'
import Element from 'element-ui'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(Element)

describe('JusCarouselCard.vue', () => {
  let router = new VueRouter()
  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(JusCarouselCard, { localVue, router })
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('Inicia vazio', () => {
    const wrapper = shallowMount(JusCarouselCard, { localVue, router })
    expect(wrapper.props().slide).toBe({})
  })
})
