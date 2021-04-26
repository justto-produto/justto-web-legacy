import Vue from 'vue'

import listTj from '@/constants/listTJ'

Vue.filter('findTJbyCode', (tjCode) => {
  const replaced = tjCode.trim().replace(/[.]/g, '').replace(/[-]/g, '')

  if (replaced.length >= 16) {
    const subcode = replaced.substring(13, 16)

    return listTj.find(({ code }) => String(code) === String(subcode)).name || 'TJ Não encontrado.'
  } else {
    return 'Número inválido'
  }
})
