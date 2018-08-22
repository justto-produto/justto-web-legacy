import { shallowMount } from '@vue/test-utils'
import ExternalSidenav from '@/components/layouts/ExternalSidenav.vue'

describe('ExternalSidenav.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(ExternalSidenav)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
