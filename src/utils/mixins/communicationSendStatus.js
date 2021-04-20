import { isSimilarStrings } from '@/utils'

export default {
  computed: {
    person() {
      if (this?.interaction?.properties?.PERSON_NAME) {
        return this.$options.filters.resumedName(this?.interaction?.properties?.PERSON_NAME)
      } else {
        const name = this.interaction.message.parameters[this.directionIn ? 'SENDER_NAME' : 'RECEIVER_NAME']
        return this.$options.filters.resumedName(name || '')
      }
    },

    isSimilarName() {
      return isSimilarStrings(this.person, this.contact, 75)
    },

    directionIn() {
      return this.interaction.direction === 'INBOUND'
    },

    sendDate() {
      return this.occurrence.updateAt?.dateTime || this.occurrence.createAt?.dateTime
      // return getFormatedDate(this.interaction, 'HH:mm')
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
