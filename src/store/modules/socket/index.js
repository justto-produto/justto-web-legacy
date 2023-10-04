import mutations from './mutations'
import actions from './actions'

const socketModule = {
  state: {
    chat: {
      typing: '',
      join: '',
      leave: '',
      message: ''
    }
  },
  mutations,
  actions
}

export default socketModule
