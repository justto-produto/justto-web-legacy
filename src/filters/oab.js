import Vue from 'vue'

Vue.filter('oab', function(value) {
  if (!value) return ''
  let template = 'A.B/C'
  const oabValue = value.replace(/[-/.] /, '')

  if (oabValue.length === 7) {
    return template
      .replace('A', oabValue.substr(0, 2))
      .replace('B', oabValue.substr(2, 3))
      .replace('C', oabValue.substr(5, 2))
  }
  if (oabValue.length === 8) {
    return template
      .replace('A', oabValue.substr(0, 3))
      .replace('B', oabValue.substr(3, 3))
      .replace('C', oabValue.substr(6, 2))
  }
  if (![7, 8].includes(oabValue.length)) {
    template = value.replace('null', '')
  }

  return template.toUpperCase()
})
