<template>
  <nav class="tickets-container">
    <TicketsHeader />

    <el-tabs
      v-model="activeTab"
      @tab-click="handleChangeTab">
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.name"
        :name="tab.name"
        :label="tab.label"
        lazy>
        <ul v-if="activeTab === tab.name">
          <component
            :is="tab.component"
            v-for="ticket in tickets.content"
            :key="ticket.disputeId"
            :ticket="ticket" />
        </ul>
      </el-tab-pane>
    </el-tabs>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Tickets',
  components: {
    EngagementTicketItem: () => import('./EngagementTicketItem'),
    CommunicationTicketItem: () => import('./CommunicationTicketItem'),
    TicketsHeader: () => import('./TicketsHeader')
  },
  data: () => ({
    activeTab: 'running'
  }),
  computed: {
    ...mapGetters({
      tickets: 'getTickets'
    }),

    tabs() {
      return [
        {
          label: 'Sem resposta',
          name: 'engagement',
          component: 'EngagementTicketItem'
        },
        {
          label: 'Em negociação',
          name: 'running',
          component: 'CommunicationTicketItem'
        },
        {
          label: 'Proposta aceita',
          name: 'accepted',
          component: 'CommunicationTicketItem'
        }
      ]
    }
  },
  beforeMount() {
    this.getTickets()
  },
  methods: {
    ...mapActions([
      'getTickets'
    ]),

    handleChangeTab(tab, event) {
      console.log(tab, event)
      let filter = ''
      switch (tab) {
        case 'engagement':
          filter = 'engagement'
          break
        case 'running':
          filter = 'running'
          break
        case 'accepted':
          filter = 'accepted'
          break
      }
      this.getTickets(filter)
    }
  }
}
</script>

<style lang="scss" scoped>
.tickets-container {
  background-color: #fff;
}
</style>
