<template>
  <div  class="management-prescriptions">
    <div v-if="activeTab === '1'">
      <el-button :type="HAS_ANSWER ? 'primary' : ''" plain @click="handlePrescriptionClick('HAS_ANSWER')">
        Com resposta
      </el-button>
      <el-button :type="COUNTERPROPOSAL_UP_TO_20 ? 'primary' : ''" plain @click="handlePrescriptionClick('COUNTERPROPOSAL_UP_TO_20')">
        Contraproposta (até 20%)
      </el-button>
      <el-button :type="COUNTERPROPOSAL_OVER_20 ? 'primary' : ''" plain @click="handlePrescriptionClick('COUNTERPROPOSAL_OVER_20')">
        Contraproposta (+20%)
      </el-button>
      <el-button :type="ONLY_VISUALIZED ? 'primary' : ''" plain @click="handlePrescriptionClick('ONLY_VISUALIZED')">
        Somente visualizados
      </el-button>
    </div>
    <div v-if="activeTab === '3'">
      <el-button :type="PENDING ? 'primary' : ''" plain @click="handlePrescriptionClick('PENDING')">
        Pendentes
      </el-button>
      <el-button :type="UNSETTLED_WITH_MESSAGES ? 'primary' : ''" plain @click="handlePrescriptionClick('UNSETTLED_WITH_MESSAGES')">
        Perdidos com Mensagem
      </el-button>
    </div>
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
    }
  },
  methods: {
    handlePrescriptionClick (prescription) {
      if (this[prescription]) {
        this.$store.commit('removePrescription', prescription)
      } else {
        this.$store.commit('addPrescription', prescription)
        // SEGMENT TRACK
        switch (prescription) {
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
        }
      }
      this.$emit('management:getDisputes')
    }
  }
}
</script>

<style lang="scss">
.management-prescriptions {
  margin: 10px 0;
  .el-button--primary.is-plain:focus {
    color: #9461f7;
    background: #f4effe;
    border-color: #d4c0fc;
  }
}
</style>
