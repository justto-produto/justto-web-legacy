import Vue from 'vue'
import money from 'v-money'

Vue.use(money, {
  decimal: ',',
  thousands: '.',
  prefix: 'R$ ',
  precision: 2
})
