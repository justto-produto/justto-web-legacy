import { shallowMount } from '@vue/test-utils'
import JusChartDoughnut from '@/components/charts/JusChartDoughnut.vue'

const wrapper = shallowMount(JusChartDoughnut)

describe('JusChartDoughnut', () => {
  it('É um objeto Vue.', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('Inicia vazio/indefinido', () => {
    expect(wrapper.props().title).toBe('')
    expect(wrapper.props().data).toBe(undefined)
  })
})
