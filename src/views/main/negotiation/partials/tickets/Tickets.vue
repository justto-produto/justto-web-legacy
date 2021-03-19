<template>
  <nav
    v-loading="isLoading"
    class="tickets-container"
  >
    <TicketsHeader
      target-path="negotiation"
      :active-tab="activeTab"
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
        stretch
        lazy
      >
        <span slot="label">
          {{ $t(`tickets-tabs.${tab.name}`) | capitalize }}
          <el-badge
            :hidden="!tab.counter"
            :value="tab.counter"
            :max="99"
            type="primary"
            class="el-badge--absolute"
          />
        </span>
        <!-- <vue-perfect-scrollbar> -->
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
        <!-- </vue-perfect-scrollbar> -->
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
    // VuePerfectScrollbar: () => import('vue-perfect-scrollbar'),
  },
  computed: {
    ...mapGetters({
      tickets: 'getTickets',
      ticketsActiveTab: 'getTicketsActiveTab',
      isLoading: 'getTicketsIsLoading',
      preNegotiationLenght: 'disputeNotVisualizedPreNegotiation',
      engagementLength: 'disputeNearExpirationsEngajement',
      interactionLength: 'disputeNotVisualizedInteration',
      newDealsLength: 'disputeNotVisualizedNewDeal',
      finishedLenght: 'disputeNotVisualizedFinished',
    }),

    tabs() {
      return [
        {
          name: 'pre-negotiation',
          component: 'EngagementTicketItem',
          counter: this.preNegotiationLenght
        },
        {
          name: 'engagement',
          component: 'EngagementTicketItem',
          counter: this.engagementLength
        },
        {
          name: 'running',
          component: 'CommunicationTicketItem',
          counter: this.interactionLength
        },
        {
          name: 'accepted',
          component: 'CommunicationTicketItem',
          counter: this.newDealsLength
        },
        {
          name: 'finished',
          component: 'CommunicationTicketItem',
          counter: this.finishedLenght
        }
      ]
    },

    activeTab: {
      get() {
        return this.ticketsActiveTab
      },
      set(value) {
        this.setTicketsActiveTab(value)
      }
    }
  },
  watch: {
    activeTab(currentActiveTab) {
      this.handleChangeTab({ name: currentActiveTab })
    }
  },
  beforeMount() {
    this.handleChangeTab({ name: this.activeTab })
  },
  methods: {
    ...mapActions([
      'getTickets',
      'getTicketsNextPage',
      'setTicketsQuery',
      'setTicketsActiveTab',
      'getNearExpirations',
      'getNotVisualizeds'
    ]),

    handleChangeTab(tab) {
      this.setTicketsQuery({ key: 'status', value: [] })
      this.setTicketsQuery({ key: 'prescriptions', value: [] })
      this.setTicketsQuery({ key: 'sort', value: [] })

      switch (tab.name) {
        case 'pre-negotiation':
          this.setTicketsQuery({ key: 'status', value: ['PRE_NEGOTIATION'] })
          this.setTicketsQuery({ key: 'sort', value: ['expirationDate,asc', 'id,desc'] })
          break
        case 'engagement':
          this.setTicketsQuery({ key: 'status', value: ['IMPORTED', 'ENRICHED', 'ENGAGEMENT', 'PENDING'] })
          this.setTicketsQuery({ key: 'sort', value: ['expirationDate,asc', 'id,desc'] })
          break
        case 'running':
          this.setTicketsQuery({ key: 'status', value: ['RUNNING'] })
          this.setTicketsQuery({ key: 'sort', value: ['visualized,asc', 'lastInboundInteraction.createdAt,desc', 'expirationDate,asc', 'id,desc'] })
          break
        case 'accepted':
          this.setTicketsQuery({ key: 'status', value: ['ACCEPTED', 'CHECKOUT'] })
          this.setTicketsQuery({ key: 'sort', value: ['visualized,asc', 'conclusionDate,asc', 'id,desc'] })
          break
        case 'finished':
          this.setTicketsQuery({ key: 'prescriptions', value: ['NEWLY_FINISHED'] })
          this.setTicketsQuery({ key: 'sort', value: ['visualized,asc', 'conclusionDate,asc', 'lastReceivedMessage,asc', 'id,desc'] })
          break
      }

      this.getTickets().then(() => {
        this.getNearExpirations()
        this.getNotVisualizeds()
      })
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
      // .tickets-container__tab-pane {
      //   height: 100%;
      // }
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

    @media (max-height: 900px) {
      padding: 6px 12px 10px;

      .el-tabs__nav {
        .el-tabs__item {
          line-height: 38px;
          height: auto;
        }
      }
    }

    @media (max-height: 780px) {
      padding: 6px 12px 10px;

      .el-tabs__nav {
        .el-tabs__item {
          line-height: 30px;
          height: auto;
        }
      }

      .el-tabs__nav-prev,
      .el-tabs__nav-next {
        line-height: 36px;
      }
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

  .el-badge--absolute {
    right: 0;
  }
}
</style>
