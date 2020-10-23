const validateName = (rule, value, callback) => {
  const validName = /^[^!@#$%&*(){}[\]/|\\_<>?¢£¬§=+]+$/g

  if (value && value.length > 2 && value.match(validName)) {
    callback()
  } else {
    callback(new Error())
  }
}

export default validateName
