import Vue from 'vue'
import { Notification } from 'element-ui'

const errorMessage = 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.'

const NotificationMessage = {
  install (Vue, options) {
    Vue.prototype.$jusNotification = (config) => {
      if (config.error instanceof Error) {
        if (config.error.response.status === 500) {
          config.type = 'error'
          config.message = errorMessage
        } else if (config.error.response.status === 503) {
          config.type = 'warning'
          config.message = 'Serviço temporariamente indisponivel. por favor tente novamente em alguns instantes.'
        } else {
          config.type = 'warning'
          config.message = (config.error.response.data.fields.Error || config.error.response.data.reason) || errorMessage
        }
      } else {
        if (config.type === 'error') {
          config.message = config.message ? config.message : errorMessage
        } else if (config.type === '403') {
          config.type = 'warning'
          config.message = config.message ? config.message : 'Você não tem permissão para acessar essa página. Entre em contato com o administrador do sistema.'
        }
      }
      config.title = config.title ? config.title : 'Ops!'
      config.customClass = config.type
      config.position = 'bottom-right'
      config.offset = 84
      if (config.duration === undefined) {
        config.duration = 5000
      }
      Notification.closeAll()
      Notification(config)
    }
  }
}

Vue.use(NotificationMessage)
