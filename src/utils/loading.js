import { Loading } from 'element-ui'

const showLoading = function() {
  const currentHour = new Date().getHours()
  const currentMinuts = new Date().getMinutes()
  const systemShouldBeUp = currentHour < 23 && (currentHour >= 8 || (currentHour === 7 && currentMinuts >= 30))
  if (!systemShouldBeUp) {
    const loading = Loading.service({
      lock: true,
      text: 'Nossos serviços encontram-se em manutenção diária no momento.\nRetorne entre às 7h30 e 23h.',
      background: 'rgba(0, 0, 0, 0.85)',
      customClass: 'el-loading-mask--offline'
    })
    const newDate = new Date()
    const timeLeft = newDate.getTime() - new Date(newDate.getFullYear(), newDate.getMonth(), currentHour >= 23 ? newDate.getDay() + 1 : newDate.getDay(), 7, 30)
    setTimeout(function() {
      loading.close()
    }, timeLeft)
  }
}

export default showLoading
