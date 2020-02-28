import Vue from 'vue'

Vue.filter('highlight', function (words, query) {
  var iQuery = new RegExp(query, 'ig')
  return words.toString().replace(iQuery, function (matchedTxt, a, b) {
    return ('<span class="highlight">' + matchedTxt + '</span>')
  })
})
