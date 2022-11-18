export default {
  methods: {
    phoneMask(value = '') {
      console.log('phoneMask', value)

      const number = value?.replace(/[^\w*]/g, '').toUpperCase()

      switch (number.length) {
        case 8:
          return '####-####'
        case 9:
          return '#####-####'
        case 10:
          return '(##) ####-####'
        case 11:
          if (String(number[0]) === '0' && String(number[2]) === '0' && String(number[3]) === '0') return '#### ### ####'
          return '(##) #####-####'
        case 12:
          return '+## (##) ####-####'
        case 13:
          return '+## (##) #####-####'
        default:
          return '####-####-####-####'
      }
    }
  }
}
