<template>
  <div class="management-prescriptions">
    <el-button
      v-show="tab0"
      :type="ONLY_SMS_ENGAGEMENT ? 'primary' : ''"
      plain
      size="small"
      @click="handlePrescriptionClick('ONLY_SMS_ENGAGEMENT')">
      {{ $t('prescription.ONLY_SMS_ENGAGEMENT') }}
    </el-button>
    <el-button
      v-show="tab0"
      :type="ONLY_EMAIL_ENGAGEMENT ? 'primary' : ''"
      plain
      size="small"
      @click="handlePrescriptionClick('ONLY_EMAIL_ENGAGEMENT')">
      {{ $t('prescription.ONLY_EMAIL_ENGAGEMENT') }}
    </el-button>
    <el-button
      v-show="tab1"
      :type="HAS_ANSWER ? 'primary' : ''"
      plain
      size="small"
      @click="handlePrescriptionClick('HAS_ANSWER')">
      {{ $t('prescription.HAS_ANSWER') }}
    </el-button>
    <el-button
      v-show="tab1"
      :type="COUNTERPROPOSAL_UP_TO_20 ? 'primary' : ''"
      plain
      size="small"
      @click="handlePrescriptionClick('COUNTERPROPOSAL_UP_TO_20')">
      {{ $t('prescription.COUNTERPROPOSAL_UP_TO_20') }}
    </el-button>
    <el-button
      v-show="tab1"
      :type="COUNTERPROPOSAL_OVER_20 ? 'primary' : ''"
      plain
      size="small"
      @click="handlePrescriptionClick('COUNTERPROPOSAL_OVER_20')">
      {{ $t('prescription.COUNTERPROPOSAL_OVER_20') }}
    </el-button>
    <el-button
      v-show="tab1"
      :type="ONLY_VISUALIZED ? 'primary' : ''"
      plain
      size="small"
      @click="handlePrescriptionClick('ONLY_VISUALIZED')">
      {{ $t('prescription.ONLY_VISUALIZED') }}
    </el-button>
    <el-button
      v-show="tab3"
      :type="PENDING ? 'primary' : ''"
      plain
      size="small"
      @click="handlePrescriptionClick('PENDING')">
      {{ $t('prescription.PENDING') }}
    </el-button>
    <el-button
      v-show="tab3"
      :type="UNSETTLED_WITH_MESSAGES ? 'primary' : ''"
      plain
      size="small"
      @click="handlePrescriptionClick('UNSETTLED_WITH_MESSAGES')">
      {{ $t('prescription.UNSETTLED_WITH_MESSAGES') }}
    </el-button>
    <el-button
      v-show="tab2"
      :type="NO_DOCUMENT_TERM ? 'primary' : ''"
      plain
      size="small"
      @click="handlePrescriptionClick('NO_DOCUMENT_TERM')">
      {{ $t('prescription.NO_DOCUMENT_TERM') }}
    </el-button>
    <el-button
      v-show="tab2"
      :type="WITH_DOCUMENT_TERM ? 'primary' : ''"
      plain
      size="small"
      @click="handlePrescriptionClick('WITH_DOCUMENT_TERM')">
      {{ $t('prescription.WITH_DOCUMENT_TERM') }}
    </el-button>
    <el-button
      v-show="tab2"
      :type="PENDING_TO_SEND_SIGNING ? 'primary' : ''"
      plain
      size="small"
      @click="handlePrescriptionClick('PENDING_TO_SEND_SIGNING')">
      {{ $t('prescription.PENDING_TO_SEND_SIGNING') }}
    </el-button>
    <el-button
      v-show="tab2"
      :type="DOCUMENT_WAITING_SIGNATURES ? 'primary' : ''"
      plain
      size="small"
      @click="handlePrescriptionClick('DOCUMENT_WAITING_SIGNATURES')">
      {{ $t('prescription.DOCUMENT_WAITING_SIGNATURES') }}
    </el-button>
    <el-button
      v-show="tab2"
      :type="DOCUMENT_SIGNED ? 'primary' : ''"
      plain
      size="small"
      @click="handlePrescriptionClick('DOCUMENT_SIGNED')">
      {{ $t('prescription.DOCUMENT_SIGNED') }}
    </el-button>
    <el-button
      v-show="tab0 || tab3"
      :type="NAMESAKE ? 'primary' : ''"
      plain
      size="small"
      @click="handlePrescriptionClick('NAMESAKE')">
      {{ $t('prescription.NAMESAKE') }}
    </el-button>
    <el-button
      v-show="tab0 || tab1"
      :type="NO_UPPER_RANGE ? 'primary' : ''"
      plain
      size="small"
      @click="handlePrescriptionClick('NO_UPPER_RANGE')">
      {{ $t('prescription.NO_UPPER_RANGE') }}
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
  computed: {
    ONLY_SMS_ENGAGEMENT() {
      return this.hasPrescription('ONLY_SMS_ENGAGEMENT')
    },
    ONLY_EMAIL_ENGAGEMENT() {
      return this.hasPrescription('ONLY_EMAIL_ENGAGEMENT')
    },
    HAS_ANSWER() {
      return this.hasPrescription('HAS_ANSWER')
    },
    COUNTERPROPOSAL_UP_TO_20() {
      return this.hasPrescription('COUNTERPROPOSAL_UP_TO_20')
    },
    COUNTERPROPOSAL_OVER_20() {
      return this.hasPrescription('COUNTERPROPOSAL_OVER_20')
    },
    ONLY_VISUALIZED() {
      return this.hasPrescription('ONLY_VISUALIZED')
    },
    PENDING() {
      return this.hasPrescription('PENDING')
    },
    UNSETTLED_WITH_MESSAGES() {
      return this.hasPrescription('UNSETTLED_WITH_MESSAGES')
    },
    NO_DOCUMENT_TERM() {
      return this.hasPrescription('NO_DOCUMENT_TERM')
    },
    WITH_DOCUMENT_TERM() {
      return this.hasPrescription('WITH_DOCUMENT_TERM')
    },
    PENDING_TO_SEND_SIGNING() {
      return this.hasPrescription('PENDING_TO_SEND_SIGNING')
    },
    DOCUMENT_WAITING_SIGNATURES() {
      return this.hasPrescription('DOCUMENT_WAITING_SIGNATURES')
    },
    DOCUMENT_SIGNED() {
      return this.hasPrescription('DOCUMENT_SIGNED')
    },
    NAMESAKE() {
      return this.hasPrescription('NAMESAKE')
    },
    NO_UPPER_RANGE() {
      return this.hasPrescription('NO_UPPER_RANGE')
    },
    tab0() {
      return this.activeTab === '0'
    },
    tab1() {
      return this.activeTab === '1'
    },
    tab2() {
      return this.activeTab === '2'
    },
    tab3() {
      return this.activeTab === '3'
    },
  },
  methods: {
    ...mapGetters(['hasPrescription']),
    
    handlePrescriptionClick(prescription) {
      this.$store.commit('resetDisputeQueryPage')
      if (this[prescription]) {
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

<style lang="scss">
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
