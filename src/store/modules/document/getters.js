const documentGetters = {
  availableSigners: state => state.availableSigners,
  selectedSigners: state => [...state.selectedSigners],
  getStoredDrafts: state => state.storedDrafts,
  getStoredDraftsIds: state => Object.values(state.storedDrafts).map(({ id, disputeId }) => (id || disputeId)),
  getOpenDraftId: state => state.openDraftId
}

export default documentGetters
