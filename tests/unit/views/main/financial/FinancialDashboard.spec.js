import FinancialDashboard from '@/views/main/financial/FinancialClientDashboard'
import { shallowMount } from '@vue/test-utils'

describe('Views > FinancialDashboard', () => {
  const wrapper = shallowMount(FinancialDashboard)

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
