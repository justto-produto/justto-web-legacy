<template>
  <div class="management-prescriptions">
    <el-popover
      placement="bottom"
      width="400"
      popper-class="management-prescriptions__prescriptions-popover"
      class="management-prescriptions__popover-trigger"
      trigger="click"
    >
      <el-button
        v-for="prescription in prescriptions"
        v-show="prescription.tabs.includes(processedActiveTab)"
        :ref="prescription.prescription"
        :key="prescription.prescription"
        :type="buttonType(prescription.prescription)"
        plain
        size="small"
        class="management-prescriptions__button"
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
      </el-button>
      <el-button
        slot="reference"
        size="mini"
        type="text"
      >
        <JusIcon
          class="management-prescriptions__popover-icon"
          icon="filter"
        />
      </el-button>
    </el-popover>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ManagementPrescriptions',
  props: {
    activeTab: {
      type: String,
      default: 'running'
    }
  },
  computed: {
    ...mapGetters({
      hasPrescription: 'hasPrescription',
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
          return 3
        default:
          return 2
      }
    }
  },

  methods: {
    ...mapActions([
      'getTickets',
      'resetTicketsPage',
      'addTicketPrescription',
      'removeTicketPrescription'
    ]),

    handlePrescriptionClick(prescription) {
      this.setTicketsQuery({ key: 'page', value: 0 })

      if (this.ticketsPrescriptions.includes(prescription)) {
        this.removeTicketPrescription(prescription)
      } else {
        this.addTicketPrescription(prescription)
        const translatedPrescription = this.$t(`prescription.${prescription}`).toUpperCase()
        this.$jusSegment(`Filtro botão ${translatedPrescription}`)
      }
      this.getTickets()
    },

    buttonType(name) {
      return this.ticketsPrescriptions.includes(name) ? 'primary' : ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.management-prescriptions {
  margin: 0 6px;
  display: flex;

  .management-prescriptions__popover-trigger {
    margin-left: 10px;

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

.management-prescriptions__button {
  vertical-align: middle;

  &.el-button.is-plain:focus {
    color: #424242;
    background-color: #fff;
    border-color: #dcdfe6;
  }

  &.el-button.is-plain:hover {
    color: #9461f7;
    border-color: #9461f7;
  }

  &.el-button--primary.is-plain:focus {
    color: #9461f7 !important;
    background-color: #f4effe !important;
    border-color: #d4c0fc !important;
  }

  &.el-button--primary.is-plain:hover {
    color: #9461f7 !important;
    background-color: #f4effe !important;
    border-color: #d4c0fc !important;
  }

  .management-prescriptions__filter-icon {
    display: none;
    width: 12px;
    height: 12px;
    margin: -2px 0
  }

  &:hover .management-prescriptions__filter-icon {
    display: inline-block;
  }

  .management-prescriptions__filter-icon--selected {
    display: inline-block;
  }
}
</style>

<style lang="scss">
.management-prescriptions__prescriptions-popover {
  padding: 4px;

  .management-prescriptions__button {
    margin: 4px;
  }
}
</style>
