import Vue from 'vue'

const capitalize = (value) => {
  if (!value) return ''
  value = value.toString().toLowerCase()
  return value.charAt(0).toUpperCase() + value.slice(1)
}

const uppercase = (value) => {
  return !value ? '' : value.toString().toUpperCase()
}

Vue.filter('capitalize', capitalize)

Vue.filter('uppercase', uppercase)

export { capitalize, uppercase }
