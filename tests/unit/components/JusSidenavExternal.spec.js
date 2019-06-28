import { shallowMount, createLocalVue } from '@vue/test-utils'
import JusSidenavExternal from '@/components/layouts/JusSidenavExternal.vue'
import Element from 'element-ui'

const localVue = createLocalVue()
localVue.use(Element)

describe('JusSidenavExternal.vue', () => {
  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(JusSidenavExternal, { localVue })
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('Inicia falso', () => {
    const wrapper = shallowMount(JusSidenavExternal, { localVue })
    expect(wrapper.props().showPlans).toBe(false)
  })
})
