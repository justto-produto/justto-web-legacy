<template>
  <div class="management-prescriptions">
    <el-button :type="hasAnswer ? 'primary' : ''" plain @click="handlePrescriptionClick('hasAnswer')">
      Com resposta
    </el-button>
    <el-button :type="counterproposalUpTo20 ? 'primary' : ''" plain @click="handlePrescriptionClick('counterproposalUpTo20')">
      Contraproposta (até 20%)
    </el-button>
    <el-button :type="counterproposalOver20 ? 'primary' : ''" plain @click="handlePrescriptionClick('counterproposalOver20')">
      Contraproposta (+20%)
    </el-button>
  </div>

</template>

<script>
export default {
  name: 'ManagementPrescriptions',
  computed: {
    hasAnswer () {
      return this.$store.getters.hasPrescription('hasAnswer')
    },
    counterproposalUpTo20 () {
      return this.$store.getters.hasPrescription('counterproposalUpTo20')
    },
    counterproposalOver20 () {
      return this.$store.getters.hasPrescription('counterproposalOver20')
    }
  },
  methods: {
    handlePrescriptionClick (prescription) {
      if (this[prescription]) this.$store.commit('removePrescription', prescription)
      else this.$store.commit('addPrescription', prescription)
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
