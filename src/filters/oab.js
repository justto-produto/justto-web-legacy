import Vue from 'vue'

Vue.filter('oab', function(value) {
  if (!value) return ''
  const template = 'A.B/C'
  value = value.replace(/[-/.] /, '')

  if (value.length === 7) {
    return template
      .replace('A', value.substr(0, 2))
      .replace('B', value.substr(2, 3))
      .replace('C', value.substr(5, 2))
  }
  if (value.length === 8) {
    return template
      .replace('A', value.substr(0, 3))
      .replace('B', value.substr(3, 3))
      .replace('C', value.substr(6, 2))
  }
  return template.toUpperCase()
})
