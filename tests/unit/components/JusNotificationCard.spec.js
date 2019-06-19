import { shallowMount, createLocalVue } from '@vue/test-utils'
import JusNotificationCard from '@/components/layouts/JusNotificationCard.vue'
import JusAvatarUser from '@/components/images/JusAvatarUser.vue'

const localVue = createLocalVue()
localVue.component('JusAvatarUser', JusAvatarUser)

describe('JusNotificationCard.vue', () => {
  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(JusNotificationCard, { localVue })
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('Inicia vazio', () => {
    const wrapper = shallowMount(JusNotificationCard, { localVue })
    expect(wrapper.props().title).toBe('')
    expect(wrapper.props().main).toBe('')
    expect(wrapper.props().date).toBe('')
    expect(wrapper.props().complement).toBe('')
  })
})
