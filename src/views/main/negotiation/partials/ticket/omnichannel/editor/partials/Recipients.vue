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

      <el-popover
        v-if="type === 'whatsapp' && recipient !== null && canAccessDialer"
        placement="top-end"
        title="Ligar para:"
        width="auto"
        trigger="click"
        popper-class="call-current-recipient-popover"
        :popper-options="{
          offset: [0, 12]
        }"
      >
        <div class="popover__content">
          <div class="name">
            {{ (recipient.toRoleName || '').toLowerCase() | resumedName }}
          </div>

          <el-button
            type="primary"
            size="mini"
            @click="handleAddCall"
          >
            Ligar
          </el-button>
        </div>

        <i
          slot="reference"
          class="text-inline-editor__icon el-icon-phone"
        />
      </el-popover>
    </span>
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { isSimilarStrings } from '@/utils'

export default {
  name: 'Recipients',

  props: {
    isReversed: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    recipient: null
  }),

  computed: {
    ...mapGetters({
      recipients: 'getEditorRecipients',
      type: 'getEditorMessageType',
      userProperties: 'userProperties',
      usingColors: 'isOmnichannelUsingColors',
      canAccessDialer: 'canAccessDialer',
      appInstance: 'getAppInstance',
      ticketStatus: 'getTicketOverviewStatus'
    })
  },

  watch: {
    recipients: {
      deep: true,
      handler: 'handleUpdateRecipients'
    }
  },

  mounted() {
    this.handleUpdateRecipients(this.recipients)
  },

  methods: {
    ...mapActions([
      'addCall',
      'getTicketOverviewParty',
      'getTicketOverviewPartiesTemp'
    ]),

    handleAddCall() {
      this.addCall(this.recipient)
    },

    handlePossibleRecipient({ disputeRoleId: toRoleId }, { name: toRoleName, emails, phones }) {
      const number = this.recipients[0]?.value
      const disputeId = Number(this.$route.params.id)
      const { ticketStatus: disputeStatus, appInstance } = this

      this.recipient = {
        disputeId,
        number,
        disputeStatus,
        appInstance,
        toRoleId,
        toRoleName,
        contacts: { emails, phones }
      }
    },

    handleUpdateRecipients(newer) {
      if (newer.length && newer[0].type === 'whatsapp') {
        const number = this.recipients[0]?.value
        const disputeId = Number(this.$route.params.id)

        this.getTicketOverviewPartiesTemp(disputeId).then(parties => {
          parties.map(async currentParty => {
            const { disputeRoleId } = currentParty

            this.getTicketOverviewParty({ disputeId, disputeRoleId }).then(res => {
              const { phones } = res

              for (const phone of phones) {
                if (isSimilarStrings(phone?.number, number, 90)) {
                  this.handlePossibleRecipient(currentParty, res)
                  break
                }
              }
            })
          })
        })
      } else {
        this.recipient = null
      }
    }
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

    // .recipients-container__label {
    //   cursor: pointer;
    // }

    .recipients-container__icon {
      width: 16px;

      &.negotiation {
        margin-top: 2px;
      }
    }

    span {
      cursor: pointer;
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

.call-current-recipient-popover {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  top: -12px !important;

  .el-popover__title {
    margin: 0;
    width: 100%;
    text-align: center;
  }

  .popover__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    gap: 12px;
    width: 100%;

    .name {
      text-transform: capitalize;
    }

    .el-button {
      display: flex;
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
