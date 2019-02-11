import Vue from 'vue'

const CONNECTION_ERROR = 'connectionError'
const INVALID_FILE_FORMAT = 'invalidFileFormat'
const FILE_LIMIT = 'fileLimit'
const MESSAGE_SUCCESS = 'messageSuccess'

const NotificationMessage = {
  install (Vue, options) {
    Vue.prototype.$notificationMessage = (notification) => {
      let title = 'Ops!'
      let message = 'Houve uma falha no sistema.'
      let type = 'error'
      let customClass = 'error'
      let position = 'bottom-right'
      let duration = '5000'
      if (typeof notification === 'object') {
        if (notification.title) title = notification.title
        if (notification.message) message = notification.message
        type = 'success'
        customClass = 'success'
      } else {
        switch (notification) {
          case CONNECTION_ERROR:
            message = 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.'
            break
          case INVALID_FILE_FORMAT:
            message = 'Arquivo em formato inválido.'
            type = 'warning'
            customClass = 'warning'
            break
          case FILE_LIMIT:
            message = 'Limite de 20 MB por arquivo.'
            type = 'warning'
            customClass = 'warning'
            break
          case MESSAGE_SUCCESS:
            message = 'Mensagem enviada com sucesso!'
            type = 'success'
            customClass = 'success'
            break
          default:
            message = notification
            type = 'success'
            customClass = 'success'
            break
        }
      }
      return {
        title,
        message,
        customClass,
        position,
        type,
        duration
      }
    }
  }
}

Vue.use(NotificationMessage)
