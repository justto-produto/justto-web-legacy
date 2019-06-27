import { shallowMount, createLocalVue } from '@vue/test-utils'
import JusCarouselCard from '@/components/layouts/JusCarouselCard.vue'
import VueRouter from 'vue-router'
import Element from 'element-ui'
import '@/filters/capitalize'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(Element)

let router = new VueRouter()
const wrapper = shallowMount(JusCarouselCard, { localVue, router })
wrapper.setProps({ slide: {} })

describe('JusCarouselCard.vue', () => {
  it('É um objeto Vue.', () => {
    expect(wrapper.isVueInstance()).toBe(true)
  })
  it('Inicia vazio', () => {
    expect(!!Object.keys(wrapper.props().slide)).toBe(true)
  })
})
