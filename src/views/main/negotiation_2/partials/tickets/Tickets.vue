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
      @click="handlePreviousScroll()"
    >
      <i class="el-icon-arrow-left" />
    </span>

    <span
      class="right-arrow"
      @click="handleNextScroll()"
    >
      <i class="el-icon-arrow-right" />
    </span>

    <el-tabs
      ref="tabs"
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

        <div class="tickets-container__counter">
          {{ tickets.totalElements || 0 }} {{ $tc('labels.dispute', tickets.totalElements || 0) }}
        </div>

        <ManagementTable
          v-show="fullScreen"
          class="tickets-container__list"
          :tab="tab.name"
          :tickets="tickets"
          @infinite="infiniteHandler"
        />

        <!-- v-else-if="activeTab === tab.name" -->
        <ul
          v-show="!fullScreen && activeTab === tab.name"
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
    InfiniteLoading: () => import('vue-infinite-loading'),
    ManagementTable: () => import('./table/management/ManagementTable')
    // VuePerfectScrollbar: () => import('vue-perfect-scrollbar'),
  },

  props: {
    fullScreen: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    disputeDebounce: null
  }),

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
        this.resetTabsScroll()
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
    this.handleInitDispute()
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
      'getDisputes',
      'setTicketsQuery',
      'getPrescriptions',
      'getNotVisualizeds',
      'getTicketsNextPage',
      'getNearExpirations',
      'setTicketsActiveTab',
      'getTicketsFilteredTags'
    ]),

    ...mapMutations([
      'clearDisputes',
      'addPrescription',
      'setPreventSocket',
      'setPreventFilters',
      'updateDisputeQuery',
      'addDisputeQueryPageByTicket',
      'setDisputeHasFilters',
      'clearDisputeQueryByTab'
    ]),

    resetTabsScroll() {
      try {
        this.$refs.tabs.$el.childNodes[0].childNodes[0].childNodes[2].scroll(0, 0)
      } catch (error) {
        console.error('Erro ao Resetar Scrool.')
      }
    },

    handlePreviousScroll() {
      const tabs = this.$refs.tabs.$el.childNodes[0].childNodes[0].childNodes[2] // document.querySelector('div.el-tabs__header.is-top div .el-tabs__nav-scroll')
      const step = tabs.scrollWidth / 3

      console.table({
        scrollLeft: tabs.scrollLeft,
        scrollWidth: tabs.scrollWidth,
        step,
        current: tabs.scrollLeft - step
      })

      if ((tabs.scrollLeft) <= 0) {
        tabs.scroll(tabs.scrollWidth, 0)
      } else {
        tabs.scroll(tabs.scrollLeft - step, 0)
      }
    },

    handleNextScroll() {
      const tabs = this.$refs.tabs.$el.childNodes[0].childNodes[0].childNodes[2] // document.querySelector('div.el-tabs__header.is-top div .el-tabs__nav-scroll')
      const step = tabs.scrollWidth / 3

      if ((tabs.scrollLeft + (step * 2)) > tabs.scrollWidth) {
        tabs.scroll(0, 0)
      } else {
        tabs.scroll(tabs.scrollLeft + step, 0)
      }
    },

    handleInitDispute() {
      const { query } = this.$route

      if (Object.keys(query).length) {
        this.$store.commit('clearDisputeQuery')
        this.addPrescription(query.prescription)
        this.updateDisputeQuery({ key: 'status', value: query.status || [] })
        this.updateDisputeQuery({ key: 'startDate', value: query.startDate })
        this.updateDisputeQuery({ key: 'finishDate', value: query.finishDate })
        this.updateDisputeQuery({ key: 'transactionType', value: query.transactionType })
        this.setDisputeHasFilters(query.disputeHasFilters)
        console.log('setDisputesTab', query.disputeTab)
        // this.$store.commit('setDisputesTab', query.disputeTab)
      }

      this.handleGetDisputes()
      this.getPrescriptions()
    },

    handleChangeTab(tab) {
      this.$jusSegment(`Navegação na aba ${this.$t('tickets-tabs.' + tab.name).toUpperCase()} da Negociação`)

      if (!this.preventFilters) {
        this.setPreventSocket(false)
        this.setTicketsQuery({ key: 'status', value: [] })
        this.setTicketsQuery({ key: 'prescriptions', value: [] })
        this.setTicketsQuery({ key: 'sort', value: [] })

        // Update Management Info.
        this.clearDisputes()
        this.clearDisputeQueryByTab()
        this.setDisputeHasFilters(false)

        switch (tab.name) {
          case 'pre-negotiation':
            this.setTicketsQuery({ key: 'status', value: ['PRE_NEGOTIATION'] })
            this.setTicketsQuery({ key: 'sort', value: ['expirationDate,asc', 'id,desc'] })
            // Management filters
            this.updateDisputeQuery({ key: 'status', value: ['PRE_NEGOTIATION'] })
            this.updateDisputeQuery({ key: 'sort', value: ['expirationDate,asc'] })
            break
          case 'engagement':
            this.setTicketsQuery({ key: 'status', value: ['IMPORTED', 'ENRICHED', 'ENGAGEMENT', 'PENDING'] })
            this.setTicketsQuery({ key: 'sort', value: ['expirationDate,asc', 'id,desc'] })
            // Management Filters
            this.updateDisputeQuery({ key: 'status', value: ['IMPORTED', 'ENRICHED', 'ENGAGEMENT', 'PENDING'] })
            this.updateDisputeQuery({ key: 'sort', value: ['expirationDate,asc'] })
            break
          case 'running':
            this.setTicketsQuery({ key: 'status', value: ['RUNNING'] })
            this.setTicketsQuery({ key: 'sort', value: ['visualized,asc', 'lastInboundInteraction.createdAt,desc', 'expirationDate,asc', 'id,desc'] })
            // Management Filters
            this.updateDisputeQuery({ key: 'status', value: ['RUNNING'] })
            this.updateDisputeQuery({ key: 'sort', value: ['visualized,asc', 'lastInboundInteraction.createdAt,desc', 'expirationDate,asc'] })
            break
          case 'accepted':
            this.setTicketsQuery({ key: 'status', value: ['ACCEPTED', 'CHECKOUT'] })
            this.setTicketsQuery({ key: 'sort', value: ['visualized,asc', 'conclusionDate,asc', 'id,desc'] })
            // Management Filters
            this.updateDisputeQuery({ key: 'status', value: ['ACCEPTED', 'CHECKOUT'] })
            this.updateDisputeQuery({ key: 'sort', value: ['visualized,asc', 'conclusionDate,asc'] })
            break
          case 'finished':
            this.setTicketsQuery({ key: 'prescriptions', value: ['NEWLY_FINISHED'] })
            this.setTicketsQuery({ key: 'sort', value: ['visualized,asc', 'conclusionDate,asc', 'expirationDate,asc', 'lastReceivedMessage,asc', 'id,desc'] })
            // Management Filters
            this.addPrescription('NEWLY_FINISHED')
            this.updateDisputeQuery({ key: 'status', value: [] })
            this.updateDisputeQuery({ key: 'sort', value: ['visualized,asc', 'conclusionDate,asc', 'lastReceivedMessage,asc'] })
            break
          default:
            this.updateDisputeQuery({ key: 'status', value: [] })
            this.updateDisputeQuery({ key: 'sort', value: ['id,desc'] })
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
      this.handleGetDisputes()
    },

    // GET Disputes logic
    handleGetDisputes() {
      clearTimeout(this.disputeDebounce)
      this.disputeDebounce = setTimeout(() => {
        this.$store.dispatch('getFilteredTags')
        return this.getDisputes('resetPages').catch(error => {
          if (this.$store.getters.isLoggedIn) {
            this.$jusNotification({ error })
          }
        })
        // .finally(() => {
        //   this.$nextTick(() => {
        //     const main = this.$el.querySelector('.el-table__body-wrapper')
        //     if (main) {
        //       main.scrollTop = 0
        //     }
        //   })
        //   // if (this.$refs.managementTable) this.$refs.managementTable.disputeKey += 1
        // })
      }, 300)
    },

    infiniteHandler($state) {
      console.log('infiniteHandler', $state)
      // Busca disputas da próxima página.
      this.addDisputeQueryPageByTicket()
      this.getDisputes('nextPage')

      // Busca Tickets da próxima página.
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

  .tickets-container__counter {
    text-align: center;
    height: 26px;
    font-weight: 600;
    background-color: #F4EFFF;
    padding: 4px 0 6px;

    font-size: 12px;

    position: -webkit-sticky;
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .tickets-container__list {
    list-style: none;
    margin: 0;
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
    height: 100%;

    .el-tabs__content {
      overflow: auto;
      height: 100%;

      .el-tab-pane {
        height: calc(100% - 26px);
      }
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

    .el-tabs__nav-scroll {
      scroll-behavior: smooth;
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
