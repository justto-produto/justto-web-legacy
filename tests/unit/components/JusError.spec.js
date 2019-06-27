import { shallowMount } from '@vue/test-utils'
import JusError from '@/components/layouts/JusError.vue'

const wrapper = shallowMount(JusError)

describe('JusError.vue', () => {
  it('É um objeto Vue.', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  })
})
