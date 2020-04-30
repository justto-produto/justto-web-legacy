<template>
  <div class="management-prescriptions">
    <el-button v-show="tab0" :type="ONLY_SMS_ENGAGEMENT ? 'primary' : ''" plain size="small" @click="handlePrescriptionClick('ONLY_SMS_ENGAGEMENT')">
      Somente SMS
    </el-button>
    <el-button v-show="tab0" :type="ONLY_EMAIL_ENGAGEMENT ? 'primary' : ''" plain size="small" @click="handlePrescriptionClick('ONLY_EMAIL_ENGAGEMENT')">
      Somente Email
    </el-button>
    <el-button v-show="tab1" :type="HAS_ANSWER ? 'primary' : ''" plain size="small" @click="handlePrescriptionClick('HAS_ANSWER')">
      Com resposta
    </el-button>
    <el-button v-show="tab1" :type="COUNTERPROPOSAL_UP_TO_20 ? 'primary' : ''" plain size="small" @click="handlePrescriptionClick('COUNTERPROPOSAL_UP_TO_20')">
      Contraproposta (até 20%)
    </el-button>
    <el-button v-show="tab1" :type="COUNTERPROPOSAL_OVER_20 ? 'primary' : ''" plain size="small" @click="handlePrescriptionClick('COUNTERPROPOSAL_OVER_20')">
      Contraproposta (+20%)
    </el-button>
    <el-button v-show="tab1" :type="ONLY_VISUALIZED ? 'primary' : ''" plain size="small" @click="handlePrescriptionClick('ONLY_VISUALIZED')">
      Somente visualizados
    </el-button>
    <el-button v-show="tab3" :type="PENDING ? 'primary' : ''" plain size="small" @click="handlePrescriptionClick('PENDING')">
      Pendentes
    </el-button>
    <el-button v-show="tab3" :type="UNSETTLED_WITH_MESSAGES ? 'primary' : ''" plain size="small" @click="handlePrescriptionClick('UNSETTLED_WITH_MESSAGES')">
      Perdidos com Mensagem
    </el-button>
    <el-button v-show="tab0 || tab3" :type="NAMESAKE ? 'primary' : ''" plain size="small" @click="handlePrescriptionClick('NAMESAKE')">
      Homônimos
    </el-button>
    <el-button v-show="tab0 || tab1" :type="NO_UPPER_RANGE ? 'primary' : ''" plain size="small" @click="handlePrescriptionClick('NO_UPPER_RANGE')">
      Sem alçada máxima
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'ManagementPrescriptions',
  props: {
    activeTab: {
      default: '1',
      type: String
    }
  },
  computed: {
    ONLY_SMS_ENGAGEMENT () {
      return this.$store.getters.hasPrescription('ONLY_SMS_ENGAGEMENT')
    },
    ONLY_EMAIL_ENGAGEMENT () {
      return this.$store.getters.hasPrescription('ONLY_EMAIL_ENGAGEMENT')
    },
    HAS_ANSWER () {
      return this.$store.getters.hasPrescription('HAS_ANSWER')
    },
    COUNTERPROPOSAL_UP_TO_20 () {
      return this.$store.getters.hasPrescription('COUNTERPROPOSAL_UP_TO_20')
    },
    COUNTERPROPOSAL_OVER_20 () {
      return this.$store.getters.hasPrescription('COUNTERPROPOSAL_OVER_20')
    },
    ONLY_VISUALIZED () {
      return this.$store.getters.hasPrescription('ONLY_VISUALIZED')
    },
    PENDING () {
      return this.$store.getters.hasPrescription('PENDING')
    },
    UNSETTLED_WITH_MESSAGES () {
      return this.$store.getters.hasPrescription('UNSETTLED_WITH_MESSAGES')
    },
    NAMESAKE () {
      return this.$store.getters.hasPrescription('NAMESAKE')
    },
    NO_UPPER_RANGE () {
      return this.$store.getters.hasPrescription('NO_UPPER_RANGE')
    },
    tab0 () {
      return this.activeTab === '0'
    },
    tab1 () {
      return this.activeTab === '1'
    },
    tab2 () {
      return this.activeTab === '2'
    },
    tab3 () {
      return this.activeTab === '3'
    }
  },
  methods: {
    handlePrescriptionClick (prescription) {
      this.$store.commit('resetDisputeQueryPage')
      if (this[prescription]) {
        this.$store.commit('removePrescription', prescription)
      } else {
        this.$store.commit('addPrescription', prescription)
        // SEGMENT TRACK
        switch (prescription) {
          case 'ONLY_SMS_ENGAGEMENT':
            this.$jusSegment('Filtro botão ENGAJAMENTO COM SMS')
            break
          case 'ONLY_EMAIL_ENGAGEMENT':
            this.$jusSegment('Filtro botão ENGAJAMENTO COM EMAIL')
            break
          case 'HAS_ANSWER':
            this.$jusSegment('Filtro botão COM RESPOSTA')
            break
          case 'COUNTERPROPOSAL_UP_TO_20':
            this.$jusSegment('filtro botão CONTRAPROPOSTA ATÉ 20%')
            break
          case 'COUNTERPROPOSAL_OVER_20':
            this.$jusSegment('filtro botão CONTRAPROPOSTA ACIMA 20%')
            break
          case 'ONLY_VISUALIZED':
            this.$jusSegment('filtro botão APENAS VISIALIZADOS')
            break
          case 'PENDING':
            this.$jusSegment('filtro botão PENDENTES')
            break
          case 'UNSETTLED_WITH_MESSAGES':
            this.$jusSegment('filtro botão PERDIDOS COM MENSAGEM')
            break
          case 'NAMESAKE':
            this.$jusSegment('filtro botão HOMÔNIMOS')
            break
          case 'NO_UPPER_RANGE':
            this.$jusSegment('filtro botão SEM ALÇADA MÁXIMA')
            break
        }
      }
      this.$emit('management:getDisputes')
    }
  }
}
</script>

<style lang="scss">
.management-prescriptions {
  margin: 6px 0;
  .el-button--primary.is-plain:focus {
    color: #9461f7;
    background: #f4effe;
    border-color: #d4c0fc;
  }
}
</style>
