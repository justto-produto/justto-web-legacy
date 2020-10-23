const documentGetters = {
  availableSigners: state => state.availableSigners,
  selectedSigners: state => [...state.selectedSigners]
}

export default documentGetters
