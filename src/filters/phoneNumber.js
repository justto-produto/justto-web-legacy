import Vue from 'vue'

function formatNumber(value) {
  if (!value) return ''
  if (!/[+^\d]+$/.test(value)) return value
  const template1 = 'C-D'
  const template2 = '(B) C-D'
  const template3 = '+A (B) C-D'
  const template4 = 'B C D'

  if (value.length === 8) {
    return template1
      .replace('C', value.substr(0, 4))
      .replace('D', value.substr(5, 4))
  }
  if (value.length === 9) {
    return template1
      .replace('C', value.substr(0, 5))
      .replace('D', value.substr(6, 4))
  }
  if (value.length === 10) {
    return template2
      .replace('B', value.substr(0, 2))
      .replace('C', value.substr(2, 4))
      .replace('D', value.substr(6, 4))
  }

  if (value.length === 11) {
    if (`${value[0]}${value[2]}${value[3]}` === '000') {
      return template4
        .replace('B', value.substr(0, 4))
        .replace('C', value.substr(4, 3))
        .replace('D', value.substr(7, 4))
    }

    return template2
      .replace('B', value.substr(0, 2))
      .replace('C', value.substr(2, 5))
      .replace('D', value.substr(7, 4))
  }
  if (value.length === 12) {
    return template3
      .replace('A', value.substr(0, 2))
      .replace('B', value.substr(2, 2))
      .replace('C', value.substr(4, 4))
      .replace('D', value.substr(8, 4))
  }
  if (value.length === 13) {
    if (value[0] === '+') {
      return template3
        .replace('A', value.substr(1, 2))
        .replace('B', value.substr(3, 2))
        .replace('C', value.substr(5, 4))
        .replace('D', value.substr(9, 4))
    } else {
      return template3
        .replace('A', value.substr(0, 2))
        .replace('B', value.substr(2, 2))
        .replace('C', value.substr(4, 5))
        .replace('D', value.substr(9, 4))
    }
  }
  if (value.length === 14) {
    return template3
      .replace('A', value.substr(1, 2))
      .replace('B', value.substr(3, 2))
      .replace('C', value.substr(5, 5))
      .replace('D', value.substr(10, 4))
  }
  return value
}

Vue.filter('phoneOrEmail', (address) => {
  return address.includes('@') ? address : formatNumber(address)
})

Vue.filter('phoneNumber', formatNumber)
