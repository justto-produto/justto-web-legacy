import Vue from 'vue'
import { Notification } from 'element-ui'

const NotificationMessage = {
  install (Vue, options) {
    Vue.prototype.$jusNotification = (config) => {
      debugger
      if (config.error instanceof Error ) {
        config.type = 'warning'
        config.message = config.error.response.data.fields.Error || 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.'
      }
      if (config.type === 'error') {
        config.message = config.message ? config.message : 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.'
      } else if (config.type === '403') {
        config.type = 'warning'
        config.message = config.message ? config.message : 'Você não tem permissão para acessar essa página. Entre em contato com o administrador do sistema.'
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
