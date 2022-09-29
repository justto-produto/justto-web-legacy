<template>
  <ul class="ticket-table__container">
    <keep-alive>
      <component
        :is="ticketListMode === 'TICKET' ? 'TicketsTable' : 'ManagementTable'"
        :tab="tab.name"
        :tickets="tickets"
        class="ticket-table__component"
      />
    </keep-alive>

    <TableMenu class="ticket-table__menu" />
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {
    // InfiniteLoading: () => import('vue-infinite-loading'),
    TicketsTable: () => import('./tickets/TicketsTable'),
    ManagementTable: () => import('./management/ManagementTable'),
    TableMenu: () => import('./partials/TableMenu')
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
    ...mapGetters({
      ticketListMode: 'getTicketListMode'
    })
  }
}
</script>

<style lang="scss">
.ticket-table__container {}
</style>
