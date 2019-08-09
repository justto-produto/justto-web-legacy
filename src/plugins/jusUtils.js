import Fuse from 'fuse.js'

const getRoles = function (disputeRoles, party, role) {
  let roles = disputeRoles.filter(disputeRole => {
    return disputeRole.party === party && disputeRole.roles.includes(role)
  })
  return roles
}

const getFirstRole = function (disputeRoles, party, role) {
  let roles = getRoles(disputeRoles, party, role)
  if (roles.length === 0) {
    return ''
  } else if (roles.length === 1) {
    return roles[0].name
  } else {
    return roles[0].name + ' (+ ' + (roles.length - 1) + ')'
  }
}

const fuseSearchDisputes = function (disputes, term) {
  const fuse = new Fuse(disputes, {
    shouldSort: true,
    tokenize: true,
    matchAllTokens: true,
    threshold: 0.1,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      'id',
      'code',
      'campaign.name',
      'disputeRoles.name',
      'disputeRoles.name',
      'disputeRoles.documentNumber',
      'disputeRoles.oabs.number',
      'campaign.strategy'
    ]
  })
  let list = fuse.search(term)
  return list
}

export { getRoles, getFirstRole, fuseSearchDisputes }
