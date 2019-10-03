const localWorkspace = JSON.parse(localStorage.getItem('jusworkspace'))
const workspace = localWorkspace && localWorkspace.workspace ? localWorkspace.workspace : {}
const profile = localWorkspace && localWorkspace.profile ? localWorkspace.profile : ''

const workspaceModule = {
  state: {
    id: workspace.id,
    name: workspace.name,
    type: workspace.type,
    status: workspace.status,
    subdomain: workspace.subDomain,
    profile: profile,
    members: []
  },
  mutations: {
    updateWorkspace (state, workspace) {
      if (workspace) {
        // eslint-disable-next-line
        axios.defaults.headers.common['Workspace'] = workspace.subDomain
        state.subdomain = workspace.subDomain
        state.name = workspace.name
        state.type = workspace.type
        state.status = workspace.status
        state.id = workspace.id
        localStorage.setItem('jusworkspace', JSON.stringify(workspace))
      }
    },
    updateProfile (state, profile) {
      if (profile) state.profile = profile
    },
    addWorkspace (state, response) {
      if (response) {
        // eslint-disable-next-line
        axios.defaults.headers.common['Workspace'] = response.subDomain
        state.subdomain = response.subDomain
        state.name = response.name
        state.type = response.type
        state.status = response.status
        state.id = response.id
      }
    },
    clearWorkspace (state) {
      state.id = ''
      state.name = ''
      state.type = ''
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
            commit('addWorkspace', response.data)
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
    creatingWorkspace: state => state.status === 'CREATING',
    workspaceId: state => state.subdomain,
    workspaceSubdomain: state => state.subdomain,
    workspaceMembers: state => state.members
  }
}

export default workspaceModule
