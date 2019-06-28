import { shallowMount } from '@vue/test-utils'
import JusTip from '@/components/others/JusTip.vue'

const wrapper = shallowMount(JusTip)

describe('JusTip.vue', () => {
  it('É um objeto Vue.', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  })
})
