<template>
  <div class="management-prescriptions">
    <el-button
      v-for="prescription in showedPrescriptions"
      v-show="prescription.tabs.includes(parseInt(activeTab, 10))"
      :ref="prescription.prescription"
      :key="prescription.prescription"
      :type="buttonType(prescription.prescription)"
      size="small"
      class="management-prescriptions__button"
      @click="handlePrescriptionClick(prescription.prescription)"
    >
      <div>
        <jus-icon
          :class="{ 'management-prescriptions__filter-icon--selected' : hasPrescription(prescription.prescription) }"
          class="management-prescriptions__filter-icon"
          icon="filter"
        />
        {{ prescription.description | capitalize }}
      </div>
    </el-button>

    <el-popover
      v-if="showHiddelPrescriptions"
      placement="bottom"
      width="400"
      popper-class="management-prescriptions__prescriptions-popover"
      class="management-prescriptions__popover-trigger"
      trigger="click"
    >
      <span
        v-for="prescription in hiddenPrescriptions"
        v-show="prescription.tabs.includes(parseInt(activeTab, 10))"
        :ref="prescription.prescription"
        :key="prescription.prescription"
        :class="{'management-prescriptions__button-active': hasPrescription(prescription.prescription)}"
        class="management-prescriptions__button"
        @click="handlePrescriptionClick(prescription.prescription)"
      >
        <jus-icon
          :class="{ 'management-prescriptions__filter-icon--selected' : hasPrescription(prescription.prescription) }"
          class="management-prescriptions__filter-icon"
          icon="filter"
        />

        {{ prescription.description | capitalize }}
      </span>

      <el-button
        slot="reference"
        size="small"
      >
        <JusIcon
          class="management-prescriptions__popover-icon"
          icon="zap"
        />
      </el-button>
    </el-popover>

    <jus-tags-filter @prescriptions:getDisputes="getDisputes" />

    <span
      v-if="hasPrescription('NEWLY_IMPORTED')"
      class="management-prescriptions__newly-imported-alert"
    >
      <b>*</b>Disputas importadas recentemente
      <a
        @click="handlePrescriptionClick('NEWLY_IMPORTED')"
      >
        (clique aqui para remover filtro)
      </a>
    </span>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'ManagementPrescriptions',
  components: {
    JusTagsFilter: () => import('@/components/others/JusTagsFilter')
  },
  props: {
    activeTab: {
      type: String,
      default: '2'
    }
  },
  computed: {
    ...mapGetters({
      hasPrescription: 'hasPrescription',
      prescriptions: 'prescriptionsList',
      recentPrescriptions: 'getRecentPrescriptions'
    }),

    mainPrescription() {
      return [
        'BILLING_TRANSACTION',
        'DOCUMENT_WAITING_SIGNATURES',
        //  'ENGAGEMENT',
        'ENGAGEMENT_WARN',
        //  'WITH_WHATSAPP_MESSAGE',
        'HAS_ANSWER',
        //  'COUNTERPROPOSAL_OVER_20',
        //  'COUNTERPROPOSAL_UP_TO_20',
        'FINISHED_WITH_MESSAGES',
        'NAMESAKE',
        //  'WITH_DOCUMENT_TERM',
        //  'ONLINE_PERSON',
        //  'PENDING_TO_SEND_SIGNING',
        'PENDING',
        'NEWLY_FINISHED',
        'NOT_ENGAGEMENT_WARN',
        //  'NO_UPPER_RANGE',
        'NO_DOCUMENT_TERM',
        //  'ONLY_SMS_ENGAGEMENT',
        'ONLY_EMAIL_ENGAGEMENT',
        //  'ONLY_VISUALIZED',
        'SUMMARY_TOTAL_TOTAL',
        'SUMMARY_TOTAL_WITH_WARN',
        'SUMMARY_TOTAL_WITHOUT_WARN',
        'DOCUMENT_SIGNED',
        'NO_PLAINTIFF_LAWYER',
        'OFFLINE_PERSON',
        'NEWLY_IMPORTED'
      ]
    },

    showedPrescriptions() {
      return this.prescriptions.filter(p => this.mainPrescription.includes(p.prescription) || this.recentPrescriptions.includes(p.prescription))
    },

    hiddenPrescriptions() {
      return this.prescriptions.filter(p => !this.mainPrescription.includes(p.prescription))
    },

    showHiddelPrescriptions() {
      return this.hiddenPrescriptions.filter(p => p.tabs.includes(parseInt(this.activeTab, 10))).length
    }
  },
  methods: {
    ...mapActions([
      'setTicketPrescription',
      'unsetTicketPrescription'
    ]),

    ...mapMutations([
      'setRecentPrescription',
      'addPrescription',
      'removePrescription'
    ]),

    handlePrescriptionClick(prescription) {
      this.$store.commit('resetDisputeQueryPage')
      if (this.hasPrescription(prescription)) {
        this.removePrescription(prescription)
        this.unsetTicketPrescription(prescription)
      } else {
        this.addPrescription(prescription)
        this.setRecentPrescription(prescription)
        this.setTicketPrescription(prescription)
        // SEGMENT TRACK
        const translatedPrescription = this.$t(`prescription.${prescription}`).toUpperCase()
        this.$jusSegment(`Filtro botão ${translatedPrescription}`)
      }
      this.getDisputes()
    },

    buttonType(name) {
      return this.hasPrescription(name) ? 'primary' : ''
    },

    getDisputes() {
      this.$emit('management:getDisputes')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~projuris-acordos-theme/src/common/colors.scss';

.management-prescriptions {
  margin: 6px 192px 6px 0px;
  display: flex;
  gap: 10px;

  .management-prescriptions__popover-trigger {
    /*margin-left: 10px;*/

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
  margin: auto 0 !important;

  &.el-button.is-plain:focus {
    color: #424242;
    background-color: #fff;
    border-color: #dcdfe6;
  }

  &.el-button.is-plain:hover {
    color: $--color-primary;
    border-color: $--color-primary;
  }

  &.el-button--primary.is-plain:focus {
    color: $--color-primary !important;
    background-color: #f4effe !important;
    border-color: #d4c0fc !important;
  }

  &.el-button--primary.is-plain:hover {
    color: $--color-primary !important;
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
@import '~projuris-acordos-theme/src/common/colors.scss';

.management-prescriptions__prescriptions-popover {
  padding: 4px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  .management-prescriptions__button {
    cursor: pointer;
    padding: 6px 24px;
    word-break: break-word;
    text-align: left;

    .management-prescriptions__filter-icon {
      display: none;
    }

    &:hover {
      background-color: #f3f4f5;

      .management-prescriptions__filter-icon {
        display: none;
      }
    }
  }

  .management-prescriptions__button-active {
    color: $--color-primary;
    font-weight: 600;

    .management-prescriptions__filter-icon {
      display: inline;
    }

    &:hover {
      .management-prescriptions__filter-icon {
        display: inline;
      }
    }
  }
}
</style>
