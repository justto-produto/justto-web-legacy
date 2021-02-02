import Vue from 'vue'

const actionsMutations = {
  setOutcomeReasons: ({ outcomeReasons }, { data, payload }) => {
    Vue.set(outcomeReasons, payload, data)
    // outcomeReasons[payload] = data
  }
}

export default actionsMutations
