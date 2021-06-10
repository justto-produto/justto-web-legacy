const importGetters = {
  importedFileName: state => state.file ? state.file.file_name : null,
  validationInProgress: state => state.validationInProgress,
  hasImportsFile: state => {
    return state.file !== undefined
  },
  errorFields: state => state.errorFields
}

export default importGetters
