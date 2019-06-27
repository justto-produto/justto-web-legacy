import { shallowMount } from '@vue/test-utils'
import JusStatusDot from '@/components/others/JusStatusDot.vue'

const wrapper = shallowMount(JusStatusDot)

describe('JusStatusDot.vue', () => {
  it('É um objeto Vue.', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('Inicia vazio', () => {
    expect(wrapper.props().type).toBe(undefined)
  })
})
