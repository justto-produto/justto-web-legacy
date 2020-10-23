const validatePhone = (rule, value, callback) => {
  if ((value && value.length > 13) || !value) {
    callback()
  } else callback(new Error())
}

export default validatePhone
