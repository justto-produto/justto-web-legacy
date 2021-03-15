import Vue from 'vue'
import moment from 'moment'

import { eventBus } from '@/utils'

import EDITOR_TABS from '@/constants/editor'

function getFormatedDate(occurrence) {
  const onlyDate = (occurrence.updateAt?.dateTime || occurrence.createAt?.dateTime).split('T')[0]
  return moment(onlyDate).format('YYYY-MM-DD')
}

const omnichannelMutations = {
  setOmnichannelActiveTab: (state, tab) => {
    if (Object.values(EDITOR_TABS).includes(tab)) {
      Vue.set(state, 'activeTab', tab)
    }
  },
  setEditorReady: (state, isReady) => Vue.set(state.editor, 'ready', isReady),

  setEditorText: (state, text) => Vue.set(state.editor, 'messageText', text),

  setNoteEditorText: (state, text) => Vue.set(state.editor, 'noteText', text),

  setMessageType: (state, type) => Vue.set(state.editor, 'messageType', type),

  setOccurrences: (state, { content }) => {
    const datas = state.occurrences.list.map((occurrence, index) => {
      if (occurrence.id === null) {
        return {
          index,
          date: getFormatedDate(occurrence)
        }
      }
      return false
    }).filter(el => el !== false)

    const toInsert = content.map(occurrence => {
      const exists = state.occurrences.list.filter(({ createAt, id }, index) => {
        if (id === null && occurrence.id === null && occurrence.createAt.dateTime === createAt.dateTime) {
          return true
        } else {
          return occurrence.id === id && occurrence.createAt.dateTime === createAt.dateTime
        }
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

    state.occurrences.filter.page += 1
  },

  incrementOccurrencesCountGetters: (state) => (state.countOmnichannelGetters += 1),
  decrementOccurrencesCountGetters: (state) => {
    if (state.countOmnichannelGetters > 0) {
      state.countOmnichannelGetters -= 1
    }
  },

  resetOccurrences: (state) => {
    Vue.set(state.occurrences, 'list', [])
    Vue.set(state.occurrences.filter, 'page', 1)
    Vue.set(state.occurrences, 'countGetters', 0)
  },

  addNegotiationOccurrence: (state, occurrence) => {
    const date = getFormatedDate(occurrence)
    const dates = state.occurrences.list.filter(item => !item.id).map(getFormatedDate)

    let canInclude = false

    const { activeTab: tab } = state
    const oType = occurrence.type
    const iType = occurrence.interaction?.type

    const validationInteractions = {
      MESSAGES: [
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
    } else if (tab === 'OCCURRENCES' && oType !== 'NOTE' && validationInteractions[tab].includes(iType)) {
      canInclude = true
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
    }
  },

  setUpOccurrencesSize: (state) => (state.occurrences.filter.page += 1),

  addSumary: (state, { payload, data }) => {
    const { occurrenceId, type } = payload
    Vue.set(state.occurrences.summary[type], occurrenceId, data.content)
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

  setSendingMessage: (state, sending) => Vue.set(state.editor, 'sendinMessage', !!sending),

  resetRecipients: (state) => Vue.set(state.editor, 'recipients', []),

  setMessageAttachments: (state, attachs) => Vue.set(state.editor, 'attachments', attachs)
}

export default omnichannelMutations
