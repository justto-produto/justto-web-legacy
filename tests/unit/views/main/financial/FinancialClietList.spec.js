import FinancialClientList from '@/views/main/financial/FInancialClientList'
import { shallowMount } from '@vue/test-utils'

describe('Views > FinancialClientList', () => {
  const wrapper = shallowMount(FinancialClientList)

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
