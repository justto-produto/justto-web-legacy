<template>
  <section
    id="recipientsMessagesEditorOmnichannelTicketNegotiation"
    class="recipients-container"
  >
    <span
      v-if="recipients.length > 0"
      class="recipients-container__content"
    >
      <span class="recipients-container__label">
        <el-popover
          placement="top"
          trigger="click"
          popper-class="recipients-popover"
          :disabled="recipients.length <= 1"
        >
          <ul class="recipients-container__list">
            <li
              v-for="(recipient, recipientIndex) in recipients.slice(1)"
              :key="`recipient-${recipientIndex}`"
              class="recipients-container__list-item"
            >
              <i class="recipients-container__item-icon el-icon-caret-right" />
              {{ recipient.value }}
            </li>
          </ul>
          <el-badge
            slot="reference"
            class="item"
            type="primary"
            :value="`+${recipients.length-1}`"
            :hidden="recipients.length <= 1"
          >
            <span class="recipients-container__label-text">
              {{ recipients[0].value }}
            </span>
          </el-badge>
        </el-popover>
      </span>
      <jus-icon
        :icon="type"
        :is-active="!!type && type !== 'negotiation'"
        class="recipients-container__icon"
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

  .recipients-container__content {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 18px;

    .recipients-container__label {
      cursor: pointer;
    }

    .recipients-container__icon {
      width: 16px;

      &.negotiation {
        margin-top: 2px;
      }
    }
  }
}
</style>

<style lang="scss">
@import '@/styles/colors';

.recipients-popover {
  padding: 12px;

  .recipients-container__list {
    list-style: none;
    margin: 0;
    padding: 0;

    .recipients-container__list-item {
      margin-top: 6px;
      &:first-child {margin-top: 0;}

      .recipients-container__item-icon {
        color: $--color-text-secondary;
      }
    }
  }
}
</style>
