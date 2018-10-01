import { shallowMount } from '@vue/test-utils'
import JusSidenavExternal from '@/components/layouts/JusSidenavExternal.vue'

describe('JusSidenavExternal.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(JusSidenavExternal)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
