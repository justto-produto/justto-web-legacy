const getStringInitials = (str) => {
  const stringSplited = str.trim().split(' ').filter(Boolean)

  if (stringSplited.length > 1) {
    return stringSplited[0].substring(0, 1) + stringSplited[stringSplited.length - 1].substring(0, 1)
  } else if (stringSplited.length === 1) {
    return str.substring(0, 2)
  } else {
    return ''
  }
}

export default getStringInitials
