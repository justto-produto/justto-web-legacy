const importGetters = {
  importedFileName: state => state.file ? state.file.file_name : null,
  hasImportsFile: state => {
    return state.file !== undefined
  },
  errorFields: state => state.errorFields
}

export default importGetters
