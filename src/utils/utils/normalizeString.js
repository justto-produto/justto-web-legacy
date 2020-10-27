const normalizeString = (str) => {
  return str ? str.toString().trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') : ''
}

export default normalizeString
