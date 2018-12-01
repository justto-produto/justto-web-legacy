import { shallowMount } from '@vue/test-utils'
import JusButtonBack from '@/components/buttons/JusButtonBack.vue'
import JusIcon from '@/components/images/JusIcon.vue'

describe('JusButtonBack.vue', () => {
  it('renders props.msg when passed', () => {
    const wrapper = shallowMount(JusButtonBack, {
      stubs: {
        JusIcon
      }
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
