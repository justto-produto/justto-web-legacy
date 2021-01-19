<template>
  <nav class="tickets-container">
    <TicketsHeader @set-tab="handleSetTab" />

    <el-tabs
      v-model="activeTab"
      @tab-click="handleChangeTab"
    >
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.name"
        :name="tab.name"
        :label="tab.label"
        class="tickets-container__tab-pane"
        stretch
        lazy
      >
        <ul
          v-if="activeTab === tab.name"
          class="tickets-container__list"
        >
          <component
            :is="tab.component"
            v-for="ticket in tickets.content"
            :key="ticket.disputeId"
            :ticket="ticket"
          />
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
          label: 'Pré negociação',
          name: 'pre-negotiation',
          component: 'EngagementTicketItem'
        },
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
        },
        {
          label: 'Finalizados',
          name: 'finished',
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
      'getTickets',
      'setTicketsQuery'
    ]),

    handleChangeTab(tab) {
      this.setTicketsQuery({ key: 'status', value: [] })
      this.setTicketsQuery({ key: 'prescription', value: [] })
      this.setTicketsQuery({ key: 'sort', value: [] })

      switch (tab.name) {
        case 'pre-negotiation':
          this.setTicketsQuery({ key: 'status', value: ['PRE_NEGOTIATION'] })
          // this.setTicketsQuery({ key: 'sort', value: [] })
          break
        case 'engagement':
          this.setTicketsQuery({ key: 'status', value: ['IMPORTED', 'ENRICHED', 'ENGAGEMENT', 'PENDING'] })
          // this.setTicketsQuery({ key: 'sort', value: [] })
          break
        case 'running':
          this.setTicketsQuery({ key: 'status', value: ['RUNNING'] })
          // this.setTicketsQuery({ key: 'sort', value: [] })
          break
        case 'accepted':
          this.setTicketsQuery({ key: 'status', value: ['ACCEPTED', 'CHECKOUT'] })
          // this.setTicketsQuery({ key: 'sort', value: [] })
          break
        case 'finished':
          this.setTicketsQuery({ key: 'prescription', value: ['NEWLY_FINISHED'] })
          // this.setTicketsQuery({ key: 'sort', value: ['id,desc'] })
          break
      }

      this.getTickets()
    },

    handleSetTab(disputeStatus) {
      switch (disputeStatus) {
        case 'PRE_NEGOTIATION':
          this.activeTab = 'pre-negotiation'
          break
        case 'IMPORTED':
        case 'ENRICHED':
        case 'ENGAGEMENT':
        case 'PENDING':
          this.activeTab = 'engagement'
          break
        case 'RUNNING':
          this.activeTab = 'running'
          break
        case 'ACCEPTED':
        case 'CHECKOUT':
          this.activeTab = 'accepted'
          break
        case '':
          this.activeTab = 'finished'
          break
      }

      this.handleChangeTab({ name: this.activeTab })
    }
  }
}
</script>

<style lang="scss" scoped>
.tickets-container {
  background-color: #fff;
  max-width: 400px;

  .tickets-container__list {
    list-style: none;
    margin: 0 ;
    padding: 0;
  }
}

@media (max-width: 900px) {
  .tickets-container {
    max-width: 100%;
  }
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

.tickets-container {
  .el-tabs__header {
    padding: 0px 12px 12px;
    margin: 0;
    border-bottom: 2px solid $--light-gray;

    .el-tabs__nav-prev, .el-tabs__nav-next {
      font-size: 18px !important;
      &.is-disabled { color: $--color-primary !important; }
    }
  }
  .el-tabs__item {
    padding: 0 12px !important;
    &:first-child {
      padding-left: 6px !important;
    }
    &:last-child {
      padding-right: 6px !important;
    }
  }

  .el-tabs__nav-wrap:after {
    display: none;
  }
}

@media (max-width: 900px) {
  .tickets-container {
    .el-tabs__header {
      padding: 12px;
      border-top: 2px solid $--light-gray;
    }
  }
}
</style>
