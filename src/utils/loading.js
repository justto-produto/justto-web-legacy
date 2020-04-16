import { Loading } from 'element-ui'

const showLoading = function () {
  let currentHour = new Date().getHours()
  let currentMinuts = new Date().getMinutes()
  let systemShouldBeUp = currentHour < 23 && (currentHour >= 8 || (currentHour === 7 && currentMinuts >= 30))
  if (!systemShouldBeUp) {
    const loading = Loading.service({
      lock: true,
      text: 'Nossos serviços encontram-se em manutenção diária no momento.\nRetorne entre às 7h30 e 23h.',
      background: 'rgba(0, 0, 0, 0.85)',
      customClass: 'el-loading-mask--offline'
    })
    let newDate = new Date()
    let timeLeft = newDate.getTime() - new Date(newDate.getFullYear(), newDate.getMonth(), currentHour >= 23 ? newDate.getDay() + 1 : newDate.getDay(), 7, 30)
    setTimeout(function () {
      loading.close()
    }, timeLeft)
  }
  return systemShouldBeUp
}

export default showLoading
