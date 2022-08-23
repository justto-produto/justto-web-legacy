import { SignerModel } from '../../../models/document/Signer.model'
import Vue from 'vue'

const documentMutations = {
  createFromDisputeRole(state, disputeRole) {
    state.availableSigners.push(new SignerModel(disputeRole))
  },

  createFromDefaultSigners(state, defaulSigners) {
    state.availableSigners = defaulSigners.map(signer => new SignerModel(signer))
  },

  setSelectedSigners(state, signers) {
    state.selectedSigners = signers.map(signer => new SignerModel({ ...signer, defaultSigner: signer.party !== 'CLAIMANT' }))
  },

  setStoredDrafts(state, dispute) {
    Vue.set(state.storedDrafts, dispute?.id, dispute)
  },

  deleteStoredDrafts(state, id) {
    Vue.delete(state.storedDrafts, id)
  },

  setOpenDraftId(state, id) {
    Vue.set(state, 'openDraftId', id)
  }
}

export default documentMutations
