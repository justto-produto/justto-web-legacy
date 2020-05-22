const editDistance = function(s1, s2) {
  var costs = []
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i
    for (var j = 0; j <= s2.length; j++) {
      if (i === 0) costs[j] = j
      else {
        if (j > 0) {
          var newValue = costs[j - 1]
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1
          }
          costs[j - 1] = lastValue
          lastValue = newValue
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue
  }
  return costs[s2.length]
}

const similarity = function(s1, s2) {
  let longer = s1
  let shorter = s2
  if (s1.length < s2.length) {
    longer = s2
    shorter = s1
  }
  let longerLength = longer.length
  if (longerLength === 0) return 1.0
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
}

const checkSimilarity = function(compare1, compare2, percentage) {
  if (!compare1 || !compare2) return false
  if (Array.isArray(compare2)) {
    for (var c2 of compare2) {
      if ((Math.round(similarity(compare1, c2) * 10000) / 100) >= percentage) return true
    }
  } else if (typeof compare2 === 'string' || compare2 instanceof String) {
    if ((Math.round(similarity(compare1, compare2) * 10000) / 100) >= percentage) return true
  }
  return false
}

export default checkSimilarity
