<template>
  <nav
    v-loading="isLoading"
    class="tickets-container"
  >
    <TicketsHeader
      target-path="negotiation"
      :active-tab="activeTab"
    />

    <span
      class="left-arrow"
      @click="handlePreviousTab()"
    >
      <i class="el-icon-arrow-left" />
    </span>

    <span
      class="right-arrow"
      @click="handleNextTab()"
    >
      <i class="el-icon-arrow-right" />
    </span>

    <el-tabs
      v-model="activeTab"
      class="tickets-container__tabs"
    >
      <el-tab-pane
        v-for="tab in filteredTabs"
        :key="tab.name"
        :name="tab.name"
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
              <span v-if="tickets.content.length === 0">
                Sem disputas
              </span>
            </div>
          </infinite-loading>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </nav>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import events from '@/constants/negotiationEvents'
import { eventBus } from '@/utils'

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
      hasFilters: 'getTicketsHasFilters',
      ticketsActiveTab: 'getTicketsActiveTab',
      isLoading: 'getTicketsIsLoading',
      preNegotiationLenght: 'disputeNotVisualizedPreNegotiation',
      engagementLength: 'disputeNearExpirationsEngajement',
      interactionLength: 'disputeNotVisualizedInteration',
      newDealsLength: 'disputeNotVisualizedNewDeal',
      finishedLenght: 'disputeNotVisualizedFinished',
      preventFilters: 'getTicketsPreventFilters'
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

    filteredTabs() {
      return [
        ...this.tabs.slice(this.activeTabIndex - 1, this.tabs.length + 1),
        ...this.tabs.slice(0, this.activeTabIndex - 1)
      ]
    },

    activeTab: {
      get() {
        return this.ticketsActiveTab
      },
      set(value) {
        this.setTicketsActiveTab(value)
        this.handleChangeTab({ name: value })
      }
    },

    activeTabIndex() {
      return this.tabs.findIndex(({ name }) => this.activeTab === name)
    },

    ticketIndex() {
      const { id } = this.$route.params

      return this.tickets.content.findIndex((el) => Number(el.disputeId) === Number(id))
    }
  },

  beforeMount() {
    if (localStorage.getItem('TICKET_ACTIVE_TAB')) {
      this.setTicketsActiveTab(localStorage.getItem('TICKET_ACTIVE_TAB'))
    }

    this.handleChangeTab({ name: this.activeTab })
  },

  mounted() {
    eventBus.$on(events.TICKET_NEXT_TAB.callback, this.handleNextTab)
    eventBus.$on(events.TICKET_PREVIOUS_TAB.callback, this.handlePreviousTab)
    eventBus.$on(events.TICKET_DOWN.callback, this.handleNextTicket)
    eventBus.$on(events.TICKET_UP.callback, this.handlePreviousTicket)

    setTimeout(() => {
      this.$forceUpdate()
    }, 250)
  },

  beforeDestroy() {
    eventBus.$off(events.TICKET_NEXT_TAB.callback, this.handleNextTab)
    eventBus.$off(events.TICKET_PREVIOUS_TAB.callback, this.handlePreviousTab)
    eventBus.$off(events.TICKET_DOWN.callback, this.handleNextTicket)
    eventBus.$off(events.TICKET_UP.callback, this.handlePreviousTicket)
  },

  methods: {
    ...mapActions([
      'getTickets',
      'getTicketsNextPage',
      'setTicketsQuery',
      'setTicketsActiveTab',
      'getNearExpirations',
      'getNotVisualizeds',
      'getTicketsFilteredTags'
    ]),

    ...mapMutations(['setPreventFilters', 'setPreventSocket']),

    handleChangeTab(tab) {
      if (!this.preventFilters) {
        this.setPreventSocket(false)
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
            this.setTicketsQuery({ key: 'sort', value: ['visualized,asc', 'conclusionDate,asc', 'expirationDate,asc', 'lastReceivedMessage,asc', 'id,desc'] })
            break
        }
      } else {
        this.setPreventFilters(false)
      }

      this.getTicketsFilteredTags()
      this.getTickets()
        .then((response) => {
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
    },

    handleNextTab() {
      if (this.activeTabIndex >= 0 && this.activeTabIndex < (this.tabs.length - 1)) {
        const { name } = this.tabs[this.activeTabIndex + 1]
        this.setTicketsActiveTab(name)
      } else if (this.activeTabIndex === (this.tabs.length - 1)) {
        const { name } = this.tabs[0]
        this.setTicketsActiveTab(name)
      }
    },

    handlePreviousTab() {
      if (this.activeTabIndex > 0 && this.activeTabIndex <= (this.tabs.length - 1)) {
        const { name } = this.tabs[this.activeTabIndex - 1]
        this.setTicketsActiveTab(name)
      } else if (this.activeTabIndex === 0) {
        const { name } = this.tabs[this.tabs.length - 1]
        this.setTicketsActiveTab(name)
      } else if (this.activeTabIndex === (this.tabs.length - 1)) {
        const { name } = this.tabs[0]
        this.setTicketsActiveTab(name)
      }
    },

    handleNextTicket() {
      const { id } = this.$route.params

      if (id) {
        const condition = this.ticketIndex >= 0 && this.ticketIndex < (this.tickets.content.length - 1)
        const index = this.ticketIndex + Number(condition)
        const { disputeId } = this.tickets.content[index]

        if (condition) {
          this.$router.push({ path: `/negotiation/${disputeId}` })
        }
      }
    },

    handlePreviousTicket() {
      const { id } = this.$route.params

      if (id) {
        const condition = this.ticketIndex > 0 && this.ticketIndex <= (this.tickets.content.length - 1)
        const index = this.ticketIndex - Number(condition)
        const { disputeId } = this.tickets.content[index]

        if (condition) {
          this.$router.push({ path: `/negotiation/${disputeId}` })
        }
      }
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
  position: relative;

  .left-arrow,
  .right-arrow {
    position: absolute;
    top: 0;
    cursor: pointer;
    z-index: 2;

    & > i {
      font-size: 18px !important;
    }
  }

  .left-arrow {
    left: 0;
    margin: 64px 0 0 14px;
    margin: 63px 0 0 4px;
  }

  .right-arrow {
    right: 0;
    margin: 64px 12px 0 0;
    margin: 63px 0px 0 0;
  }

  .tickets-container__tabs {
    .el-tabs__content {
      overflow: auto;
    }
  }

  .el-tabs__header {
    /*padding: 12px;*/
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin: 0;
    border-bottom: 2px solid $--color-light-gray;
    border-top: 2px solid $--color-light-gray;

    .el-tabs__nav-prev,
    .el-tabs__nav-next {
      font-size: 18px !important;
      display: none;
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
