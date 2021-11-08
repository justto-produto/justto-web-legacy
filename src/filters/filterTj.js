import Vue from 'vue'
import listTj from '@/constants/listTJ'
import { Validate } from 'validate-cnj'

Vue.filter('findTJbyCode', (tjCode) => {
  try {
    const { justice, number } = Validate.load(tjCode)
    const subcode = `${justice}${number}`

    return listTj.find(({ code }) => String(code) === String(subcode))?.name || 'Número CNJ inválido.'
  } catch (error) {
    return 'Número CNJ inválido'
  }

  // Refatorado na task SAAS-4616
  // const replaced = tjCode.trim().replace(/[.]/g, '').replace(/[-]/g, '')

  // if (replaced.length >= 16) {
  //   const subcode = replaced.substring(13, 16)
  //   console.log('findTJbyCode', subcode)

  //   return listTj.find(({ code }) => String(code) === String(subcode))?.name || 'Número CNJ inválido.'
  // } else {
  //   return 'Número CNJ inválido'
  // }
})
