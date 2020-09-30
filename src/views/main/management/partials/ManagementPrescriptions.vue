<template>
  <div class="management-prescriptions">
    <el-button
      v-for="prescription in prescriptions"
      v-show="prescription.tabs.includes(parseInt(activeTab, 10))"
      :ref="prescription.prescription"
      :key="prescription.prescription"
      :type="buttonType(prescription.prescription)"
      plain
      class="management-prescriptions__button"
      size="small"
      @click="handlePrescriptionClick(prescription.prescription)"
    >
      <el-tooltip :content="`Filtrar por ${prescription.description}`">
        <div>
          <jus-icon
            :class="{ 'management-prescriptions__filter-icon--selected' : hasPrescription(prescription.prescription) }"
            class="management-prescriptions__filter-icon"
            icon="filter"
          />
          {{ prescription.description | capitalize }}
        </div>
      </el-tooltip>
    </el-button>

    <jus-tags-filter @prescriptions:getDisputes="getDisputes" />

    <span
      v-if="hasPrescription('NEWLY_IMPORTED')"
      class="management-prescriptions__newly-imported-alert">
      <b>*</b>Disputas importadas recentemente
      <a
        href="#"
        @click="handlePrescriptionClick('NEWLY_IMPORTED')">
        (clique aqui para remover filtro)
      </a>
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ManagementPrescriptions',
  components: {
    JusTagsFilter: () => import('@/components/others/JusTagsFilter')
  },
  props: {
    activeTab: {
      default: '1',
      type: String
    }
  },
  computed: {
    ...mapGetters({
      hasPrescription: 'hasPrescription',
      prescriptions: 'prescriptionsList'
    })
  },
  methods: {
    handlePrescriptionClick(prescription) {
      this.$store.commit('resetDisputeQueryPage')
      if (this.hasPrescription(prescription)) {
        this.$store.commit('removePrescription', prescription)
      } else {
        this.$store.commit('addPrescription', prescription)
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
@import '@/styles/colors.scss';

.management-prescriptions {
  margin: 6px 192px 6px 0px;
  display: flex;

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

  .management-prescriptions__newly-imported-alert {
    width: 240px;
    font-size: 13px;
    color: $--color-text-secondary;
    a { margin-left: 5px; }
  }
}
</style>
