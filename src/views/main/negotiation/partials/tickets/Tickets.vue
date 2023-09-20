<template>
  <nav
    v-loading="loading"
    class="tickets-container"
    :class="{ hide: isToHideTickets }"
  >
    <el-button
      v-show="!fullScreen"
      :icon="`el-icon-arrow-${isToHideTickets ? 'right' : 'left'}`"
      class="tickets-container__visibility-button"
      type="text"
      @click="setHideTicket(!isToHideTickets)"
    />

    <TicketsHeader
      v-if="!showNegotiationTypeMenu"
      target-path="negotiation"
      @ticket:getDisputes="getDisputes()"
    />

    <Management
      v-if="fullScreen"
      class="tickets-container__management"
      :tickets="tickets"
      @infinite="infiniteHandler"
      @change:tab="handleManagementChangeTab"
      @management:getDisputes="getTickets()"
    />

    <span
      v-if="!fullScreen && !isToHideTickets"
      class="left-arrow"
      :class="{ 'left-arrow-with-header': !showNegotiationTypeMenu }"
      @click="handlePreviousScroll()"
    >
      <i class="el-icon-arrow-left" />
    </span>

    <span
      v-if="!fullScreen && !isToHideTickets"
      class="right-arrow"
      :class="{ 'right-arrow-with-header': !showNegotiationTypeMenu }"
      @click="handleNextScroll()"
    >
      <i class="el-icon-arrow-right" />
    </span>

    <el-tabs
      v-if="!fullScreen"
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

        <div
          v-if="!fullScreen"
          class="tickets-container__counter"
        >
          {{ tickets.totalElements || 0 }} {{ $tc('labels.dispute', tickets.totalElements || 0) }}
        </div>

        <ul
          v-show="!fullScreen && activeTab === tab.name"
          class="tickets-container__list"
        >
          <component
            :is="tab.component"
            v-for="ticket in tickets.content"
            :key="ticket.disputeId"
            :ticket="ticket"
            @update="$emit('update', $event)"
          />

          <JusScrollLoading
            v-if="getTicketsQuery.page > 0"
            :target="scrollTarget"
            :loading.sync="loading"
            :ended="Boolean(tickets?.last)"
            :empty="Boolean(tickets.content.length === 0)"
            @load="infiniteHandler"
          />
        </ul>
      </el-tab-pane>
    </el-tabs>
  </nav>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import events from '@/constants/negotiationEvents'
import { eventBus } from '@/utils'
import EngagementTicketItem from './EngagementTicketItem'
import CommunicationTicketItem from './CommunicationTicketItem'
import JusScrollLoading from '@/components/others/JusScrollLoading'

export default {
  name: 'Tickets',

  components: {
    EngagementTicketItem,
    CommunicationTicketItem,
    TicketsHeader: () => import('./TicketsHeader'),
    Management: () => import('@/views/main/management/Management'),
    JusScrollLoading
  },

  props: {
    fullScreen: {
      type: Boolean,
      default: false
    }
  },

  provide: {
    isTicket: true
  },

  data: () => ({
    disputeDebounce: null,
    localLoading: false,
    scrollTarget: '.tickets-container__tabs>.el-tabs__content',
    visible: true
  }),

  computed: {
    ...mapGetters({
      tickets: 'getTickets',
      userProperties: 'userProperties',
      getTicketsQuery: 'getTicketsQuery',
      hasFilters: 'getTicketsHasFilters',
      ticketsActiveTab: 'getTicketsActiveTab',
      isLoading: 'getTicketsIsLoading',
      preNegotiationLenght: 'disputeNotVisualizedPreNegotiation',
      engagementLength: 'disputeNearExpirationsEngajement',
      interactionLength: 'disputeNotVisualizedInteration',
      newDealsLength: 'disputeNotVisualizedNewDeal',
      finishedLenght: 'disputeNotVisualizedFinished',
      preventFilters: 'getTicketsPreventFilters',
      isToHideTickets: 'isToHideTickets',
      showNegotiationTypeMenu: 'showNegotiationTypeMenu',
      ticketListMode: 'getTicketListMode'
    }),

    loading: {
      get() {
        return this.isLoading || this.localLoading
      },

      set(value) {
        this.localLoading = value
      }
    },

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
        if (value !== this.ticketsActiveTab) {
          this.setTicketsActiveTab(value)
          this.handleChangeTab({ name: value })
          this.resetTabsScroll()
          this.setDisputesTab(this.tabs.findIndex(({ name }) => name === value))
        }
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

  watch: {
    ticketListMode(mode) {
      if (mode === 'TICKET') {
        this.handleInitTab()
      }
    }
  },

  beforeMount() {
    if (localStorage.getItem('TICKET_ACTIVE_TAB')) {
      this.setTicketsActiveTab(localStorage.getItem('TICKET_ACTIVE_TAB'))
      this.setDisputesTab(this.tabs.findIndex(({ name }) => name === localStorage.getItem('TICKET_ACTIVE_TAB')))
    }

    this.handleInitDispute()
    this.handleChangeTab({ name: this.activeTab })

    // TODO: Não atribuir quando tiver com disputa aberta
    if (this.userProperties?.PREFERRED_INTERFACE !== 'NEGOTIATION') {
      this.setAccountProperty({ PREFERRED_INTERFACE: 'NEGOTIATION' })
    }
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
      'setAccountProperty',
      'setTicketsActiveTab',
      'getTicketsFilteredTags'
    ]),

    ...mapMutations([
      'clearDisputes',
      'setDisputesTab',
      'addPrescription',
      'setPreventSocket',
      'setPreventFilters',
      'updateDisputeQuery',
      'resetTicketsLastPage',
      'addDisputeQueryPageByTicket',
      'setDisputeHasFilters',
      'clearDisputeQueryByTab',
      'setHideTicket'
    ]),

    resetTabsScroll() {
      try {
        const target = document.querySelector(this.scrollTarget)

        if (target) { target.scroll(0, 0) }
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
        // this.$store.commit('setDisputesTab', query.disputeTab)
      }

      // TODO: GETs do Management.
      // this.handleGetDisputes()
      // this.getPrescriptions()
    },

    handleManagementChangeTab(tab) {
      if (this.activeTab === this.tabs[tab].name) return

      console.log(this.tabs[tab])

      this.setTicketsActiveTab(this.tabs[tab].name)
    },

    handleInitTab() {
      this.handleChangeTab({ name: this.activeTab })
      this.resetTabsScroll()
    },

    handleChangeTab(tab) {
      this.$jusSegment(`Navegação na aba ${this.$t('tickets-tabs.' + tab.name).toUpperCase()} da Negociação`)

      if (!this.preventFilters) {
        this.setPreventSocket(false)
        this.setTicketsQuery({ key: 'status', value: [] })
        this.setTicketsQuery({ key: 'prescriptions', value: [] })
        this.setTicketsQuery({ key: 'sort', value: [] })
        this.resetTicketsLastPage()

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

      this.infiniteId += 1

      this.getTicketsFilteredTags()
      this.getTickets()
        .then(() => {
          this.getNearExpirations()
          this.getNotVisualizeds()
        })
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
      }, 300)
    },

    infiniteHandler(completed) {
      this.getTicketsNextPage().finally(completed)
    },

    handleNextTab() {
      if (this.activeTabIndex >= 0 && this.activeTabIndex < (this.tabs.length - 1)) {
        const { name } = this.tabs[this.activeTabIndex + 1]

        this.setTicketsActiveTab(name)
        this.setDisputesTab(this.activeTabIndex + 1)
      } else if (this.activeTabIndex === (this.tabs.length - 1)) {
        const { name } = this.tabs[0]

        this.setTicketsActiveTab(name)
        this.setDisputesTab(this.activeTabIndex - 1)
      }
    },

    handlePreviousTab() {
      if (this.activeTabIndex > 0 && this.activeTabIndex <= (this.tabs.length - 1)) {
        const { name } = this.tabs[this.activeTabIndex - 1]

        this.setTicketsActiveTab(name)
        this.setDisputesTab(this.activeTabIndex - 1)
      } else if (this.activeTabIndex === 0) {
        const { name } = this.tabs[this.tabs.length - 1]

        this.setTicketsActiveTab(name)
        this.setDisputesTab(this.tabs.length - 1)
      } else if (this.activeTabIndex === (this.tabs.length - 1)) {
        const { name } = this.tabs[0]

        this.setTicketsActiveTab(name)
        this.setDisputesTab(0)
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
@import '~projuris-acordos-theme/src/common/colors.scss';

.tickets-container {
  display: flex;
  flex-direction: column;

  .tickets-container__tabs {
    overflow-x: hidden !important;
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

  .tickets-container__visibility-button {
    position: absolute;
    top: calc(50vh - 40px);
    right: -20px;
    padding: 12px 0;
    border-radius: 0 6px 6px 0;
    border-color: $--color-light-gray;
    border-width: 2px 2px 2px 0;
    z-index: 99;
  }

  &.hide {
    width: 0 !important;
  }
}
</style>

<style lang="scss">
@import '~projuris-acordos-theme/src/common/colors.scss';

.tickets-container {
  position: relative;

  .left-arrow,
  .right-arrow {
    position: absolute;
    top: 0;
    cursor: pointer;
    z-index: 2;
    margin: 12px 0 0 0;

    & > i {
      font-size: 18px !important;
    }
  }

  .left-arrow {
    left: 0;
    margin-left: 4px;

    &.left-arrow-with-header {
      margin-top: 63px;
    }
  }

  .right-arrow {
    right: 0;

    &.right-arrow-with-header {
      margin-top: 63px;
    }
  }

  .tickets-container__tabs {
    height: 100%;
    overflow-x: hidden !important;

    .el-tabs__content {
      overflow: auto;
      height: 100%;

      .el-tab-pane {
        height: calc(100% - 26px);
      }
    }
  }

  .el-tabs__header {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin: 0;
    border-bottom: 2px solid $--color-light-gray;

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

  .tickets-container__management {
    width: calc(100vw - 58px);

    .jus-main-view__container {
      padding: 0 !important;

      .jus-main-view__main-card {
        box-shadow: none !important;
        border: none;

        .el-card__body {
          .view-management__filters {
            .view-management__tabs {
              .el-tabs__header {
                border: none;
                margin-bottom: 0;

                .el-tabs__nav-wrap {
                  .el-tabs__nav-scroll {
                    .el-tabs__nav {
                      .el-tabs__active-bar {
                        display: none;
                      }

                      .el-tabs__item.is-active {
                        border-bottom: solid $--color-primary 2px;
                      }

                      .el-tabs__item:not(.is-active) {
                        border-bottom: solid #f3f4f5 2px;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .tickets-container__visibility-button {
    i {
      color: $--color-black;
      font-size: 18px;
    }
  }
}
</style>
