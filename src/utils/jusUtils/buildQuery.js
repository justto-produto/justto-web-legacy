import moment from 'moment'

const buildQuery = (q, command, disputesLength, noSort) => {
  let query = '?'
  for (const [key, value] of Object.entries(q)) {
    if (['total'].includes(key)) continue
    if (!value && key !== 'onlyNotVisualized') continue
    if (Array.isArray(value)) {
      if (!value.length) continue
      if (['expirationDate', 'dealDate', 'importingDate'].includes(key)) {
        const startDate = moment(value[0]).startOf('day').utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]')
        const endDate = moment(value[1]).endOf('day').utc().format('YYYY-MM-DD[T]HH:mm:ss[Z]')
        query = `${query}${key}Start=${startDate}&${key}End=${endDate}&`
      } else {
        for (const v of value) {
          query = query + key + '=' + v + '&'
        }
      }
    } else if (noSort) {
      continue
    } else if (key === 'page') {
      query = query + key + '=' + ((command === 'update' ? 1 : value) - 1) + '&'
    } else if (key === 'size') {
      query = query + key + '=' + (command === 'update' ? disputesLength : value) + '&'
    } else {
      query = query + key + '=' + value + '&'
    }
  }
  return query
}

export default buildQuery
