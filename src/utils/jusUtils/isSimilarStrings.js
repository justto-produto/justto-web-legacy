const editDistance = (str1, str2) => {
  const costs = []

  for (let i = 0; i <= str1.length; i++) {
    let lastValue = i
    for (let j = 0; j <= str2.length; j++) {
      if (i === 0) {
        costs[j] = j
      } else {
        if (j > 0) {
          let newValue = costs[j - 1]
          if (str1.charAt(i - 1) !== str2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
          }
          costs[j - 1] = lastValue
          lastValue = newValue
        }
      }
    }
    if (i > 0) costs[str2.length] = lastValue
  }

  return costs[str2.length]
}

const getDistance = (str1, str2) => {
  let longer
  let shorter

  if (str1.length > str2.length) {
    longer = str1
    shorter = str2
  } else {
    longer = str2
    shorter = str1
  }

  const longerLength = longer.length
  if (longerLength === 0) return 1.0
  else return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
}

const isSimilarStrings = (val1, val2, percentage) => {
  if (!val1 || !val2) return false
  if (Array.isArray(val2)) {
    for (const i of val2) {
      if ((Math.round(getDistance(val1, i) * 10000) / 100) >= percentage) return true
    }
  } else if (typeof val2 === 'string' || val2 instanceof String) {
    if ((Math.round(getDistance(val1, val2) * 10000) / 100) >= percentage) return true
  } else {
    return false
  }
}

export default isSimilarStrings
