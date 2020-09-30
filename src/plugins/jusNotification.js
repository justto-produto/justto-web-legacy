import Vue from 'vue'
import I18n from '@/plugins/vueI18n'
import { Notification } from 'element-ui'

const ERROR = 'Houve uma falha de conexão com o servidor.'
const UNAVAILABLE = 'Serviço temporariamente indisponivel.'
const DENY = 'Você não tem permissão para acessar essa página.'
const TRY = ' Tente novamente ou entre em contato com o administrador do sistema.'
const TIMEOUT = 'Tempo limite da requisição excedido.'
const NOTFOUND = 'Erro 404 (Rota não encontrada).'

const NotificationMessage = {
  install(Vue, options) {
    Vue.prototype.$jusNotification = (config) => {
      if (config.error instanceof Error) {
        if (config.error.response) {
          const message = I18n.te('error.' + config.error.response.data.code) ? I18n.t('error.' + config.error.response.data.code) : (config.error.response.data.message ? config.error.response.data.message + '.' : '')
          switch (config.error.response.status) {
            case 504:
              config.message = message || (TIMEOUT + TRY)
              break
            case 503:
              config.type = 'warning'
              config.message = message || (UNAVAILABLE + TRY)
              break
            case 403:
              config.type = 'warning'
              config.message = message || (DENY + TRY)
              if (config.error.response.data && config.error.response.data.fields.Error) {
                config.message = config.error.response.data.fields.Error
              }
              break
            case 401:
              config.type = 'warning'
              config.message = message + '.'
              break
            case 404:
              config.message = NOTFOUND + TRY
              break
            default:
              if (config.error.response.data && config.error.response.data.reason) {
                config.message = config.error.response.data.reason
              } else {
                config.message = (message && message !== 'No message available.') ? (message + TRY) : (ERROR + TRY)
              }
              break
          }
        }
        console.error(config.error)
      }
      if (!config.duration) config.duration = 5000
      if (!config.type) config.type = 'error'
      if (!config.message) config.message = ERROR + TRY
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
