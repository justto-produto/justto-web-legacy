import axiosDispatcher from '@/store/axiosDispatcher'

const workspacesPath = 'api/workspaces'

const workspaceActions = {
  myWorkspace() {
    return axiosDispatcher({
      url: `${workspacesPath}/my`,
      headers: { Workspace: '' }
    })
  },
  getWorkspace({ getters }) {
    return axiosDispatcher({
      url: `${workspacesPath}/${getters.workspaceId}`,
      mutation: 'setWorkspace'
    })
  },
  verifyAvailability({ commit }, subDomain) {
    return axiosDispatcher({
      url: `${workspacesPath}/sub-domain-availability`,
      method: 'PUT',
      data: { subDomain }
    })
  },
  createWorkpace({ commit }, object) {
    return axiosDispatcher({
      url: `${workspacesPath}/workspaces`,
      method: 'POST',
      data: object,
      mutation: 'setWorkspace'
    })
  },
  editWorkpace({ commit, state }, params) {
    const data = {
      id: state.id,
      teamName: state.teamName,
      status: state.status,
      blacklist: state.blackList,
      name: params.name,
      properties: params.properties
    }

    return axiosDispatcher({
      url: `${workspacesPath}`,
      method: 'PUT',
      mutation: 'setWorkspace',
      data
    })
  },
  changeTeamName({ commit }, data) {
    return axiosDispatcher({
      url: `${workspacesPath}/teamName`,
      method: 'patch',
      data
    })
  },
  inviteTeammates({ state }, teammates) {
    return axiosDispatcher({
      url: `api/accounts/workspaces/invite-teammates/${state.subdomain}`,
      method: 'POST',
      data: teammates
    })
  },
  readyWorkspace({ commit }, workspace) {
    return axiosDispatcher({
      url: `${workspacesPath}/ready/${workspace}`,
      method: 'PUT'
    })
  },
  getWorkspaceMembers({ commit, dispatch }) {
    return axiosDispatcher({
      url: `${workspacesPath}/members?size=999&`,
      mutation: 'setWorkspaceMembers'
    })
  },
  getWorkspaces({ _ }) {
    return axiosDispatcher({ url: `${workspacesPath}?size=999&` })
  },
  removeWorkspaceMember({ commit }, id) {
    return axiosDispatcher({
      url: `${workspacesPath}/members/${id}`,
      method: 'DELETE'
    })
  },
  editWorkspaceMember({ commit }, member) {
    return axiosDispatcher({
      url: `${workspacesPath}/members/`,
      method: 'PUT',
      data: member
    })
  },
  syncInbox({ commit }, object) {
    return axiosDispatcher({
      url: `${workspacesPath}/inboxes`,
      method: 'POST',
      data: object
    })
  },
  getMyStrategies({ commit }) {
    return axiosDispatcher({
      url: `${workspacesPath}/strategies`,
      mutation: 'setImportedStrategies'
    })
  },
  patchBlackList({ _ }, blackList) {
    return axiosDispatcher({
      url: `${workspacesPath}/blacklist`,
      method: 'patch',
      data: blackList
    })
  },
  adminWorkspaces({ commit }, params) {
    return new Promise((resolve, reject) => {
      const headers = {}
      if (params.headers && Object.keys(params.headers).length) headers.headers = params.headers
      // eslint-disable-next-line
      axios({
        ...headers,
        ...{
          url: params.url || `${workspacesPath}/${params.workspaceId || ''}`,
          method: params.method,
          params: params.params,
          data: params.data
        }
      }).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  adminWorkspaceUsers({ commit }, params) {
    return new Promise((resolve, reject) => {
      const headers = {}
      if (params.headers && Object.keys(params.headers).length) headers.headers = params.headers
      const config = {
        ...headers,
        ...{
          url: params.url || `${workspacesPath}${params.workspaceId ? '/' + params.workspaceId : ''}/members/${params.userId || ''}`,
          method: params.method,
          params: params.params,
          data: params.data
        }
      }
      // eslint-disable-next-line
      axios(config).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default workspaceActions
