import store from '@/store'

const validateWorkspace = function() {
  setInterval(function() {
    const storageWorkspace = JSON.parse(localStorage.getItem('jusworkspace'))
    if (store.getters.isLoggedIn && store.getters.hasWorkspace && storageWorkspace && storageWorkspace.subDomain) {
      if (store.getters.workspaceSubdomain !== storageWorkspace.subDomain) {
        window.location.reload()
      }
    }
  }, 5000)
}

export default validateWorkspace
