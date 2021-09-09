import Vue from 'vue'

Vue.filter('capitalize', function(value) {
  if (!value) return ''
  value = value.toString().toLowerCase()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('uppercase', function(value) {
  return !value ? '' : value.toString().toUpperCase()
})
