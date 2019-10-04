import Vue from 'vue'
import { Notification } from 'element-ui'

const NotificationMessage = {
  install (Vue, options) {
    Vue.prototype.$jusNotification = (config) => {
      if (config.type === 'error') {
        config.title = config.title ? config.title : 'Ops!'
        config.message = config.message ? config.message : 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.'
      }
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
