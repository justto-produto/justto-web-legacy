import Vue from 'vue'
import Element from 'element-ui'
import '@/styles/variables.scss'
import 'element-ui/lib/theme-chalk/display.css'
import i18n from '@/plugins/vueI18n'

Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value),
})
