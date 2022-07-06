import { isJusttoUser } from '@/utils/validations'

const accountGetters = {
  userPreferences: state => state.preferences,
  userProperties: state => state.preferences?.properties || {},
  accountToken: state => state.token,
  isLoggedIn: state => !!state.token,
  accountId: state => state.id,
  accountEmail: state => state.email,
  isJusttoAdmin: state => isJusttoUser(state.email),
  isJusttoDev: state => state.devs.indexOf(state.email) !== -1,
  canAccessDialer: (state, getters) => {
    return state.preferences?.properties?.DIALER_ACCESS !== 'UNAUTHORIZED' && getters.workspaceProperties?.WORKSPACE_DIALER_ACCESS !== 'UNAUTHORIZED'
  },
  canMakeScheduledCalls: state => state?.preferences?.properties?.AVAILABLE_SCHEDULED_CALLS === 'AVAILABLE',
  preferedInterface: state => state?.preferences?.properties?.PREFERRED_INTERFACE || 'NEGOTIATION',
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
  },
  isOmnichannelGrouping: state => state.preferences?.properties?.OMNICHANNEL_GROUPING_TYPE === 'GROUPED',
  useSignature: state => state.preferences?.properties?.USE_SIGNATURE !== 'DISABLED'
}

export default accountGetters
