<template>
  <div class="feedback-step">
    <h2 class="new-import-view__title">Resumo</h2>
    <p>
      Agrupamos seus casos por empresas. Cada empresa possui a sua Campanha, que você poderá, posteriormente, editar
      as existentes ou criar novas Campanhas.
      <br><br>
      <a href="#">Entenda o que são, e como funcionam as Campanhas.</a>
    </p>
    <div class="import-view__container">
      <div class="import-view__content">
        <jus-import-feedback-card
          v-for="(company, index) in companies"
          :company="company"
          :key="`${company.name}-${company.indexes}`"
          :color="colors[index]"
        />
      </div>
    </div>
  </div>
</template>

<script>
import JusImportFeedbackCard from '@/components/layouts/JusImportFeedbackCard'

export default {
  name: 'FeedbackStep',
  components: {
    JusImportFeedbackCard
  },
  props: {
    companies: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      colors: [
        '#ff7a72',
        '#72cbff',
        '#88ff59'
      ]
    }
  },
  beforeMount () {
    this.$store.dispatch('getCampaigns')
    this.$store.dispatch('getStrategies')
  }
}
</script>

<style lang="scss">
.feedback-step {
  >p {
    text-align: center;
    max-width: 600px;
    margin: auto;
  }
  .import-view__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .el-input__prefix {
    font-size: 1.3rem;
    left: 10px;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 40px;
  }
  .el-input--suffix .el-input__inner {
    padding-right: 40px;
  }
}
</style>
