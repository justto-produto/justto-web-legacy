<template>
  <nav class="tickets-container">
    <TicketsHeader
      target-path="negotiation"
      :active-tab="activeTab"
      @set-tab="handleSetTab"
    />
    <el-tabs
      v-model="activeTab"
      class="tickets-container__tabs"
      @tab-click="handleChangeTab"
    >
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.name"
        :name="tab.name"
        :label="$options.filters.capitalize($t(`tickets-tabs.${tab.name}`))"
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
            v-for="ticket in ticketsList"
            :key="ticket.disputeId"
            :ticket="ticket"
          />
          <infinite-loading
            :identifier="activeTab"
            spinner="spiral"
            :distance="1340"
            @infinite="infiniteHandler"
          >
            <div slot="no-more">
              Fim das disputas
            </div>
            <div slot="no-results">
              Nada por aqui
            </div>
          </infinite-loading>
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
    TicketsHeader: () => import('./TicketsHeader'),
    InfiniteLoading: () => import('vue-infinite-loading')
  },
  data: () => ({
    activeTab: 'running'
  }),
  computed: {
    ...mapGetters({
      tickets: 'getTickets'
    }),

    ticketsList() {
      return this.tickets.content.filter(t => (typeof t !== 'boolean'))
    },

    tabs() {
      return [
        {
          name: 'pre-negotiation',
          component: 'EngagementTicketItem'
        },
        {
          name: 'engagement',
          component: 'EngagementTicketItem'
        },
        {
          name: 'running',
          component: 'CommunicationTicketItem'
        },
        {
          name: 'accepted',
          component: 'CommunicationTicketItem'
        },
        {
          name: 'finished',
          component: 'CommunicationTicketItem'
        }
      ]
    }
  },
  beforeMount() {
    this.getTickets({ name: this.activeTab })
  },
  methods: {
    ...mapActions([
      'getTickets',
      'getTicketsNextPage',
      'setTicketsQuery',
      'setActivTab'
    ]),

    handleChangeTab(tab) {
      this.setTicketsQuery({ key: 'status', value: [] })
      this.setTicketsQuery({ key: 'prescriptions', value: [] })
      this.setTicketsQuery({ key: 'sort', value: [] })

      switch (tab.name) {
        case 'pre-negotiation':
          this.setTicketsQuery({ key: 'status', value: ['PRE_NEGOTIATION'] })
          this.setTicketsQuery({ key: 'sort', value: ['expirationDate,asc'] })
          break
        case 'engagement':
          this.setTicketsQuery({ key: 'status', value: ['IMPORTED', 'ENRICHED', 'ENGAGEMENT', 'PENDING'] })
          this.setTicketsQuery({ key: 'sort', value: ['expirationDate,asc'] })
          break
        case 'running':
          this.setTicketsQuery({ key: 'status', value: ['RUNNING'] })
          this.setTicketsQuery({ key: 'sort', value: ['visualized,asc', 'lastInboundInteraction.createdAt,desc', 'expirationDate,asc'] })
          break
        case 'accepted':
          this.setTicketsQuery({ key: 'status', value: ['ACCEPTED', 'CHECKOUT'] })
          this.setTicketsQuery({ key: 'sort', value: ['visualized,asc', 'conclusionDate,asc'] })
          break
        case 'finished':
          this.setTicketsQuery({ key: 'prescriptions', value: ['NEWLY_FINISHED'] })
          this.setTicketsQuery({ key: 'sort', value: ['visualized,asc', 'conclusionDate,asc', 'lastInboundInteraction.createdAt,desc'] })
          break
      }

      this.setActivTab(tab.name)
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
    },

    infiniteHandler($state) {
      this.getTicketsNextPage()
        .then(response => {
          if (response.last) {
            $state.complete()
          } else {
            $state.loaded()
          }
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.tickets-container {
  display: flex;
  flex-direction: column;

  .tickets-container__tabs {
    overflow: hidden;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .tickets-container__list {
    list-style: none;
    margin: 0 ;
    padding: 0;
  }
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

.tickets-container {
  .tickets-container__tabs {
    .el-tabs__content {
      overflow: auto;
    }
  }

  .el-tabs__header {
    padding: 12px;
    margin: 0;
    border-bottom: 2px solid $--light-gray;
    border-top: 2px solid $--light-gray;

    .el-tabs__nav-prev,
    .el-tabs__nav-next {
      font-size: 18px !important;
    }
  }

  .el-tabs__item {
    padding: 0 12px !important;
    &:first-child { padding-left: 6px !important; }
    &:last-child { padding-right: 6px !important; }
  }

  .el-tabs__nav-wrap:after {
    display: none;
  }
}
</style>
