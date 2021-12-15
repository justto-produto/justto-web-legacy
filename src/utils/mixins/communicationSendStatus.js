import { isSimilarStrings, normalizeDateToISO } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      toPrint: 'getExportTicketModalVisible'
    }),

    person() {
      const key = this.directionIn ? 'SENDER_NAME' : 'RECEIVER_NAME'

      if (this.interaction?.message?.parameters[key]) {
        const name = this.interaction?.message?.parameters[key]

        return this.$options.filters.resumedName(name || '')
      } else if (this?.interaction?.properties?.PERSON_NAME) {
        return this.$options.filters.resumedName(this?.interaction?.properties?.PERSON_NAME)
      } else {
        return ''
      }
    },

    isSimilarName() {
      return isSimilarStrings(this.person, this.contact, 75)
    },

    directionIn() {
      return this.interaction?.direction === 'INBOUND'
    },

    sendDate() {
      return this.occurrence.updateAt?.dateTime || this.occurrence.createAt?.dateTime
    },

    sendStatus() {
      const parameters = this.interaction?.message?.parameters || {}
      const keys = Object.keys(parameters)

      if (keys.includes('READ_DATE')) {
        return 'readed'
      } else if (keys.includes('RECEIVER_DATE')) {
        return 'recived'
      } else if (keys.includes('SEND_DATE')) {
        return 'sent'
      } else {
        return 'sent'
      }
    },

    sendStatusDate() {
      const parameters = this.interaction?.message?.parameters || {}
      const keys = Object.keys(parameters)

      if (keys.includes('READ_DATE')) {
        return normalizeDateToISO(parameters.READ_DATE)
      } else if (keys.includes('RECEIVER_DATE')) {
        return normalizeDateToISO(parameters.RECEIVER_DATE)
      } else if (keys.includes('SEND_DATE')) {
        return normalizeDateToISO(parameters.SEND_DATE)
      } else {
        return this.interaction?.createAt?.dateTime
      }
    },

    properties() {
      return this.occurrence?.properties
    },

    groupedOccurrences() {
      try {
        if (this.occurrence?.properties?.GROUPED_OCCURRENCES?.length > 2) {
          return JSON.parse(this.occurrence?.properties?.GROUPED_OCCURRENCES.replace(/'/g, '"'))
        }
        return []
      } catch (_) {
        return []
      }
    },

    haveGroupedOccurrences() {
      return this.groupedOccurrences.length > 0
    }
  }
}
