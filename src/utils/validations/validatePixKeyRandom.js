const validatePixKeyRandom = (rule, value, callback) => {
  console.log('validatePixKeyRandom', { rule, value })

  // TODO: Implementar validação.

  // TODO: Remover '-' de .value;
  // TODO: Verificar se o tamanho de .value é 32

  // if ((value && value.length > 13) || !value) {
  //   callback()
  // } else callback(new Error())

  callback(new Error())
}

export default validatePixKeyRandom
