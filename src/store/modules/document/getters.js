const getters = {
  availableSigners: state => state.availableSigners,
  selectedSigners: state => [...state.selectedSigners],
}

export default getters
