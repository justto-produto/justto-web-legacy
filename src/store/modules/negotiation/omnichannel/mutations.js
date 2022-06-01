import Vue from 'vue'
import moment from 'moment'

import { eventBus, getFormatedDate } from '@/utils'

import EDITOR_TABS from '@/constants/editor'
import { StateOccurrences } from '@/store/modules/negotiation/omnichannel/state'

export default {
  setOmnichannelActiveTab: (state, tab) => {
    if (Object.values(EDITOR_TABS).includes(tab)) {
      Vue.set(state, 'activeTab', tab)
    }
  },

  setEditorText: (state, text) => Vue.set(state.editor, 'messageText', text),

  setNoteEditorText: (state, text) => Vue.set(state.editor, 'noteText', text),

  setMessageType: (state, type) => Vue.set(state.editor, 'messageType', type),

  setOccurrences: (state, { content, totalElements, first, number }) => {
    if (first) {
      Vue.set(state.occurrences, 'list', [])
    }

    const datas = state.occurrences.list.map((occurrence, index) => {
      if (occurrence.id === null) {
        return {
          index,
          date: getFormatedDate(occurrence),
          renderCompleted: occurrence.renderCompleted || false
        }
      }
      return false
    }).filter(el => el !== false)

    const toInsert = content.map(occurrence => {
      const exists = state.occurrences.list.filter(({ createAt, id }, index) => {
        return occurrence.id === id && occurrence.createAt.dateTime === createAt.dateTime
      }).length === 0

      if (!exists) {
        return false
      } else {
        const data = datas.find(data => data.date === getFormatedDate(occurrence))
        return {
          occurrence,
          index: data !== undefined ? data.index : -1
        }
      }
    }).filter(el => el !== false)

    toInsert.reverse().forEach(({ occurrence, index }) => {
      state.occurrences.list.splice(index + 1, 0, occurrence)
    })

    Vue.set(state.occurrences.filter, 'page', number + 2)
    Vue.set(state.occurrences, 'totalElements', totalElements)
    Vue.set(state, 'totalOfOccurrences', totalElements)
  },

  incrementOccurrencesCountGetters: (state) => (state.countOmnichannelGetters += 1),

  decrementOccurrencesCountGetters: (state) => {
    if (state.countOmnichannelGetters > 0) {
      state.countOmnichannelGetters -= 1
    }
  },

  resetOccurrences: (state) => {
    Vue.set(state, 'occurrences', new StateOccurrences())
  },

  addNegotiationOccurrence: (state, occurrence) => {
    const date = getFormatedDate(occurrence, 'DD/MM/YYYY')
    const dates = state.occurrences.list.filter(item => !item.id).map(item => getFormatedDate(item, 'DD/MM/YYYY'))

    let canInclude = false

    const { activeTab: tab } = state
    const oType = occurrence.type
    const iType = occurrence.interaction?.type
    const isLog = occurrence.type === 'LOG'

    const validationInteractions = {
      MESSAGES: [
        'NPS',
        'PHONE_CALL',
        'ATTACHMENT',
        'COMMUNICATION',
        'MANUAL_PROPOSAL',
        'NEGOTIATOR_ACCESS',
        'NEGOTIATOR_PROPOSAL',
        'NEGOTIATOR_CHECKOUT',
        'NEGOTIATOR_ACCEPTED',
        'MANUAL_COUNTERPROPOSAL',
        'NEGOTIATOR_COUNTERPROSAL'
      ],
      NOTES: null,
      OCCURRENCES: [
        'CLICK',
        'ATTACHMENT',
        'PHONE_CALL',
        'VISUALIZATION',
        'COMMUNICATION',
        'MANUAL_PROPOSAL',
        'NEGOTIATOR_ACCESS',
        'NEGOTIATOR_PROPOSAL',
        'NEGOTIATOR_CHECKOUT',
        'NEGOTIATOR_ACCEPTED',
        'MANUAL_COUNTERPROPOSAL',
        'NEGOTIATOR_COUNTERPROSAL'
      ]
    }

    if (tab === 'MESSAGES' && oType === 'INTERACTION' && validationInteractions[tab].includes(iType)) {
      canInclude = true
    } else if (tab === 'NOTES' && oType === 'NOTE') {
      canInclude = true
    } else if (tab === 'OCCURRENCES' && oType !== 'NOTE' && (validationInteractions[tab].includes(iType) || isLog)) {
      canInclude = true
    }

    if (canInclude) {
      const tempOccurrence = state.occurrences.list.find(({ id }) => (id === occurrence.id))

      canInclude = tempOccurrence === undefined
    }

    if (canInclude) {
      if (!dates.includes(date)) {
        const nextIndex = state.occurrences.list.length
        Vue.set(state.occurrences.list, nextIndex, { id: null, createAt: occurrence.createAt })
      }

      const nextIndex = state.occurrences.list.length
      Vue.set(state.occurrences.list, nextIndex, occurrence)

      // TODO: Procurar uma solução melhor.
      eventBus.$emit('NEGOTIATION_WEBSOCKET_NEW_OCCURRENCE', {})
    } else {
      const occurrenceIndex = state.occurrences.list.findIndex(({ id }) => (id === occurrence?.id))

      if (occurrenceIndex >= 0) Vue.set(state.occurrences.list, occurrenceIndex, occurrence)
    }
  },

  setUpOccurrencesSize: (state) => (state.occurrences.filter.page += 1),

  addSumary: (state, { payload, data }) => {
    const { occurrenceId, type } = payload
    const content = data.content.filter(({ id }) => Boolean(id))
    Vue.set(state.occurrences.summary[type], occurrenceId, content)
  },

  cleanSumary: (state, { type, occurrenceId }) => Vue.delete(state.occurrences.summary[type], occurrenceId),

  addFullMessage: (state, { id, content }) => Vue.set(state.occurrences.fullMessages, id, content),

  addRecentMessage: (state, message) => {
    const index = state.editor.recentMessages.length
    Vue.set(state.editor.recentMessages, index, message)
  },

  cleanRecentMessages: state => Vue.set(state.editor, 'recentMessages', []),

  removeFullMessage: (state, id) => Vue.delete(state.occurrences.fullMessages, id),

  setRecipients: (state, recipient) => {
    const { recipients } = state.editor
    const has = recipients.filter(({ value }) => value === recipient.value).length > 0

    if (has) {
      Vue.set(state.editor, 'recipients', recipients.filter(el => el.value !== recipient.value))
    } else {
      Vue.set(state.editor, 'recipients', [...recipients, recipient])
    }
  },

  removeRecipient: (state, value) => {
    const items = state.editor.recipients.filter(el => !(el.value === value))
    Vue.set(state.editor, 'recipients', items)
  },

  removeTicketNote: (state, { payload: { id } }) => {
    Vue.set(state.occurrences, 'list', state.occurrences.list.filter(note => Number(note.id) !== Number(id)))

    if (!state.occurrences.list[state.occurrences.list.length - 1].id) {
      Vue.delete(state.occurrences.list, state.occurrences.list.length - 1)
    }
  },

  resetRecipients: (state) => Vue.set(state.editor, 'recipients', []),

  setMessageAttachments: (state, attachs) => Vue.set(state.editor, 'attachments', attachs),

  toggleExportTicketModalVisible: (state, visible) => Vue.set(state, 'exportTicketModalVisible', visible),

  updateNpsReply: (state, { payload: { occurrenceId, data: { response } } }) => {
    const occurrence = state.occurrences.list.find(({ id }) => Number(id) === Number(occurrenceId))
    if (occurrence) {
      Vue.set(occurrence.interaction.properties, 'NPS_REPLY_DATE', moment().format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]'))
      Vue.set(occurrence.interaction.properties, 'NPS_REPLY', response)
    }
  },

  setDisputeProtocol: (state, data) => {
    Vue.set(state, 'disputeProtocol', data)
  },

  setGroupedOccurrencesById: (state, { data: occurrences, payload: id }) => {
    Vue.set(state.groupedOccurrences, id, occurrences)
    console.log(state.groupedOccurrences)
  },

  deleteGroupedOccurrencesById: (state, id) => {
    Vue.delete(state.groupedOccurrences, id)
    console.log(state.groupedOccurrences)
  }
}
