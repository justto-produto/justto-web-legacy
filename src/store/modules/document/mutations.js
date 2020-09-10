import { SignerModel } from '../../../models/document/Signer.model'
// import Vue from 'vue'

const mutations = {
  createFromDisputeRole(state, disputeRole) {
    state.availableSigners.push(new SignerModel(disputeRole.documentNumber, disputeRole.name, disputeRole.emails.map(e => e.address)))
  },
  createFromDefaultSigners(state, defaulSigner) {
    state.availableSigners.push(new SignerModel(defaulSigner.documentNumber, defaulSigner.name, [defaulSigner.email]))
  },
}

export default mutations
