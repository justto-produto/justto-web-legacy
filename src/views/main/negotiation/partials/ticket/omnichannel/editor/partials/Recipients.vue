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
        <el-popover
          placement="top"
          trigger="click"
          popper-class="recipients-popover"
          :disabled="recipients.length <= 1"
        >
          <ul>
            <li
              v-for="(recipient, recipientIndex) in recipients.slice(1)"
              :key="`recipient-${recipientIndex}`"
            >
              <i class="el-icon-caret-right" />
              {{ recipient.address }}
            </li>
          </ul>
          <el-badge
            slot="reference"
            class="item"
            type="primary"
            :value="`+${recipients.length-1}`"
            :hidden="recipients.length <= 1"
          >
            <span class="recipients-container_label-text">
              {{ recipients[0].address }}
            </span>
          </el-badge>
        </el-popover>
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

<style lang="scss">
@import '@/styles/colors';

.recipients-popover {
  padding: 12px;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      margin-top: 6px;

      &:first-child {
        margin-top: 0;
      }

      i {
        color: $--color-text-secondary;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.recipients-container {
  height: 48px;
  display: flex;
  align-items: center;

  .recipients-container_content {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 18px;

    .recipients-container_label {
      cursor: pointer;
    }

    .recipients-container_icon {
      width: 16px;

      &.negotiation {
        margin-top: 2px;
      }
    }
  }
}
</style>
