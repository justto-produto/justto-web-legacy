import Vue from 'vue'

const actionsMutations = {
  setOutcomeReasons: (state, { data, payload }) => {
    Vue.set(state.outcomeReasons, payload, data)
  },

  setDropLawsuitReasons: (state, data) => {
    Vue.set(state, 'dropLawsuitReasons', data)
  },

  changeThamirisAlertsVisibility: (state, data) => {
    if (data.data) {
      if (data.flag) {
        Vue.set(state, 'thamirisAlertVisible', true)
      }
    }
    debugger
    if (data.payload) {
      Vue.set(state, 'thamirisAlertVisible', data.payload.flag)
    }
    // else {
    //
    // }
  }
}

export default actionsMutations
