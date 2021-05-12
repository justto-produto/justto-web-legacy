import Vue from 'vue'

Vue.filter('number', (value, options = {}) => {
  return Intl.NumberFormat('pt-br', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  }).format(Number(value))
})
