const editDistance = function (s1, s2) {
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

const similarity = function (s1, s2) {
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

const checkMessage = function (newMessageTrim, recentMessages) {
  for (let i = 0; i < recentMessages.length; i++) {
    let actuallyMessage = recentMessages[i].messageBody
    if ((Math.round(similarity(newMessageTrim, actuallyMessage) * 10000) / 100) >= 75) return true
  }
}

export {
  checkMessage
}
