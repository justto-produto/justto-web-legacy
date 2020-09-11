const getters = {
  availableSigners: state => state.availableSigners,
  selectedSigners: state => [...state.selectedSigners, ...state.availableSigners],
}

export default getters
