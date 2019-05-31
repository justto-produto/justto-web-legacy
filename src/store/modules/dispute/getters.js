const disputeGetters = {
  filteredDisputes: state => {
    let filteredDisputes = state.disputes.slice(0)
    if (state.filters) {
      switch (state.filters.tab) {
        case '0':
          filteredDisputes = filteredDisputes.filter(dispute => {
            return dispute.disputestatus === 'ENGAGEMENT' && !dispute.disputehasinteractions
          })
          break
        case '1':
          filteredDisputes = filteredDisputes.filter(dispute => {
            return dispute.disputestatus === 'ENGAGEMENT' && dispute.disputehasinteractions
          })
          break
        case '2':
          filteredDisputes = filteredDisputes.filter(dispute => {
            return dispute.disputestatus === 'ACCEPTED' || dispute.disputestatus === 'CHECKOUT'
          })
          break
      }
    }
    return filteredDisputes
  }
}

export default disputeGetters
