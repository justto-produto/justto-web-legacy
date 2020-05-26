import Vue from 'vue'

Vue.filter('firstName', function(value) {
  if (!value) return ''
  value = value.toString().toLowerCase()
  if (value.includes('@')) value = value.split('@')[0]
  else if (value.startsWith('sr') || value.startsWith('dr')) value = value.split(' ')[1] || value
  else value = value.split(' ')[0]
  return value.charAt(0).toUpperCase() + value.slice(1)
})
