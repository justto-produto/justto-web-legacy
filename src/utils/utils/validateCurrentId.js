export default (disputeId, callback) => {
  const idIndex = location.href.split('/').length - 1

  const routeId = location.href.split('/')[idIndex]

  return Number(disputeId) === Number(routeId) ? callback() : new Promise((resolve) => {
    window.analytics.track('Id da disputa diferente da rota', { routeId, disputeId }, () => {
      console.error(`Dispute id(${disputeId}) diferênte do que está na rota(${routeId})`)
      console.table({ disputeId, routeId })
      resolve()
    })
  })
}
