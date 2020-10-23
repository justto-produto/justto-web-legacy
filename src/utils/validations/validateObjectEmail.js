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

export default validateObjectEmail
