import { axiosDispatch } from '@/utils'
import axios from 'axios'

const workspacesPath = 'api/workspaces'
const accountsWorkspaceApi = 'api/accounts/workspaces'

const workspaceActions = {
  myWorkspace() {
    return axiosDispatch({
      url: `${workspacesPath}/my`,
      headers: { Workspace: '' },
      mutation: 'setUserWorkspaces'
    })
  },
  getWorkspace({ getters }) {
    return axiosDispatch({
      url: `${workspacesPath}/${getters.workspaceId}`,
      mutation: 'setWorkspace'
    })
  },
  verifyAvailability({ _ }, subDomain) {
    return axiosDispatch({
      url: `${workspacesPath}/sub-domain-availability`,
      method: 'PUT',
      data: { subDomain }
    })
  },
  editWorkpaceProperties({ state }, properties) {
    const workspaceId = state.workspace.id
    return axiosDispatch({
      url: `${workspacesPath}/${workspaceId}/properties`,
      method: 'PUT',
      mutation: 'setWorkspace',
      data: properties
    })
  },
  updateWorkspaceLogoUrl({ commit }, logoUrl) {
    commit('updateWorkspaceLogoUrl', logoUrl)
  },
  editWorkpace({ state }, workspace) {
    const { id, teamName, status, name } = state.workspace
    const data = { id, teamName, status, name, ...workspace }

    return axiosDispatch({
      url: `${workspacesPath}/`,
      method: 'PUT',
      mutation: 'setWorkspace',
      data
    })
  },
  changeTeamName({ _ }, data) {
    return axiosDispatch({
      url: `${workspacesPath}/teamName`,
      method: 'patch',
      data,
      mutation: 'setTeamName',
      payload: data.teamName
    })
  },
  inviteTeammates({ state, dispatch }, teammates) {
    return axiosDispatch({
      url: `api/accounts/workspaces/invite-teammates/${state.workspace.subDomain}`,
      method: 'POST',
      data: teammates
    }).then(() => {
      dispatch('getWorkspaceTeam')
      dispatch('getWorkspaceMembers')
    })
  },
  readyWorkspace({ _ }, workspace) {
    return axiosDispatch({
      url: `${workspacesPath}/ready/${workspace}`,
      method: 'PUT'
    })
  },
  getWorkspaceMembers({ _ }) {
    return axiosDispatch({
      url: `${workspacesPath}/members?size=999&`,
      mutation: 'setWorkspaceMembers'
    })
  },
  getWorkspaceTeam({ _ }) {
    return axiosDispatch({
      url: '/api/accounts?size=999&sort=personName,asc',
      mutation: 'setWorkspaceTeam'
    })
  },
  getWorkspaces({ _ }) {
    return axiosDispatch({ url: `${workspacesPath}?size=999&` })
  },
  removeWorkspaceMember({ _ }, id) {
    return axiosDispatch({
      url: `${workspacesPath}/members/${id}`,
      method: 'DELETE'
    })
  },
  getFeaturesAndModules({ _ }) {
    return axiosDispatch({
      url: `${workspacesPath}/feature/`,
      mutation: 'setFeaturesAndModules'
    })
  },
  editWorkspaceMember({ dispatch }, member) {
    return axiosDispatch({
      url: `${workspacesPath}/members/`,
      method: 'PUT',
      data: member
    }).then(() => {
      dispatch('getWorkspaceMembers')
      dispatch('getWorkspaceTeam')
    })
  },
  toggleConfiguration({ dispatch }, { value, featureId }) {
    return axiosDispatch({
      url: `${workspacesPath}/feature/${featureId}/${value}`,
      method: 'PATCH'
    }).then(() => {
      dispatch('getFeaturesAndModules')
    })
  },
  syncInbox({ _ }, object) {
    return axiosDispatch({
      url: `${workspacesPath}/inboxes`,
      method: 'POST',
      data: object
    })
  },
  getMyStrategies({ _ }) {
    return axiosDispatch({
      url: 'api/workspaces/strategies',
      mutation: 'setImportedStrategies'
    })
  },
  patchBlackList({ _ }, blackList) {
    return axiosDispatch({
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
  },
  getWorkspaceKeyAccounts({ _ }) {
    return axiosDispatch({
      url: 'api/accounts/workspaces/keyAccount',
      mutation: 'setWorkspaceKeyAccounts'
    })
  },

  getAssociatedKeyAccount({ getters }) {
    return axiosDispatch({
      url: `${accountsWorkspaceApi}/${getters.workspaceId}/keyAccount`,
      mutation: 'setAssociatedKeyAccount'
    })
  },

  updateWorkspaceKeyAccount({ getters }, keyAccountId) {
    return axiosDispatch({
      url: `${accountsWorkspaceApi}/${getters.workspaceId}/keyAccount/${keyAccountId}`,
      method: 'patch',
      mutation: 'updateAssociatedKeyAccount',
      payload: { keyAccountId }
    })
  }
}

export default workspaceActions
