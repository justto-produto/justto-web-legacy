import Vue from 'vue'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/pt-br'
import { shallowMount } from '@vue/test-utils'
import ExternalSocialButton from '@/components/buttons/ExternalSocialButton.vue'

Vue.use(Element, { locale })

describe('ExternalSocialButton.vue', () => {
  it('renders props.type when passed', () => {
    const type = 'message'
    const wrapper = shallowMount(ExternalSocialButton, {
      propsData: { type }
    })
    expect(wrapper.text()).toMatch(type)
  })
})
