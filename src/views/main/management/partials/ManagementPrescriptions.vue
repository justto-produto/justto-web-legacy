<template>
  <div class="management-prescriptions">
    <el-button :type="HAS_ANSWER ? 'primary' : ''" plain @click="handlePrescriptionClick('HAS_ANSWER')">
      Com resposta
    </el-button>
    <el-button :type="COUNTERPROPOSAL_UP_TO_20 ? 'primary' : ''" plain @click="handlePrescriptionClick('COUNTERPROPOSAL_UP_TO_20')">
      Contraproposta (até 20%)
    </el-button>
    <el-button :type="COUNTERPROPOSAL_OVER_20 ? 'primary' : ''" plain @click="handlePrescriptionClick('COUNTERPROPOSAL_OVER_20')">
      Contraproposta (+20%)
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'ManagementPrescriptions',
  computed: {
    HAS_ANSWER () {
      return this.$store.getters.hasPrescription('HAS_ANSWER')
    },
    COUNTERPROPOSAL_UP_TO_20 () {
      return this.$store.getters.hasPrescription('COUNTERPROPOSAL_UP_TO_20')
    },
    COUNTERPROPOSAL_OVER_20 () {
      return this.$store.getters.hasPrescription('COUNTERPROPOSAL_OVER_20')
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
