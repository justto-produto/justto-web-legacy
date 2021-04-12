const validateNameWithoutEmail = (rule, value, callback) => {
  const haveDot = value.includes('.')
  const haveAt = value.includes('@')
  const haveComma = value.includes('-')

  if (value && value.length > 2 && !haveAt && !haveDot && !haveComma) {
    callback()
  } else if (haveDot) {
    callback(new Error('Insira um nome sem abreviações'))
  } else {
    callback(new Error('Insira um nome válido'))
  }
}

export default validateNameWithoutEmail
