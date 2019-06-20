import { shallowMount } from '@vue/test-utils'
import JusLogoCompany from '@/components/images/JusLogoCompany.vue'

const wrapper = shallowMount(JusLogoCompany)

describe('JusLogoCompany.vue', () => {
  it('É um objeto Vue.', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('Inicia vazio', () => {
    expect(wrapper.props().src).toBe('')
    expect(wrapper.props().shape).toBe('square')
    expect(wrapper.props().size).toBe('md')
    expect(wrapper.props().shadow).toBe(false)
  })
})
