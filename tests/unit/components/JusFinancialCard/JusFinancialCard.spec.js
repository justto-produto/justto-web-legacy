import { JusFinancialCard } from '@/components/JusFinancialCard'
import { shallowMount } from '@vue/test-utils'

describe('Components > JusFinancialCard', () => {
  const wrapper = shallowMount(JusFinancialCard)

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
