import { SignerModel } from '../../../models/document/Signer.model'
// import Vue from 'vue'

const mutations = {
  createFromDisputeRole(state, disputeRole) {
    state.availableSigners.push(new SignerModel(disputeRole.documentNumber, disputeRole.name, disputeRole.emails.map(e => e.address)))
  },
  createFromDefaultSigners(state, defaulSigners) {
    state.availableSigners = defaulSigners.map(signer => new SignerModel(signer))
  },
  setSelectedSigners(state, signers) {
    state.selectedSigners = signers.map(signer => new SignerModel(signer))
  },
}

export default mutations
