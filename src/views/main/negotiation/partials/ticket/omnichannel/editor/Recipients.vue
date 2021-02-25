<template>
  <section
    id="recipientsMessagesEditorOmnichannelTicketNegotiation"
    class="recipients-container"
  >
    <span
      v-if="recipients.length > 0"
      class="recipients-container_content"
    >
      <span class="recipients-container_label">
        Destinatários:
        {{ recipients[0].address }}
        {{ recipients.length > 1 ? `+${recipients.length - 1}` : '' }}
      </span>
      <jus-icon
        :icon="type"
        :is-active="!!type && type !== 'negotiation'"
        class="recipients-container_icon"
        :class="type"
      />
    </span>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Recipients',
  computed: {
    ...mapGetters({
      recipients: 'getEditorRecipients',
      type: 'getEditorMessageType'
    })
  }
}
</script>

<style lang="scss" scoped>
.recipients-container {
  height: 48px;
  display: flex;
  align-items: center;

  .recipients-container_content {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;

    .recipients-container_icon {
      width: 16px;

      &.negotiation {
        margin-top: 2px;
      }
    }
  }
}
</style>
