import { createLocalVue, shallowMount } from '@vue/test-utils'

import Element from 'element-ui'
import JusViewMain from '@/components/layouts/JusViewMain.vue'

const localVue = createLocalVue()
localVue.use(Element)

describe('JusViewMain.vue', () => {
  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(JusViewMain, { localVue })
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('É string', () => {
    const wrapper = shallowMount(JusViewMain, { localVue })
    expect(wrapper.props().rightCardWidth).toBe('300')
    expect(wrapper.props().leftCardWidth).toBe('300')
  })
})
