import Vue from 'vue'

const accountMutations = {
  setToken(state, resp) {
    const token = resp.token
    // eslint-disable-next-line
    delete axios.defaults.headers.common['Authorization']

    Vue.set(state, 'token', token)
    // if (token) state.token = token

    // eslint-disable-next-line
    axios.defaults.headers.common['Authorization'] = token
    localStorage.removeItem('justoken')
    localStorage.setItem('justoken', token)
  },

  logout(state) {
    state.id = ''
    state.name = ''
    state.email = ''
    state.token = ''
    state.preferences = {}
  },

  setUser(state, response) {
    const { id, name, email } = response
    if (id) Vue.set(state, 'id', id)
    if (name) Vue.set(state, 'name', name)
    if (email) {
      localStorage.setItem('loggedEmail', email)
      Vue.set(state, 'email', email)
    }
  },

  setAccountProperty(state, response) {
    const oldAvailableScheduledCalls = state?.preferences?.properties?.AVAILABLE_SCHEDULED_CALLS

    Vue.set(state.preferences, 'properties', {})

    Object.keys(response).forEach(key => {
      if (key === 'AVAILABLE_SCHEDULED_CALLS' && oldAvailableScheduledCalls !== response[key] && response[key] === 'AVAILABLE') {
        this.dispatch('confirmActiveScheduledCalls', {})
      } else {
        Vue.set(state.preferences.properties, key, response[key])
      }
    })
  },

  setAvailableSchedulerdCalls(state, value) {
    Vue.set(state.preferences.properties, 'AVAILABLE_SCHEDULED_CALLS', value)
  },

  setAccountName(state, name) {
    Vue.set(state, 'name', name)
  }
}

export default accountMutations
