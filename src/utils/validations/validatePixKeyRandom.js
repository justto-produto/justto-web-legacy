const validatePixKeyRandom = (rule, value, callback) => {
  const key = (value || '').replaceAll(/[^a-z0-9]/gi, '')

  if ((key && key.length === 32) || rule?.required === false) {
    callback()
  } else callback(new Error(rule?.message))

  callback(new Error(rule?.message))
}

export default validatePixKeyRandom
