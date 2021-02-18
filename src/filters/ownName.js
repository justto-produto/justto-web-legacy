import Vue from 'vue'

Vue.filter('ownName', function(value) {
  if (!value) return ''
  value = value.toString().toLowerCase()
  value = value.split(' ')
  value = value.map(v => v.charAt(0).toUpperCase() + v.slice(1))
  return value.join(' ')
})
