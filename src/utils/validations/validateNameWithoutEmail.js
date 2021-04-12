const validateNameWithoutEmail = (rule, value, callback) => {
  if (value && value.length > 2 && !value.includes('@') && !value.includes('.')) {
    callback()
  } else if (value.includes('@')) {
    callback(new Error('Insira um nome válido'))
  } else if (value.includes('.')) {
    callback(new Error('Insira um nome sem abreviações'))
  } else {
    callback(new Error('Insira um nome válido'))
  }
}

export default validateNameWithoutEmail
