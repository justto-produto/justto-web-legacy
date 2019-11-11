import Vue from 'vue'

Vue.filter('phoneMask', function (value) {
  if (!value) return ''
  if (!/^\d+$/.test(value)) return value
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
