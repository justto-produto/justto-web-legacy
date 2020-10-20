import * as cpf from '@fnando/cpf'
import * as cnpj from '@fnando/cnpj'

const validateDocument = (rule, value, callback) => {
  if (!value || !Object.keys(value).length) {
    callback()
    return 0
  }
  if (value instanceof Object) {
    value = value[Object.keys(value)[0]]
  }
  if (value.length === 14) {
    if (cpf.isValid(value)) {
      callback()
    } else callback(new Error())
  } else {
    if (cnpj.isValid(value)) {
      callback()
    } else callback(new Error())
  }
}

export default validateDocument
