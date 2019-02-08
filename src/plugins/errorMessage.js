import Vue from 'vue'

const HandleError = {
  install (Vue, options) {
    Vue.prototype.$errorMessage = () => { return {
      title: 'Ops!',
      message: 'Houve uma falha de conexão com o servidor.',
      position: 'bottom-right',
      customClass: 'danger',
      type: 'error',
      duration: 5000
    }}
  }
}

Vue.use(HandleError)
