<template>
  <header class="tickets-header-container">
    <el-autocomplete
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
      <template slot-scope="{ item }">
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
      v-if="$route.name === 'ticket'"
      :active-tab="activeTab"
    />
  </header>
</template>

<script>
import { mapActions } from 'vuex'

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
    },
    activeTab: {
      type: String,
      default: 'running'
    }
  },
  data: () => ({
    searchTerm: '',
    debounce: setTimeout()
  }),
  computed: {
    showFilters() {
      return (this.$route?.fullPath || '').includes('/negotiation')
    }
  },
  beforeMount() {
    this.getPrescriptions()
  },
  methods: {
    ...mapActions([
      'searchDisputes',
      'getPrescriptions'
    ]),

    handleInput(term, cb) {
      clearTimeout(this.debounce)

      this.debounce = setTimeout(() => {
        this.searchDisputes({ key: 'term', value: term.trim() })
          .then(response => {
            this.$jusSegment('Busca global de disputas', { description: `Termo utilizado: ${term}` })
            if (response.length) cb(response)
            else cb([{}])
          })
      }, 800)
    },

    goToTicket({ disputeId, disputeStatus }) {
      this.$router.push(`/${this.targetPath}/${disputeId}`)
      this.$emit('set-tab', disputeStatus)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.tickets-header-container {
  padding: 0;
  display: flex;
  align-items: center;

  .tickets-header-container__input {
    padding: 12px;
    width: 100%;
  }
}

@media (max-height: 680px) {
  .tickets-header-container {
    .tickets-header-container__input {
      padding: 5px;
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
