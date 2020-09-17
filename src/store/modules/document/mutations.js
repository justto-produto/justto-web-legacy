import { SignerModel } from '../../../models/document/Signer.model'
// import Vue from 'vue'

const mutations = {
  createFromDisputeRole(state, disputeRole) {
    state.availableSigners.push(new SignerModel(disputeRole))
  },
  createFromDefaultSigners(state, defaulSigners) {
    state.availableSigners = defaulSigners.map(signer => new SignerModel(signer))
  },
  setSelectedSigners(state, signers) {
    console.log(signers)
    state.selectedSigners = signers.map(signer => new SignerModel({ ...signer, defaultSigner: signer.party !== 'CLAIMANT' }))
  },
}

export default mutations
