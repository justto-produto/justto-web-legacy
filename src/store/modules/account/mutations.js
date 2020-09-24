import Vue from 'vue'

const accountMutations = {
  setToken(state, resp) {
    const token = resp.token
    // eslint-disable-next-line
    delete axios.defaults.headers.common['Authorization']

    Vue.set(state, 'token', token)

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
  },
  setUser(state, response) {
    if (response.id) state.id = response.id
    if (response.name) state.name = response.name
    if (response.email) state.email = response.email
    if (response.properties) state.properties = response.properties
  },
}

export default accountMutations
