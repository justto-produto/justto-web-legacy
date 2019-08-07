const getClaimants = function (disputeRoles, showFirstOnly, role) {
  let claimants = disputeRoles.filter(disputeRole => {
    return disputeRole.party === 'CLAIMANT' && disputeRole.roles.includes(role)
  })
  if (showFirstOnly) {
    if (claimants.length === 0) {
      return ''
    } else if (claimants.length === 1) {
      return claimants[0].name
    } else {
      return claimants[0].name + ' (+ ' + (claimants.length - 1) + ')'
    }
  }
  return claimants
}

export { getClaimants }
