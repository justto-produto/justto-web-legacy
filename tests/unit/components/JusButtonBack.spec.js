import { shallowMount, createLocalVue } from '@vue/test-utils'
import JusButtonBack from '@/components/buttons/JusButtonBack.vue'
import JusIcon from '@/components/images/JusIcon.vue'

const localVue = createLocalVue()
localVue.component('JusIcon', JusIcon)

const wrapper = shallowMount(JusButtonBack, { localVue })

describe('JusButtonBack.vue', () => {
  it('É um objeto Vue.', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('Utiliza o componente JusIcon.', () => {
    expect(wrapper.contains(JusIcon)).toBe(true)
  })
})
