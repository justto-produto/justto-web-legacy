<template>
  <div v-loading="loading" class="campaign-step">
    <h2 class="new-import-view__title">Configuração de campanhas</h2>
    <p>
      O sistema trabalha com o conceito de campanhas. Campanha é um agrupamento de
      disputas dentro da mesma importação com um réu em comum. Por isso, ao importar,
      o sistema automaticamente divide suas disputas em campanhas para que você possa
      configurá-las separadamente.
      <br>
    </p>
    <div class="import-view__container">
      <div class="import-view__content">
        <jus-import-feedback-card
          v-for="(mappedCampaign, index) in mappedCampaigns"
          :mapped-campaign.sync="mappedCampaign"
          :key="mappedCampaign.cluster"
          :index="index + 1"
          :color="colors[index]"
          data-testid="import-feedback"/>
      </div>
    </div>
  </div>
</template>

<script>
import JusImportFeedbackCard from '@/components/layouts/JusImportFeedbackCard'

export default {
  name: 'CampaignStep',
  components: {
    JusImportFeedbackCard
  },
  props: {
    mappedCampaigns: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      colors: [
        '#ff7a72', '#72cbff', '#88ff59', '#ff7a72',
        '#72cbff', '#88ff59', '#ff7a72', '#72cbff',
        '#88ff59', '#ff7a72', '#72cbff', '#88ff59',
        '#ff7a72', '#72cbff', '#88ff59', '#ff7a72'
      ],
      loading: false
    }
  },
  beforeMount () {
    if (!this.$store.getters.strategyList.length) {
      this.loading = true
      this.$store.dispatch('getStrategies').finally(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
.campaign-step {
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
