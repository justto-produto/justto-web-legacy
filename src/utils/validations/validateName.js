const validateName = (rule, value, callback) => {
  // const validName = /^[^!@#$%*&(){}[\]/|\\_<>?¢£¬§=+]+$/g
  // && value.match(validName)

  if (value && value.length > 2) {
    callback()
  } else {
    callback(new Error())
  }
}

export default validateName
