import Vue from 'vue'

const setLocalWorkspace = async(workspace) => {
  if (!workspace?.id) return Promise.reject(new Error('Workspace ID is required'))

  return new Promise(resolve => {
    sessionStorage.setItem('jusworkspace', JSON.stringify(workspace.id))
    localStorage.setItem(`jusworkspace_${workspace.id}`, JSON.stringify(workspace))

    // eslint-disable-next-line no-undef
    Vue.set(axios.defaults.headers.common, 'Workspace', workspace.subDomain)

    resolve()
  })
}

const resetLocalWorkspace = () => {
  const id = sessionStorage.getItem('jusworkspace')

  localStorage.removeItem(`jusworkspace_${id}`)
  sessionStorage.removeItem('jusworkspace')
}

const validateLocalWorkspace = () => {
  const id = sessionStorage.getItem('jusworkspace')

  if (Boolean(id) === false) return false
  if (!Object.keys(localStorage).includes(`jusworkspace_${id}`)) return false

  const workspace = getLocalWorkspace()

  return String(workspace?.id) === String(sessionStorage.getItem('jusworkspace'))
}

const getLocalWorkspace = () => {
  const id = sessionStorage.getItem('jusworkspace')

  return JSON.parse(localStorage.getItem(`jusworkspace_${id}`) || '{}')
}

export {
  getLocalWorkspace,
  setLocalWorkspace,
  resetLocalWorkspace,
  validateLocalWorkspace
}
