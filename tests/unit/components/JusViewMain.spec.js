import { shallowMount, createLocalVue } from '@vue/test-utils'
import JusViewMain from '@/components/layouts/JusViewMain.vue'
import Element from 'element-ui'

const localVue = createLocalVue()
localVue.use(Element)

describe('JusViewMain.vue', () => {
  let actions
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
