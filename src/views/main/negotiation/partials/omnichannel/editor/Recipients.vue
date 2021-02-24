<template>
  <section
    id="recipientsMessagesEditorOmnichannelTicketNegotiation"
    class="recipients-container"
  >
    <span v-if="recipients.length > 0">
      Destinatários:
      {{ recipients[0].address }}
      {{ recipients.length > 1 ? `+${recipients.length - 1}` : '' }}
    </span>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Recipients',
  computed: {
    ...mapGetters({
      recipients: 'getEditorRecipients'
    })
  }
}
</script>

<style lang="scss" scoped>
.recipients-container {
  height: 48px;
  display: flex;
  align-items: center;
}
</style>
