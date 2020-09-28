import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
import 'moment/locale/pt-br'

moment.tz.setDefault('America/Sao_Paulo')

Vue.use(VueMoment, { moment })
