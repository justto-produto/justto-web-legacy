import Vue from 'vue'

Vue.filter('firstName', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.split(' ')[0]
})
