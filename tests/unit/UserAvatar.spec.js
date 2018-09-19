import { shallowMount } from '@vue/test-utils'
import UserAvatar from '@/components/images/UserAvatar.vue'

Vue.use(Element, { locale })

describe('UserAvatar.vue', () => {
  it('renders props.type when passed', () => {
    const type = 'message'
    const wrapper = shallowMount(ExternalSocialButton, {
      propsData: { type }
    })
    expect(wrapper.text()).toMatch(type)
  })
})
