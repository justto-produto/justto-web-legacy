<template>
  <table class="table-ticket__table">
    <tbody
      v-for="ticket in content"
      :key="ticket.disputeId"
      class="table-ticket__table-body"
    >
      <TicketTableParty :ticket="ticket" />

      <tr>
        <td colspan="2">
          Message
        </td>
      </tr>

      <tr>
        <TicketTableDraft
          :ticket="ticket"
        />

        <td>
          <FollowUp
            v-if="['RUNNING', 'PENDING'].includes(ticket.disputeStatus)"
            :dispute="ticket"
          />
        </td>

        <!-- <td
          :class="{ 'communication-ticket-item-container__time--active': !ticket.visualized }"
          class="communication-ticket-item-container__time"
        >
          {{ getLastInteraction(lastInboundInteraction.dateTime) }}
        </td> -->
      </tr>
    </tbody>
  </table>
</template>

<script>
import { getDocumentStep } from '@/utils'

export default {
  components: {
    TicketTableParty: () => import('./patials/TicketTableParty'),
    TicketTableDraft: () => import('./patials/TicketTableDraft'),
    FollowUp: () => import('@/views/main/management/partials/partials/ManagementFollowUp')
  },

  props: {
    tab: {
      type: String,
      default: 'running'
    },

    tickets: {
      type: Object,
      required: true
    }
  },

  computed: {
    content() {
      return this.tickets?.content || []
    }
  },

  methods: {
    getDocumentStep: (hasDocument, signStatus) => getDocumentStep(hasDocument, signStatus)
  }
}
</script>

<style lang="scss" scoped>
.table-ticket__table {
  cursor: pointer;
  width: 100%;

  .table-ticket__table-head {
    .table-ticket__table-head-row {
      .table-ticket__table-head-row-item {
        text-align: left;
        padding: 6px 0;
        min-width: 0;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
        text-align: left;
        height: 100%;
      }
    }
  }

  .table-ticket__table-body {
    display: flex;
    flex-direction: column;
    padding: 18px 24px 18px 27px;
  }
}
</style>
