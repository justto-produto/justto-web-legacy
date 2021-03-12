<template>
  <div class="management-prescriptions">
    <el-popover
      placement="bottom"
      width="300"
      popper-class="management-prescriptions__prescriptions-popover"
      class="management-prescriptions__popover-trigger"
      trigger="click"
    >
      <ul class="management-prescriptions__list">
        <li
          v-for="prescription in prescriptions"
          v-show="prescription.tabs.includes(processedActiveTab)"
          :ref="prescription.prescription"
          :key="prescription.prescription"
          :class="{ 'management-prescriptions__list-item--selected': hasPrescription(prescription.prescription) }"
          class="management-prescriptions__list-item"
          @click="handlePrescriptionClick(prescription.prescription)"
        >
          <div>
            <JusIcon
              :class="{ 'management-prescriptions__filter-icon--selected' : hasPrescription(prescription.prescription) }"
              class="management-prescriptions__filter-icon"
              icon="filter"
            />
            {{ prescription.description | capitalize }}
          </div>
        </li>
        <el-button
          :type="ticketsHasFilters ? 'primary' : ''"
          class="management-prescriptions__list-item-button"
          @click="openAdvancedFiltersDialog"
        >
          Filtros avançados
        </el-button>
        <!-- <li
          ref="advancedFilters"
          :class="{ 'management-prescriptions__list-item--selected': hasPrescription('advancedFilters') }"
          class="management-prescriptions__list-item"
          @click="openAdvancedFiltersDialog"
        >
          <div>
            <JusIcon
              :class="{ 'management-prescriptions__filter-icon--selected' : hasPrescription('advancedFilters') }"
              class="management-prescriptions__filter-icon"
              icon="filter"
            />
            Filtros avançados
          </div>
        </li> -->
      </ul>
      <el-button
        slot="reference"
        :type="ticketsHasFilters || ticketsPrescriptions.length ? 'primary' : ''"
        size="mini"
        class="management-prescriptions__popover-button"
      >
        <JusIcon
          class="management-prescriptions__popover-icon"
          icon="filter"
        />
      </el-button>
    </el-popover>
    <TicketsAdvancedFilters
      ref="advancedFilters"
      :active-tab="activeTab"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TicketsFilters',
  components: {
    TicketsAdvancedFilters: () => import('./TicketsAdvancedFilters')
  },
  props: {
    activeTab: {
      type: String,
      default: 'running'
    }
  },
  computed: {
    ...mapGetters({
      ticketsQuery: 'getTicketsQuery',
      ticketsHasFilters: 'getTicketsHasFilters',
      ticketsPrescriptions: 'getTicketsPrescriptions',
      prescriptions: 'prescriptionsList'
    }),

    processedActiveTab() {
      switch (this.activeTab) {
        case 'pre-negotiation':
          return 0
        case 'engagement':
          return 1
        case 'running':
          return 2
        case 'accepted':
          return 3
        case 'finished':
          return 4
        default:
          return 2
      }
    }
  },
  methods: {
    ...mapActions([
      'getTickets',
      'resetTicketsPage',
      'setTicketPrescription',
      'unsetTicketPrescription',
      'setTicketsQuery'
    ]),

    openAdvancedFiltersDialog() {
      this.$refs.advancedFilters.openDialog()
    },

    handlePrescriptionClick(prescription) {
      this.setTicketsQuery({ key: 'page', value: 0 })

      if (this.ticketsPrescriptions.includes(prescription)) {
        this.unsetTicketPrescription(prescription)
      } else {
        this.setTicketPrescription(prescription)
        const translatedPrescription = this.$t(`prescription.${prescription}`).toUpperCase()
        this.$jusSegment(`Filtro botão ${translatedPrescription}`)
      }
      this.getTickets()
    },

    buttonType(name) {
      return this.ticketsPrescriptions.includes(name) ? 'primary' : ''
    },

    hasPrescription(prescription) {
      return this.ticketsQuery.prescriptions.includes(prescription)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.management-prescriptions {
  margin: 0 10px;

  .management-prescriptions__popover-trigger {
    .management-prescriptions__popover-button:not(.el-button--primary) {
      border: 1px solid $--light-gray;
      &:hover, &:focus { border-color: $--color-primary-light-8; }
    }
    .management-prescriptions__popover-icon {
      width: 14px
    }
  }

  .management-prescriptions__newly-imported-alert {
    width: 240px;
    font-size: 13px;
    color: $--color-text-secondary;
    a { margin-left: 5px; }
  }
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

.management-prescriptions__prescriptions-popover {
  padding: 6px 0;

  .management-prescriptions__list {
    list-style: none;
    padding: 0;
    margin: 0;
    .management-prescriptions__list-item-button {
      margin: 6px 24px 12px;
      width: calc(100% - 48px);
    }

    .management-prescriptions__list-item {
      cursor: pointer;
      padding: 6px 24px;
      word-break: break-word;
      text-align: left;

      &:hover {
        background-color: $--light-gray;
      }

      &--selected {
        color: $--color-primary;
        font-weight: 600;
      }
    }

    .management-prescriptions__filter-icon {
      display: none;
      width: 12px;
      height: 12px;
      margin: -1px 0;

      &--selected {
        display: inline-block;
      }
    }
  }
}
</style>
