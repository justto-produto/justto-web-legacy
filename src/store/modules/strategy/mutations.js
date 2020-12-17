import Vue from 'vue'

const strategyMutations = {
  setImportedStrategies(state, response) {
    state.list = response.content || response
  },
  setImportedStrategiesLite(state, response) {
    state.importationList = response.content || response
  },
  setStrategyCommunication(state, { data, payload }) {
    state.importationList.forEach((item, index) => {
      if (item.id === payload.strategyId) {
        Vue.set(state.importationList, index, {
          ...item,
          communications: data
        })
      }
    })
  },

  setStrategyCommunicationTemplate(state, { data, payload }) {
    const { strategyId, comunicationId } = payload

    state.importationList.forEach((strategy, strategyIndex) => {
      if (strategy.id === strategyId) {
        strategy.communications.forEach((communication, communicationIndex) => {
          if (communication.id === comunicationId) {
            Vue.set(state.importationList[strategyIndex].communications, communicationIndex, {
              ...communication,
              template: data
            })
          }
        })
      }
    })
  }
}

export default strategyMutations
