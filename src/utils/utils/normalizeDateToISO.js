import moment from 'moment'

export default (stringDate) => {
  const [date, time] = stringDate.split(' ')

  const [day, month, year] = date.split('/')
  const [hour, minute, seconds] = time.split(':')

  return moment(`${year}-${month}-${day}T${hour}:${minute}:${seconds}.000Z`)
}
