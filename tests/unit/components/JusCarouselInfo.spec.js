import { shallowMount, createLocalVue } from '@vue/test-utils'
import JusCarouselInfo from '@/components/layouts/JusCarouselInfo.vue'
import Element from 'element-ui'

const localVue = createLocalVue()
localVue.use(Element)

describe('JusCarouselInfo.vue', () => {
  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(JusCarouselInfo, { localVue })
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('Inicia indefinido', () => {
    const wrapper = shallowMount(JusCarouselInfo, { localVue })
    expect(wrapper.props().items).toBe(undefined)
  })
})
