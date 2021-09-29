import { isJusttoUser } from '@/utils/validations'

const accountGetters = {
  userPreferences: state => state.preferences,
  accountToken: state => state.token,
  isLoggedIn: state => !!state.token,
  accountId: state => state.id,
  accountEmail: state => state.email,
  isJusttoAdmin: state => isJusttoUser(state.email),
  isJusttoDev: state => state.devs.indexOf(state.email) !== -1,
  canAccessDialer: (state, getters) => {
    return state.preferences?.properties?.DIALER_ACCESS === 'AUTHORIZED' || getters.workspaceProperties?.WORKSPACE_DIALER_ACCESS === 'AUTHORIZED'
  },

  getGlobalAuthenticationObject(state, getters) {
    return {
      headers: {
        Authorization: getters.accountToken,
        Workspace: getters.workspaceSubdomain
      },
      email: getters.accountEmail,
      accountId: getters.accountId,
      personId: getters.loggedPersonId
    }
  }
}

export default accountGetters
