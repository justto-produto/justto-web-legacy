import { shallowMount } from '@vue/test-utils'
import JusIcon from '@/components/images/JusIcon.vue'

const wrapper = shallowMount(JusIcon)

describe('JusIcon.vue', () => {
  it('É um objeto Vue.', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('Inicia vazio', () => {
    expect(wrapper.props().isActive).toBe(false)
    expect(wrapper.props().isWhite).toBe(false)
    expect(wrapper.props().icon).toBe('')
  })
})
