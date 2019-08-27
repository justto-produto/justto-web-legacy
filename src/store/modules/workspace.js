const workspaceModule = {
  state: {
    id: '',
    name: '',
    status: '',
    subdomain: '',
    profile: '',
    members: []
  },
  mutations: {
    updateWorkspace (state, response) {
      if (response && response.workspace) {
        // eslint-disable-next-line
        axios.defaults.headers.common['Workspace'] = response.workspace.subDomain
        state.subdomain = response.workspace.subDomain
        state.name = response.workspace.name
        state.status = response.workspace.status
        state.id = response.workspace.id
      }
      if (response && response.profile) state.profile = response.profile
    },
    clearWorkspace (state) {
      state.id = ''
      state.name = ''
      state.status = ''
      state.subdomain = ''
      state.profile = ''
      state.members = []
    },
    setWorkspaceMembers (state, members) {
      state.members = members
    }
  },
  actions: {
    myWorkspace ({ commit }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('api/workspaces/my')
          .then(response => {
            commit('updateWorkspace', response.data[0])
            resolve(response.data)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    verifyAvailability ({ commit }, subdomain) {
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
    createWorkpace ({ commit }, object) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('api/accounts/workspaces', object)
          .then(response => {
            commit('updateWorkspace', response.data)
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    editWorkpace ({ commit }, nameOjb) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('api/workspaces', nameOjb)
          .then(response => {
            commit('updateWorkspace', response.data)
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    inviteTeammates ({ commit, state }, teammates) {
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
    readyWorkspace ({ commit }, workspace) {
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
    whatsappCreate ({ commit, state }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('api/workspaces/whatsapp/create/' + state.subdomain)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    whatsappSend ({ commit, state }, object) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.post('api/workspaces/whatsapp/send/' + state.subdomain, object)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    whatsappStart ({ commit, state }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('api/workspaces/whatsapp/start/' + state.subdomain)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    getWhatsappStatus ({ commit, state }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('api/workspaces/whatsapp/status/' + state.subdomain)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    whatsappStop ({ commit, state }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.put('api/workspaces/whatsapp/stop/' + state.subdomain)
          .then(response => {
            resolve(response.data)
          }).catch(error => {
            reject(error)
          })
      })
    },
    getWorkspaceMembers ({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.get('api/workspaces/members')
          .then(response => {
            var promises = []
            for (let member of response.data.content) {
              promises.push(dispatch('getPerson', member.personId))
            }
            Promise.all(promises).then(responses => {
              for (var i = 0; i < response.data.content.length; i++) {
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
    removeWorkspaceMember ({ commit }, id) {
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
    editWorkspaceMember ({ commit }, member) {
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
    syncInbox ({ commit }, object) {
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
    removeInbox ({ commit }, id) {
      return new Promise((resolve, reject) => {
        // eslint-disable-next-line
        axios.delete('api/workspaces/inboxes/' + id)
          .then(response => {
            resolve(response)
          }).catch(error => {
            reject(error)
          })
      })
    }
  },
  getters: {
    hasWorkspace: state => {
      return state.status !== '' && state.status !== 'CREATING'
    },
    creatingWorkspace: state => {
      return state.status === 'CREATING'
    },
    workspaceId: state => state.subdomain,
    workspaceSubdomain: state => state.subdomain,
    workspaceMembers: state => state.members
  }
}

export default workspaceModule
