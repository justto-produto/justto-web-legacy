import BillingClientList from '@/views/main/billing/BillingClientList'
import { shallowMount } from '@vue/test-utils'

describe('Views > BillingClientList', () => {
  const wrapper = shallowMount(BillingClientList)

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
