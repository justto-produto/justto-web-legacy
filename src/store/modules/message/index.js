import actions from './actions'
import getters from './getters'
import mutations from './mutations'

const message = {
  state: {
    recentMessages: [],
    messageResumes: [],
    quickReplyTemplates: [],
    previewMessage: '',
    showPreview: false,
    messageBackup: {},
    messageBackupDebounce: null
  },
  mutations,
  actions,
  getters
}

export default message
