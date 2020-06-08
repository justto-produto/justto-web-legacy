<template>
  <div class="management-prescriptions">
    <el-button
      v-for="prescription in prescriptions"
      v-show="prescription.tabs.includes(activeTab)"
      :key="prescription.name"
      :type="hasPrescription(prescription.name) ? 'primary' : ''"
      plain
      size="small"
      @click="handlePrescriptionClick(prescription.name)">
      {{ $t(`prescription.${prescription.name}`) | capitalize }}
    </el-button>
    <jus-tags-filter @prescriptions:getDisputes="getDisputes" />
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
  data() {
    return {
      prescriptions: [
        { name: 'ONLY_SMS_ENGAGEMENT', tabs: ['0'] },
        { name: 'ONLY_EMAIL_ENGAGEMENT', tabs: ['0'] },
        { name: 'HAS_ANSWER', tabs: ['1'] },
        { name: 'COUNTERPROPOSAL_UP_TO_20', tabs: ['1'] },
        { name: 'COUNTERPROPOSAL_OVER_20', tabs: ['1'] },
        { name: 'ONLY_VISUALIZED', tabs: ['1'] },
        { name: 'NO_DOCUMENT_TERM', tabs: ['2'] },
        { name: 'PENDING_TO_SEND_SIGNING', tabs: ['2'] },
        { name: 'DOCUMENT_WAITING_SIGNATURES', tabs: ['2'] },
        { name: 'DOCUMENT_SIGNED', tabs: ['2'] },
        { name: 'PENDING', tabs: ['3'] },
        { name: 'UNSETTLED_WITH_MESSAGES', tabs: ['3'] },
        { name: 'NAMESAKE', tabs: ['0', '3'] },
        { name: 'NO_UPPER_RANGE', tabs: ['0', '1'] },
      ],
    }
  },
  computed: {
    ...mapGetters(['hasPrescription']),
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
  .el-button--primary.is-plain:focus {
    color: #9461f7;
    background: #f4effe;
    border-color: #d4c0fc;
  }
}
</style>
