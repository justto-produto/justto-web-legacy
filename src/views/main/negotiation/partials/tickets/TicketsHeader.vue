<template>
  <header class="tickets-header-container">
    <el-autocomplete
      ref="searchInput"
      v-model="searchTerm"
      :min="3"
      :trigger-on-focus="false"
      :fetch-suggestions="handleInput"
      :debounce="800"
      size="small"
      class="tickets-header-container__input"
      prefix-icon="el-icon-search"
      popper-class="tickets-header-container__popover"
      placeholder="Busque sua disputa..."
    >
      <template #default="{ item }">
        <JusDisputeResume
          v-if="item.id"
          :dispute="item"
          @click="goToTicket"
        />
        <span v-else>
          Não foram encontradas disputas para esta busca.
        </span>
      </template>
    </el-autocomplete>

    <TicketsFilters
      v-if="(['ticket', 'negotiation'].includes($route.name) && ticketListMode !== 'MANAGEMENT' && !isToHideTickets)"
      :active-tab="activeTab"
      @ticket:getDisputes="$emit('ticket:getDisputes')"
    />
  </header>
</template>

<script>
import events from '@/constants/negotiationEvents'
import { eventBus } from '@/utils'

import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'TicketsHeader',

  components: {
    TicketsFilters: () => import('./TicketsFilters'),
    JusDisputeResume: () => import('@/components/layouts/JusDisputeResume')
  },

  props: {
    targetPath: {
      type: String,
      default: 'management/dispute'
    }
  },

  data: () => ({
    searchTerm: '',
    debounce: null
  }),

  computed: {
    ...mapGetters({
      ticketListMode: 'getTicketListMode',
      isToHideTickets: 'isToHideTickets',
      activeTab: 'getTicketsActiveTab'
    }),

    showFilters() {
      return (this.$route?.fullPath || '').includes('/negotiation')
    }
  },

  beforeMount() {
    this.getPrescriptions()
  },
  mounted() {
    eventBus.$on(events.SEARCH_FOCUS.callback, this.focusOnSearch)
  },

  beforeDestroy() {
    eventBus.$off(events.SEARCH_FOCUS.callback, this.focusOnSearch)
  },

  methods: {
    ...mapActions([
      'searchDisputes',
      'getPrescriptions'
    ]),

    handleInput(term, cb) {
      if (term.trim().length) {
        clearTimeout(this.debounce)

        this.debounce = setTimeout(() => {
          this.searchDisputes({ key: 'term', value: term.trim() })
            .then(response => {
              this.$jusSegment('Busca global de disputas', { description: `Termo utilizado: ${term}` })
              if (response.length) cb(response)
              else cb([{}])
            })
        }, 800)
      } else {
        cb([{}])
      }
    },

    goToTicket({ disputeId }) {
      if (this.$route.name === 'dispute') {
        this.$router.push(`/${this.targetPath}/${disputeId}`)
        window.location.reload(false)
      } else {
        this.$router.push(`/${this.targetPath}/${disputeId}`)
      }
    },

    focusOnSearch() {
      if (this.$refs.searchInput) {
        this.$refs.searchInput.focus()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~projuris-acordos-theme/src/common/colors.scss';

.tickets-header-container {
  padding: 0;
  display: flex;
  align-items: center;

  .tickets-header-container__input {
    padding: 12px;
    width: 100%;
  }
}

@media (max-height: 900px) {
  .tickets-header-container {
    .tickets-header-container__input {
      padding: 8px;
    }
  }
}
</style>

<style lang="scss">
.tickets-header-container__popover {
  width: calc(100% - ((48px + 18px) * 2)) !important;
}

.tickets-header-container {
  .tickets-header-container__input {
    .el-input__inner {
      border: none !important;
    }
  }
}
@media (max-width: 900px) {
  .tickets-header-container__popover {
    width: calc(100% - (12px * 2)) !important;
  }
}
</style>
