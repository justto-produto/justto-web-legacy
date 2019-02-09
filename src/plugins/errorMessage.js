import Vue from 'vue'

const HandleError = {
  install (Vue, options) {
    Vue.prototype.$errorMessage = () => {
      return {
        title: 'Ops!',
        errorMessage: `Houve uma falha de conexão com o servidor.
        Tente novamente ou entre em contato com o administrador do sistema.`,
        position: 'bottom-right',
        customClass: 'danger',
        type: 'error',
        duration: 5000
      }
    }
  }
}

Vue.use(HandleError)
