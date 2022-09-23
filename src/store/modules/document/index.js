import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const document = {
  state: {
    availableSigners: [],
    selectedSigners: [],
    storedDrafts: {},
    openDraftId: null,
    signerService: { enabled: true }
  },
  mutations: mutations,
  actions: actions,
  getters: getters
}

export default document
