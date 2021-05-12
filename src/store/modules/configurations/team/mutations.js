import Vue from 'vue'

export default {
  setDisputeSumaryByNegotiator(state, { data, payload: { personId } }) {
    Vue.set(state.disputesByNegotiatorSumary, personId, data)
  }
}
