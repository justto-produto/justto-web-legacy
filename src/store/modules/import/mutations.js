const importMutations = {
  setImportsFile: (state, file) => (state.file = file),
  removeImportsFile(state) {
    state.file = undefined
    state.map = []
  },
  setImportsMap: (state, map) => (state.map = map),
  removeImportsMap: (state, map) => (state.map = []),
  setErrorFields: (state, fields) => (state.errorFields = fields),
  clearErrorField: (state, filed) => (state.errorFields = state.errorFields.filter(errorField => errorField !== filed)),
  validationInProgress: (state, value) => (state.validationInProgress = value)
}

export default importMutations
