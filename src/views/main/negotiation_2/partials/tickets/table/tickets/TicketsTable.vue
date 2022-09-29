<template>
  <table class="table-ticket__table">
    <tbody
      v-for="ticket in content"
      :key="ticket.disputeId"
      class="table-ticket__table-body"
      :class="{ 'table-ticket__table-body--active': isActive(ticket.disputeId) }"
      @click="handleTicketClick(ticket)"
    >
      <TicketTableParty :ticket="ticket" />

      <tr>
        <td colspan="4">
          <TickettableMessage :ticket="ticket" />
        </td>
      </tr>

      <tr class="table-ticket__table-body__footer">
        <TicketTableDraft :ticket="ticket" />

        <td>
          <FollowUp
            v-if="['RUNNING', 'PENDING'].includes(ticket.disputeStatus)"
            :dispute="ticket"
          />
        </td>

        <TicketTableDate :ticket="ticket" />
      </tr>
    </tbody>
  </table>
</template>

<script>
import { getDocumentStep } from '@/utils'

export default {
  components: {
    TicketTableDate: () => import('./partials/TicketTableDate'),
    TicketTableParty: () => import('./partials/TicketTableParty'),
    TicketTableDraft: () => import('./partials/TicketTableDraft'),
    TickettableMessage: () => import('./partials/TicketTableMessage'),
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
    },

    isActive() {
      return (id) => (Number(id) === Number(this.$route.params.id))
    }
  },

  methods: {
    getDocumentStep: (hasDocument, signStatus) => getDocumentStep(hasDocument, signStatus),

    handleTicketClick(ticket) {
      const { disputeId } = ticket

      console.log(disputeId)

      if (!this.isActive(disputeId)) {
        this.$router.push(`negotiation2/${disputeId}`)
        // this.$router.push({
        //   name: 'ticket',
        //   params: { id: disputeId }
        // })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

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
    min-height: 80px;
    flex-direction: column;
    padding: 18px 24px 0px 27px;
    border-bottom: 1px solid $--color-light-gray;

    &:hover:not(.table-ticket__table-body--active) {
      background-color: $--color-light-gray;
    }

    &.table-ticket__table-body--active {
      background-color: $--color-light-gray;
    }

    .table-ticket__table-body__footer {
      display: flex;

      td {
        flex: 1;
      }
    }
  }
}
</style>
