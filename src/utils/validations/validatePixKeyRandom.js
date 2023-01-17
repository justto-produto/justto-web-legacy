const validatePixKeyRandom = (rule, value, callback) => {
  console.log({ rule, value })
  // if ((value && value.length > 13) || !value) {
  //   callback()
  // } else callback(new Error())
  callback()
}

export default validatePixKeyRandom
