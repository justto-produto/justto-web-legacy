import { JusGrid } from '@/components/JusGrid'
import { shallowMount } from '@vue/test-utils'

describe('Components > JusGrid', () => {
  const wrapper = shallowMount(JusGrid)

  it('renders correctly', () => {
    expect(wrapper.element).toMatchSnapshot()
  })
})
