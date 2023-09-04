const setLocalWorkspace = async(workspace) => {
  if (!workspace?.id) return Promise.resolve()

  return new Promise(resolve => {
    console.log('setLocalWorkspace', workspace)

    sessionStorage.setItem('jusworkspace', JSON.stringify(workspace.id))
    localStorage.setItem('jusworkspace', JSON.stringify(workspace))
    // eslint-disable-next-line
    axios.defaults.headers.common['Workspace'] = workspace.subDomain

    resolve()
  })
}

const resetLocalWorkspace = () => {
  localStorage.removeItem('jusworkspace')
  sessionStorage.removeItem('jusworkspace')
}

const validateLocalWorkspace = () => {
  console.log('validateLocalWorkspace')
  if (!Object.keys(localStorage).includes('jusworkspace')) return false

  const workspace = JSON.parse(localStorage.getItem('jusworkspace'))

  console.log('validateLocalWorkspace', workspace?.id, sessionStorage.getItem('jusworkspace'), String(workspace?.id) === String(sessionStorage.getItem('jusworkspace')))

  return String(workspace?.id) === String(sessionStorage.getItem('jusworkspace'))
}

export {
  setLocalWorkspace,
  resetLocalWorkspace,
  validateLocalWorkspace
}
