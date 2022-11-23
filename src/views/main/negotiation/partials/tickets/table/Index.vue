<template>
  <ul class="ticket-table__container">
    <keep-alive>
      <ManagementTable
        :tab="tab.name"
        :tickets="tickets"
        class="ticket-table__component"
      />
    </keep-alive>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  components: {
    ManagementTable: () => import('./management/ManagementTable')
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
