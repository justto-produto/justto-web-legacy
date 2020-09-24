import { isJusttoUser } from '@/utils/jusUtils'

const accountGetters = {
  userPreferences: state => state.properties,
  accountToken: state => state.token,
  isLoggedIn: state => !!state.token,
  accountId: state => state.id,
  accountEmail: state => state.email,
  isJusttoAdmin: state => isJusttoUser(state.email),
  isJusttoDev: state => state.devs.indexOf(state.email) !== -1,
}

export default accountGetters
