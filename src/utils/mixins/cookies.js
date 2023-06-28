import { Notification } from 'element-ui'

export default {
  data: () => ({
    notificationInstance: null
  }),

  mounted() {
    const tag = this.$createElement

    const content = tag('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }
    }, [
      tag('p', {}, [
        tag('span', {}, 'Nós armazenamos dados temporariamente para melhorar a experiência de navegação e recomendar conteúdo de seu interesse. Ao utilizar nossos serviços, você concorda com tal monitoramento. ')
      ]),
      tag('button', {
        class: 'el-button el-button--default el-button--medium el-button--secondary font-weight-600 medium-btn',
        type: 'button'
      }, 'Aceitar')
    ])

    if (!(document.cookie.includes('acceptedCookies=true'))) {
      Notification.closeAll()

      this.notificationInstance = Notification({
        title: 'Esse site usa cookies',
        dangerouslyUseHTMLString: true,
        message: content,
        customClass: 'cookies-notification',
        position: 'bottom-right',
        duration: 0,
        showClose: false,
        onClick: this.acceptCookies
      })
    }
  },

  methods: {
    acceptCookies() {
      this.setCookie('acceptedCookies', true, 7)

      if (this.notificationInstance) {
        this.notificationInstance.close()
      }
    },

    setCookie(name, value, time) {
      let t = ''

      if (time) {
        const n = new Date()
        n.setTime(n.getTime() + 24 * time * 60 * 60 * 1e3)
        t = `; expires=${n.toUTCString()}`
      }

      document.cookie = name + '=' + (value || '') + t + '; path=/'
    }
  }
}
