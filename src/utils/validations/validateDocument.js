import * as cpf from '@fnando/cpf'
import * as cnpj from '@fnando/cnpj'

const validateDocument = (rule, value, callback) => {
  if (!value || !Object.keys(value).length || rule?.required === false) {
    callback()
    return 0
  }

  if (value instanceof Object) {
    value = value[Object.keys(value)[0]]
  }

  const validator = value.length <= 14 ? cpf.isValid : cnpj.isValid

  validator(value) ? callback() : callback(new Error(rule?.message || ''))
}

export default validateDocument
