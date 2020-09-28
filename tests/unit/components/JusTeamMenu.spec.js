import '@/filters/capitalize'

import { createLocalVue, shallowMount } from '@vue/test-utils'

import Element from 'element-ui'
import JusAvatarUser from '@/components/images/JusAvatarUser.vue'
import JusTeamMenu from '@/components/layouts/JusTeamMenu.vue'
import Vuex from 'vuex'

const localVue = createLocalVue()
localVue.use(Element)
localVue.component('JusAvatarUser', JusAvatarUser)
localVue.use(Vuex)

describe('JusTeamMenu.vue', () => {
  let store
  let state
  beforeEach(() => {
    state = {
      workspaceModule: {}
    }

    store = new Vuex.Store({
      state
    })
  })
  it('É um objeto Vue.', () => {
    const wrapper = shallowMount(JusTeamMenu, { localVue, store })
    expect(wrapper.isVueInstance()).toBe(true)
  })
})
