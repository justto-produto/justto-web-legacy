import axiosDispatcher from '@/store/axiosDispatcher.js'

const actions = {
  myWorkspace() {
    return axiosDispatcher({
      url: 'api/workspaces/my',
      headers: { Workspace: '' },
    })
  },
  getWorkspace({ getters }) {
    return axiosDispatcher({
      url: `api/workspaces/${getters.workspaceId}`,
      mutation: 'setWorkspace',
    })
  },
  verifyAvailability({ commit }, subdomain) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/workspaces/sub-domain-availability', {subDomain: subdomain})
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  createWorkpace({ commit }, object) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.post('api/accounts/workspaces', object)
        .then(response => {
          commit('setWorkspace', response.data)
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  editWorkpace({ commit, state }, params) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/workspaces', {
        teamName: state.teamName,
        status: state.status,
        name: params.name || state.name,
        properties: params.properties || state.properties,
      }).then(response => {
        commit('setWorkspace', response.data)
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  changeTeamName({ commit }, data) {
    return axiosDispatcher({
      url: '/api/workspaces/teamName',
      method: 'patch',
      data,
    })
  },
  inviteTeammates({ state }, teammates) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.post('api/accounts/workspaces/invite-teammates/' + state.subdomain, teammates)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  readyWorkspace({ commit }, workspace) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/workspaces/ready/' + workspace)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  getWorkspaceMembers({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/workspaces/members?size=999&')
        .then(response => {
          const promises = []
          for (const member of response.data.content) {
            promises.push(dispatch('getPerson', member.personId))
          }
          Promise.all(promises).then(responses => {
            for (let i = 0; i < response.data.content.length; i++) {
              response.data.content[i].person = responses[i]
            }
            resolve(response.data.content)
            commit('setWorkspaceMembers', response.data.content)
          })
        }).catch(error => {
          reject(error)
        })
    })
  },
  removeWorkspaceMember({ commit }, id) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.delete('api/workspaces/members/' + id)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  editWorkspaceMember({ commit }, member) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.put('api/workspaces/members/', member)
        .then(response => {
          resolve(response.data)
        }).catch(error => {
          reject(error)
        })
    })
  },
  syncInbox({ commit }, object) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.post('api/workspaces/inboxes', object)
        .then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
    })
  },
  getMyStrategies({ commit }) {
    return new Promise((resolve, reject) => {
      // eslint-disable-next-line
      axios.get('api/workspaces/strategies')
        .then(response => {
          commit('setStrategies', response.data)
          resolve(response.data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },
  patchBlackList({ commit }, blackList) {
    return axiosDispatcher({
      url: 'api/workspaces/blacklist',
      method: 'patch',
      data: blackList,
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
          url: params.url || `api/workspaces/${params.workspaceId || ''}`,
          method: params.method,
          params: params.params,
          data: params.data,
        },
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
          url: params.url || `api/workspaces${params.workspaceId ? '/' + params.workspaceId : ''}/members/${params.userId || ''}`,
          method: params.method,
          params: params.params,
          data: params.data,
        },
      }
      // eslint-disable-next-line
      axios(config).then(response => {
        resolve(response.data)
      }).catch(error => {
        reject(error)
      })
    })
  },
}

export default actions
