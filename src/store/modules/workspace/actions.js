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
  verifyAvailability({ _ }, subDomain) {
    return axiosDispatcher({
      url: `${workspacesPath}/sub-domain-availability`,
      method: 'PUT',
      data: { subDomain }
    })
  },
  createWorkpace({ _ }, object) {
    return axiosDispatcher({
      url: `${workspacesPath}`,
      method: 'POST',
      data: object,
      mutation: 'setWorkspace'
    })
  },
  editWorkpace({ state }, params) {
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
  changeTeamName({ _ }, data) {
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
  readyWorkspace({ _ }, workspace) {
    return axiosDispatcher({
      url: `${workspacesPath}/ready/${workspace}`,
      method: 'PUT'
    })
  },
  getWorkspaceMembers({ _ }) {
    return axiosDispatcher({
      url: `${workspacesPath}/members?size=999&`,
      mutation: 'setWorkspaceMembers'
    })
  },
  getWorkspaces({ _ }) {
    return axiosDispatcher({ url: `${workspacesPath}?size=999&` })
  },
  removeWorkspaceMember({ _ }, id) {
    return axiosDispatcher({
      url: `${workspacesPath}/members/${id}`,
      method: 'DELETE'
    })
  },
  editWorkspaceMember({ _ }, member) {
    return axiosDispatcher({
      url: `${workspacesPath}/members/`,
      method: 'PUT',
      data: member
    })
  },
  syncInbox({ _ }, object) {
    return axiosDispatcher({
      url: `${workspacesPath}/inboxes`,
      method: 'POST',
      data: object
    })
  },
  getMyStrategies({ _ }) {
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
  adminWorkspaces({ _ }, params) {
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
  adminWorkspaceUsers({ _ }, params) {
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
