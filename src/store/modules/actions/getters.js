const actionsGetters = {
  getOutcomeReasons: ({ outcomeReasons }) => outcomeReasons,
  getDropLawsuitReasons: ({ dropLawsuitReasons }) => dropLawsuitReasons,
  getDropLawsuitReasonsArray: ({ dropLawsuitReasons = {} }) => Object.entries(dropLawsuitReasons || {}).reduce((acc, item) => {
    const temp = {}
    temp[item[0]] = item[1]
    return [...acc, temp]
  }, []).sort((a, b) => {
    return Object.values(a)[0][0] > Object.values(b)[0][0] ? 1 : -1
  })
}

export default actionsGetters
