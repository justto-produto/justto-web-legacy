import CPFCNPJ from 'cpf_cnpj'

const validateZero = (rule, value, callback) => {
  if (value && value >= 0) {
    callback()
  } else {
    callback(new Error())
  }
}

const validateName = (rule, value, callback) => {
  const validName = /^[^!@#$%&*(){}[\]/|\\_<>?¢£¬§=+]+$/g
  if (value && value.length > 2 && value.match(validName)) {
    callback()
  } else {
    callback(new Error())
  }
}

const validateCpf = (rule, value, callback) => {
  if (!value || !Object.keys(value).length) {
    callback()
    return 0
  }
  if (value instanceof Object) {
    value = value[Object.keys(value)[0]]
  }
  if (value.length === 14) {
    if (CPFCNPJ.CPF.isValid(value)) {
      callback()
    } else callback(new Error())
  } else {
    if (CPFCNPJ.CNPJ.isValid(value)) {
      callback()
    } else callback(new Error())
  }
}

const validatePhone = (rule, value, callback) => {
  if ((value && value.length > 13) || !value) {
    callback()
  } else callback(new Error())
}

const validateSubdomainName = (rule, value, callback) => {
  if (value.length < 3) {
    callback(new Error('Necessário ao menos 3 caracteres.'))
  }
  if (/[^a-z0-9]/g.test(value)) {
    this.isValid = false
    callback(new Error('Formato inválido'))
  } else {
    this.isValid = true
    callback()
  }
}

const validateSubdomainAvailability = (rule, value, callback) => {
  if (value.length >= 3) {
    this.$store.dispatch('verifyAvailability', value)
      .then(available => {
        if (available) {
          this.isAvailable = true
          callback()
        } else {
          this.isAvailable = false
          callback(new Error(' '))
        }
      })
      .catch(error => {
        callback(error)
      })
  } else {
    this.isValid = false
  }
}

const validateObjectEmail = (rule, value, callback) => {
  const email = value[Object.keys(value)[0]]
  if (email) {
    const re = /\S+@\S+\.\S+/
    if (re.test(email)) {
      callback()
    } else {
      callback(new Error('Insira um e-mail válido'))
    }
  } else {
    callback(new Error('Campo obrigatório'))
  }
}

export {
  validateZero,
  validateName,
  validateCpf,
  validatePhone,
  validateSubdomainName,
  validateSubdomainAvailability,
  validateObjectEmail
}
