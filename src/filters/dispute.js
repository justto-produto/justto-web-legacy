import Vue from 'vue'

Vue.filter('getLastValue', function (value) {
  if (!value) return null
  return value.slice(-1).pop().value
})
