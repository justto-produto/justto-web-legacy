import Vue from 'vue'
import { Notification } from 'element-ui'

const NotificationMessage = {
  install (Vue, options) {
    Vue.prototype.$jusNotification = (config) => {
      config.customClass = config.type
      config.position = 'bottom-right'
      config.offset = 84
      if (config.duration === undefined) {
        config.duration = 5000
      }
      Notification(config)
    }
  }
}

Vue.use(NotificationMessage)
