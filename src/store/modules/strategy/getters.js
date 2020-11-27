const strategyGetters = {
  strategyList: state => {
    return (state.list || []).sort((a, b) => {
      if (a.name < b.name) { return -1 }
      if (a.name > b.name) { return 1 }
      return 0
    })
  }
}

export default strategyGetters
