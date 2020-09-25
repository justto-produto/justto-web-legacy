import actions from './actions'
import getters from './getters'
import mutations from './mutations'

function detectBrowserName() {
  const agent = navigator.userAgent
  if (agent.indexOf('Opera') !== -1) return 'Opera'
  if (agent.indexOf('MSIE') !== -1) return 'Microsoft Internet Explorer'
  if (agent.indexOf('Chrome') !== -1) return 'Chrome'
  if (agent.indexOf('Safari') !== -1) return 'Safari'
  if (agent.indexOf('Firefox') !== -1) return 'Firefox'
  return 'Unknown'
}

function detectOSName() {
  if (navigator.appVersion.indexOf('Win') !== -1) return 'Windows'
  if (navigator.appVersion.indexOf('Mac') !== -1) return 'MacOS'
  if (navigator.appVersion.indexOf('X11') !== -1) return 'UNIX'
  if (navigator.appVersion.indexOf('Linux') !== -1) return 'Linux'
  return 'Unknown OS'
}

const UserModule = {
  state: {
    user: {
      language: navigator.language,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      browser: {
        name: detectBrowserName(),
        agent: navigator.userAgent,
        platform: navigator.platform,
        vendor: navigator.vendor
      },
      OS: {
        name: detectOSName()
      }
    }
  },
  actions,
  getters,
  mutations
}

export default UserModule
