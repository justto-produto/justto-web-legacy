<template>
  <div class="management-prescriptions">
    <el-button
      v-for="prescription in prescriptions"
      v-show="prescription.tabs.includes(parseInt(activeTab, 10))"
      :ref="prescription.prescription"
      :key="prescription.prescription"
      :type="buttonType(prescription.prescription)"
      plain
      size="small"
      @click="handlePrescriptionClick(prescription.prescription)"
    >
      {{ prescription.description | capitalize }}
    </el-button>
    <jus-tags-filter
      v-if="activeTab !== '-1'"
      @prescriptions:getDisputes="getDisputes"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ManagementPrescriptions',
  components: {
    JusTagsFilter: () => import('@/components/others/JusTagsFilter'),
  },
  props: {
    activeTab: {
      default: '1',
      type: String,
    },
  },
  computed: {
    ...mapGetters({
      hasPrescription: 'hasPrescription',
      prescriptions: 'prescriptionsList',
    }),
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
    },
  },
}
</script>

<style lang="scss" scoped>
.management-prescriptions {
  margin: 6px 192px 6px 0px;
  display: flex;

  .el-button + .el-button {
    &:focus {
      color: #424242;
      background: #fff;
      border-color: #dcdfe6;
    }
  }

  .el-button--primary.is-plain {
    &:focus {
      color: #9461f7;
      background-color: #f4effe;
      border-color: #d4c0fc;
    }
  }
}
</style>
