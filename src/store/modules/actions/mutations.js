import Vue from 'vue'

const actionsMutations = {
  setOutcomeReasons: (state, { data, payload }) => {
    Vue.set(state, payload, data)
  },

  setDropLawsuitReasons: (state, data) => {
    Vue.set(state, 'dropLawsuitReasons', data)
  }
}

export default actionsMutations
