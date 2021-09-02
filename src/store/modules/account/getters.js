import { isJusttoUser } from '@/utils/validations'

const accountGetters = {
  userPreferences: state => state.preferences,
  accountToken: state => state.token,
  isLoggedIn: state => !!state.token,
  accountId: state => state.id,
  accountEmail: state => state.email,
  isJusttoAdmin: state => isJusttoUser(state.email),
  isJusttoDev: state => state.devs.indexOf(state.email) !== -1,
  canAccessDialer: state => state.preferences.properties.DIALER_ACCESS === 'AUTHORIZED'
}

export default accountGetters
