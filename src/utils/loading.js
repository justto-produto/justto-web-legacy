import { Loading } from 'element-ui'

const showLoading = function () {
  let currentHour = new Date().getHours()
  let currentMinuts = new Date().getMinutes()
  let systemShouldBeUp = currentHour < 23 && (currentHour >= 8 || (currentHour === 7 && currentMinuts >= 30))
  if (!systemShouldBeUp) {
    const loading = Loading.service({
      lock: true,
      text: 'Ops, nosso serviço se encontra indisponivel no momento. Por favor volte entre 7:30 e 23h',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    let newDate = new Date()
    let timeLeft = newDate.getTime() - new Date(newDate.getFullYear(), newDate.getMonth(), currentHour >= 23 ? newDate.getDay() + 1 : newDate.getDay(), 7, 30)
    setTimeout(function () {
      loading.close()
    }, timeLeft)
  }
}

export default showLoading
