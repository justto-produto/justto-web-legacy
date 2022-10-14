<template>
  <td
    v-if="(isAcceptedTab || (isFinishedTab && isSettled)) && showDraft"
    class="ticket-table-draft"
  >
    <span
      :class="{ 'ticket-table-draft__draft--active': !ticket.visualized }"
      class="ticket-table-draft__draft"
    >
      Minuta
    </span>

    <el-steps
      :active="documentStep"
      finish-status="success"
      :class="{ 'ticket-table-draft__draft-steps--active': !ticket.visualized }"
      class="ticket-table-draft__draft-steps"
      style="width: 100px"
    >
      <el-step />
      <el-step />
      <el-step />
    </el-steps>
  </td>
</template>

<script>
import { getDocumentStep } from '@/utils'
import { mapGetters } from 'vuex'
import sharedTicketdMethods from '../../../patials/sharedTicketdMethods'

export default {
  mixins: [sharedTicketdMethods],

  props: {
    ticket: {
      type: Object,
      required: true
    }
  },

  computed: {
    ...mapGetters({
      activeTab: 'getTicketsActiveTab',
      showDraft: 'getIsDraftManagementActive'
    }),

    documentStep() {
      const signStatus = this.ticket?.draftStatus ? this.ticket.draftStatus : this.ticket.signStatus
      return this.getDocumentStep(this.ticket.hasDraft, signStatus)
    },

    isAcceptedTab() {
      return this.activeTab === 'accepted'
    },

    isFinishedTab() {
      return this.activeTab === 'finished'
    },

    isSettled() {
      return this.ticket.disputeStatus === 'SETTLED'
    }
  },

  methods: {
    getDocumentStep: (hasDocument, signStatus) => getDocumentStep(hasDocument, signStatus)
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.ticket-table-draft {
  display: flex;
  justify-content: flex-start;
  gap: 16px;

  .ticket-table-draft__draft {
    font-size: 10px;
    color: $--color-primary;
    font-weight: 500;

    &--active {
      color: $--color-primary !important;
      font-weight: 600;
    }
  }

  .ticket-table-draft__draft-steps {
    font-size: 10px;
    color: $--color-primary;
    font-weight: 500;

    &--active {
      color: $--color-primary !important;
      font-weight: 600;
    }

    .el-step {
      .is-success {
        border-color: $--color-primary !important;

        .is-text {
          background-color: $--color-primary !important;;
        }
      }

      .is-wait {
        border-color: $--color-primary !important;
        color: white !important;
      }

      .is-process {
        border-color: $--color-primary !important;
        color: white !important;
      }

      .el-step__icon {
        width: 14px;
        height: 14px;
        font-size: 6px;
        color: $--color-primary;
      }

      .el-step__head {
        .el-step__line {
          top: 50%;
        }
      }
    }
  }
}
</style>
