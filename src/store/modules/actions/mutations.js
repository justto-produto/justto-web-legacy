import Vue from 'vue'

const actionsMutations = {
  setOutcomeReasons: ({ outcomeReasons }, { data, payload }) => {
    Vue.set(outcomeReasons, payload, data)
  },

  // MUTATION PARA PEGAR AS REASONS
  setDropLawsuitReasons: ({ dropLawsuitReasons }, { data, payload }) => {
    Vue.set(dropLawsuitReasons, payload, data)
  }
}

export default actionsMutations
