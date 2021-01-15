import Vue from 'vue'

Vue.filter('resumedName', function(value) {
  if (!value) return ''
  value = value.toString().trim()
  const splitedValue = value.split(' ')
  const splitedValueLenght = splitedValue.length

  function capitalize(val) {
    return val.charAt(0).toUpperCase() + val.toLowerCase().slice(1)
  }

  if (splitedValueLenght > 1) {
    return `${capitalize(splitedValue[0])} ${capitalize(splitedValue[splitedValueLenght - 1])}`
  } return capitalize(value)
})
