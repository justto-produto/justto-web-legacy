import Vue from 'vue'

Vue.filter('money', function (value) {
  let money = '0.00'
  if (value) {
    money = parseFloat(value)
    money = money.toFixed(2)
  }
  return 'R$ ' + money.replace('.', ',')
})
