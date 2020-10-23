const validateZero = (rule, value, callback) => {
  if (value && value >= 0) {
    callback()
  } else {
    callback(new Error())
  }
}

export default validateZero
