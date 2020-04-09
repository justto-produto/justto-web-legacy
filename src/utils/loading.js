import { Loading } from 'element-ui'

const showLoading = function () {
  var text
  let currentHour = new Date().getHours()
  let currentMinuts = new Date().getMinutes()
  let systemShouldBeUp = currentHour < 23 && currentHour >= 8 && (currentHour === 7 && currentMinuts >= 30)
  if (systemShouldBeUp) {
    text = 'Ops, parece que tivemos uma instabilidade. Por favor aguarde alguns minutos.'
    setInterval(function () {
      loading.close()

    }, 15000)
  } else {
    text = 'Ops, nosso serviço se encontra indisponivel no momento. Por favor tente entre 7:30 e 23h'
    setTimeout(function () {
      let timeLeft = ((currentMinuts - 30) * 60000) + (((currentHour - 7) * 60) * 60000)

      loading.close()
    }, timeLeft)
  }
  const loading = Loading.service({
    lock: true,
    text: text,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}

export default showLoading
