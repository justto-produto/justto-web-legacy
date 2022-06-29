import Vue from 'vue'
import listTj from '@/constants/listTJ'
import { Validate } from 'validate-cnj'

const validateTJbyCode = (tjCode) => {
  const replaced = tjCode.trim().replace(/[.-]/g, '')

  if (replaced.length >= 16) {
    const subcode = replaced.substring(13, 16)

    return listTj.find(({ code }) => String(code) === String(subcode))?.name || false
  } else {
    return false
  }
}

const findTJbyCode = (tjCode) => {
  if (validateTJbyCode(tjCode)) {
    return validateTJbyCode(tjCode)
  }

  try {
    const { justice, number } = Validate.load(tjCode)
    const subcode = `${justice}${number}`

    return listTj.find(({ code }) => String(code) === String(subcode))?.name || 'Número CNJ inválido.'
  } catch (error) {
    return 'Número CNJ inválido.'
  }
}

Vue.filter('findTJbyCode', findTJbyCode)

Vue.filter('validateTJbyCode', validateTJbyCode)
