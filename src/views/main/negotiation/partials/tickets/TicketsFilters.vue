<template>
  <div class="management-prescriptions">
    <el-popover
      placement="bottom"
      width="328"
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
        <div class="management-prescriptions__advanced-filters">
          <el-button
            :type="ticketsHasFilters ? 'primary' : ''"
            class="management-prescriptions__list-item-button"
            @click="openAdvancedFiltersDialog"
          >
            Filtros avançados
          </el-button>

          <TicketsTagsFilters @ticket:getDisputes="$emit('ticket:getDisputes', $event)" />
        </div>
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

    <ManagementFilters
      ref="managementFilters"
      :tab-index="String(processedActiveTab)"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  name: 'TicketsFilters',
  components: {
    // TicketsAdvancedFilters: () => import('./TicketsAdvancedFilters'),
    TicketsTagsFilters: () => import('./TicketsTagsFilters'),
    ManagementFilters: () => import('@/views/main/management/partials/ManagementFilters')
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
      return { 'pre-negotiation': 0, engagement: 1, running: 2, accepted: 3, finished: 4 }[this.activeTab] || 2
    }
  },
  methods: {
    ...mapActions([
      'getTickets',
      'getTicketsFilteredTags',
      'resetTicketsPage',
      'setTicketPrescription',
      'unsetTicketPrescription',
      'setTicketsQuery'
    ]),

    ...mapMutations([
      'updateDisputeQuery',
      'resetDisputeQueryPage',
      'removePrescription',
      'setRecentPrescription',
      'addPrescription'
    ]),

    openAdvancedFiltersDialog() {
      // Filtro de Tickets.
      // this.$refs.advancedFilters.openDialog()

      // Filtro do Management.
      this.$refs.managementFilters.openDialog()
    },

    handlePrescriptionClick(prescription) {
      this.setTicketsQuery({ key: 'page', value: 0 })
      this.resetDisputeQueryPage()

      if (this.ticketsPrescriptions.includes(prescription)) {
        this.unsetTicketPrescription(prescription)
        this.removePrescription(prescription)
      } else {
        this.setTicketPrescription(prescription)
        this.addPrescription(prescription)
        this.setRecentPrescription(prescription)
        const translatedPrescription = this.$t(`prescription.${prescription}`).toUpperCase()
        this.$jusSegment(`Filtro botão ${translatedPrescription}`)
      }

      this.getTickets()
      this.getTicketsFilteredTags()
      this.$emit('ticket:getDisputes')
    },

    buttonType(name) {
      return this.ticketsPrescriptions.includes(name) ? 'primary' : ''
    },

    hasPrescription(prescription) {
      return (this.ticketsQuery?.prescriptions || []).includes(prescription)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~projuris-acordos-theme/src/common/colors.scss';

.management-prescriptions {
  margin: 0 10px;

  .management-prescriptions__popover-trigger {
    .management-prescriptions__popover-button:not(.el-button--primary) {
      border: 1px solid $--color-light-gray;
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
@import '~projuris-acordos-theme/src/common/colors.scss';

.management-prescriptions__prescriptions-popover {
  padding: 6px 0;

  .management-prescriptions__list {
    list-style: none;
    padding: 0;
    margin: 0;

    .management-prescriptions__advanced-filters {
      margin: 6px 24px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .management-prescriptions__list-item {
      cursor: pointer;
      padding: 6px 24px;
      word-break: break-word;
      text-align: left;

      &:hover {
        background-color: $--color-light-gray;
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
