import BillingDashboard from '@/views/main/billing/BillingClientDashboard'
import { shallowMount } from '@vue/test-utils'

describe('Views > BillingDashboard', () => {
  const wrapper = shallowMount(BillingDashboard)

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
