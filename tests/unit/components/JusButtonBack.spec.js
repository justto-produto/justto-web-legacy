import { shallowMount } from '@vue/test-utils'
import JusButtonBack from '@/components/buttons/JusButtonBack.vue'
import JusIcon from '@/components/images/JusIcon.vue'
import Vue from 'vue'
Vue.component('JusIcon', JusIcon)

const wrapper = shallowMount(JusButtonBack)

describe('JusButtonBack.vue', () => {
  it('É um objeto Vue.', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
  it('Utiliza o componente JusIcon.', () => {
    expect(wrapper.contains(JusIcon)).toBe(true)
  })
})
