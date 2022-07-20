<template>
  <section
    id="recipientsMessagesEditorOmnichannelTicketNegotiation"
    class="recipients-container"
  >
    <span
      v-if="recipients.length > 0"
      class="recipients-container__content"
      :class="{
        'recipients-container__content-reverse': isReversed,
        'recipients-container__whatsapp': type === 'whatsapp' && usingColors,
        'recipients-container__email': type === 'email' && usingColors,
        'recipients-container__negotiator': ['negotiator_message', 'negotiation'].includes(type) && usingColors
      }"
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
              <span v-if="type === 'whatsapp'">
                {{ recipients[0].value | phoneNumber }}
              </span>
              <span v-else>
                {{ recipients[0].value }}
              </span>
            </span>
          </el-badge>
        </el-popover>
      </span>

      <!-- <jus-icon
        :icon="type"
        :is-active="!!type && type !== 'negotiation'"
        class="recipients-container__icon"
        :class="type"
      /> -->
    </span>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Recipients',
  props: {
    isReversed: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      recipients: 'getEditorRecipients',
      type: 'getEditorMessageType',
      userProperties: 'userProperties',
      usingColors: 'isOmnichannelUsingColors'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors';

.recipients-container {
  display: flex;
  align-items: center;

  .recipients-container__content {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;

    padding: 2px 6px 4px;
    border-radius: 8px;

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

  .recipients-container__content-reverse {
    flex-direction: row-reverse;
  }

  .recipients-container__whatsapp {
    background-color: #8ae698;
  }

  .recipients-container__email {
    background-color: #d5f1fb;
  }

  .recipients-container__negotiator {
    background-color: $--color-negotiator-bg;
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
