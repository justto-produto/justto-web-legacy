import Vue from 'vue'

Vue.filter('phoneMask', function (value) {
  if (!value) return ''
  let template1 = '(B) C-D'
  let template2 = '+A (B) C-D'
  if (value.length === 10) {
    return template1
      .replace('B', value.substr(0, 2))
      .replace('C', value.substr(2, 4))
      .replace('D', value.substr(6, 4))
  }
  if (value.length === 11) {
    return template1
      .replace('B', value.substr(0, 2))
      .replace('C', value.substr(2, 5))
      .replace('D', value.substr(7, 4))
  }
  if (value.length === 12) {
    return template2
      .replace('A', value.substr(0, 2))
      .replace('B', value.substr(2, 2))
      .replace('C', value.substr(4, 4))
      .replace('D', value.substr(8, 4))
  }
  if (value.length === 13) {
    return template2
      .replace('A', value.substr(0, 2))
      .replace('B', value.substr(2, 2))
      .replace('C', value.substr(4, 5))
      .replace('D', value.substr(9, 4))
  }
  return value
})

Vue.filter('cpfMask', function (value) {
  if (!value) return ''
  value = value.toString()
  if (value.length === 11) {
    return value.slice(0, 3) + '.' + value.slice(3, 6) + '.' + value.slice(6, 9) + '-' + value.slice(9, 11)
  } else if (value.length === 14) {
    return value.slice(0, 2) + '.' + value.slice(2, 5) + '.' + value.slice(5, 8) + '/' + value.slice(8, 12) + '-' + value.slice(12, 14)
  }
  return value
})
