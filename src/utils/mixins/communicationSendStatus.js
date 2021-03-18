import { getFormatedDate, isSimilarStrings } from '@/utils'

export default {
  computed: {
    interaction() {
      return this.value
    },

    person() {
      const name = this.interaction.message.parameters[this.directionIn ? 'SENDER_NAME' : 'RECEIVER_NAME']
      return this.$options.filters.resumedName(name || '')
    },

    isSimilarName() {
      return isSimilarStrings(this.person, this.contact, 75)
    },

    directionIn() {
      return this.interaction.direction === 'INBOUND'
    },

    sendDate() {
      return getFormatedDate(this.interaction, 'HH:mm')
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
    }
  }
}
