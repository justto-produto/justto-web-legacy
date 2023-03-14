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
  preventScheduleCallsConfirmation: state => state.preventScheduleCallsConfirmation,
  isOmnichannelGrouping: state => state.preferences?.properties?.OMNICHANNEL_GROUPING_TYPE === 'GROUPED',
  isOmnichannelUsingColors: state => state?.preferences?.properties?.OMNICHANNEL_COLORING_TYPE !== 'MONOCHROME',
  omnichannelColoringType: state => state?.preferences?.properties?.OMNICHANNEL_COLORING_TYPE || 'COLORFUL',
  useSignature: state => state.preferences?.properties?.USE_SIGNATURE === 'ENABLED',
  getCustomHome: state => state.preferences?.properties?.CUSTOM_HOME,
  getTicketListMode: (state, getters) => (getters.showNegotiationTypeMenu ? (state.preferences?.properties?.TICKET_LIST_MODE || 'TICKET') : 'TICKET'),
  getAccountUseDisputeProjection: state => state.preferences?.properties?.USE_DISPUTE_PROJECTION === 'ENABLED'
}

export default accountGetters
