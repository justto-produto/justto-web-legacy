import store from '@/store'
import { getLocalWorkspace } from '../utils/manageLocalWorkspace'

const validateWorkspace = function() {
  setInterval(function() {
    const storageWorkspace = getLocalWorkspace()

    if (store.getters.isLoggedIn && store.getters.hasWorkspace && storageWorkspace && storageWorkspace.subDomain) {
      if (store.getters.workspaceSubdomain !== storageWorkspace.subDomain) {
        window.location.reload()
      }
    }
  }, 5000)
}

export default validateWorkspace
