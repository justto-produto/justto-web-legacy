const isTokenExpired = (token) => {
  // Obtém o payload do token
  const parts = token.split('.')
  const payload = JSON.parse(atob(parts[1]))

  // Obtém o tempo de expiração do token
  const expiresAt = new Date(payload.exp * 1000)

  // Verifica se o token já expirou
  return new Date() > expiresAt
}

export default { isTokenExpired }
