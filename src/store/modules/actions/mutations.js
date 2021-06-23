import Vue from 'vue'

const actionsMutations = {
  setOutcomeReasons: (state, { data, payload }) => {
    Vue.set(state.outcomeReasons, payload, data)
  },

  setDropLawsuitReasons: (state, data) => {
    Vue.set(state, 'dropLawsuitReasons', data)
  }
}

export default actionsMutations
