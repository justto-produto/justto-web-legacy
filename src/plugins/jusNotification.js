import Vue from 'vue'
import I18n from '@/plugins/vueI18n'
import { Notification } from 'element-ui'

const ERROR = ' Houve uma falha de conexão com o servidor.'
const UNAVAILABLE = ' Serviço temporariamente indisponivel.'
const DENY = ' Você não tem permissão para acessar essa página.'
const TRY = ' Tente novamente ou entre em contato com o administrador do sistema.'

const NotificationMessage = {
  install (Vue, options) {
    Vue.prototype.$jusNotification = (config) => {
      if (config.error instanceof Error && config.error.response) {
        let message = I18n.te('error.' + config.error.response.data.code) ? I18n.t('error.' + config.error.response.data.code) : (config.error.response.data.message ? config.error.response.data.message + '.' : '')
        if (config.error.response.status === 503) {
          config.type = 'warning'
          config.message = message || (UNAVAILABLE + TRY)
        } else if (config.error.response.status === 403) {
          config.type = 'warning'
          config.message = message || (DENY + TRY)
        } else if (config.error.response.status === 401) {
          config.type = 'warning'
          config.message = message + '.'
        } else {
          config.type = 'error'
          config.message = message ? (message + TRY) : (ERROR + TRY)
        }
        console.error(config.error)
      }
      if (!config.duration) config.duration = 5000
      if (!config.type) config.type = 'error'
      if (!config.message) config.message = DENY + TRY
      if (!config.title) config.title = 'Ops!'
      config.customClass = config.type
      config.position = 'bottom-right'
      config.offset = 84
      Notification.closeAll()
      Notification(config)
    }
  }
}

Vue.use(NotificationMessage)
