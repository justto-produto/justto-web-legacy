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
    <el-alert v-if="duplicatedDisputes.length" type="error">
      <h2>Atenção!</h2>
      Foram encontradas disputa(s) duplicada(s) e/ou expirada(s):
      <ul v-for="(d, index) in duplicatedDisputes" :key="d.code + index">
        <li>
          {{ d.code }} - Disputa
          <span v-if="d.status === 'DUPLICATE' || d.status === 'DUPLICATE_AND_EXPIRED'">
            <strong>não será importada</strong> por duplicidade
            (campanha {{ d.duplicatedBy.campaignName }}).
          </span>
          <span v-if="d.status === 'EXPIRED'">
            <strong>será importada</strong> com data já expirada
            ({{ d.expirationDate.dateTime | moment('DD/MM/YY') }}).
          </span>
        </li>
      </ul>
    </el-alert>
    <div class="import-view__container">
      <div class="import-view__content">
        <jus-import-feedback-card
          v-for="(mappedCampaign, index) in mappedCampaigns"
          :mapped-campaign.sync="mappedCampaign"
          :key="mappedCampaign.cluster"
          :index="index + 1"
          data-testid="import-feedback" />
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
      loading: false,
      duplicatedDisputes: []
    }
  },
  beforeMount () {
    if (!this.$store.getters.strategyList.length) {
      this.loading = true
      this.$store.dispatch('getStrategies').finally(() => {
        this.loading = false
      })
    }
    this.$store.dispatch('validateGeneseRunner').then(response => {
      this.duplicatedDisputes = response.disputes
    })
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
  .el-alert {
    margin-top: 20px;
    padding-bottom: 12px;
    .el-alert__content {
      width: 100%;
    }
    h2 {
      margin: 0 0 10px;
    }
    p {
      font-size: 14px;
    }
    ul {
      padding-left: 14px;
    }
  }
}
</style>
