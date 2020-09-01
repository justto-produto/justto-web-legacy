<template>
  <div
    v-loading="$store.state.loading"
    class="campaign-step"
  >
    <h2 class="new-import-view__title">
      Configuração de campanhas
    </h2>
    <p>
      O sistema trabalha com o conceito de campanhas. Campanha é um agrupamento de
      disputas dentro da mesma importação com um réu em comum. Por isso, ao importar,
      o sistema automaticamente divide suas disputas em campanhas para que você possa
      configurá-las separadamente.
      <br><br><br>
    </p>
    <el-alert
      v-if="duplicatedDisputesLoading"
      :closable="false"
      type="info"
    >
      <div class="el-loading-parent--relative">
        <div class="el-loading-mask">
          <div class="el-loading-spinner">
            <svg
              viewBox="25 25 50 50"
              class="circular"
            >
              <circle
                cx="50"
                cy="50"
                r="20"
                fill="none"
                class="path"
              />
            </svg>
          </div>
        </div>
      </div>
      <div>
        <h2>Validação de duplicidade em andamento</h2>
        Aguarde um momento enquanto o sistema valida disputas duplicadas e expiradas.
      </div>
    </el-alert>
    <el-alert
      v-if="!duplicatedDisputesLoading && duplicatedDisputes.length"
      type="error"
    >
      <h2>Atenção!</h2>
      Foram encontradas disputa(s) duplicada(s) e/ou expirada(s):
      <ul
        v-for="(d, index) in duplicatedDisputes"
        :key="d.code + index"
      >
        <li>
          {{ d.code }} - Disputa
          <span v-if="d.status === 'DUPLICATE'">
            <strong>não será importada</strong> por duplicidade
            (campanha {{ d.duplicatedBy.campaignName }}).
          </span>
          <span v-if="d.status === 'DUPLICATED_DISPUTE' || d.status === 'DUPLICATE_AND_EXPIRED'">
            <strong>não será importada</strong> por duplicidade no sistema
            (campanha {{ d.duplicatedBy.campaignName }}).
          </span>
          <span v-if="d.status === 'DUPLICATED_ROW'">
            <strong>será importada apenas 1 vez</strong> pois está duplicada na planilha.
          </span>
          <span v-if="d.status === 'EXPIRED'">
            <strong>será importada</strong> com data já expirada
            ({{ d.expirationDate.dateTime | moment('DD/MM/YY') }}).
          </span>
        </li>
      </ul>
    </el-alert>
    <div class="import-view__container">
      <div
        v-if="!duplicatedDisputesLoading"
        class="import-view__content"
      >
        <jus-import-feedback-card
          v-for="(mappedCampaign, index) in mappedCampaigns"
          :key="mappedCampaign.cluster"
          :mapped-campaign.sync="mappedCampaign"
          :index="index + 1"
          data-testid="import-feedback"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'CampaignStep',
  components: {
    JusImportFeedbackCard: () => import('@/components/layouts/JusImportFeedbackCard'),
  },
  props: {
    campaignIsMapped: {
      type: Boolean,
      default: false,
    },
    mappedCampaigns: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      duplicatedDisputes: [],
      duplicatedDisputesLoading: true,
    }
  },
  computed: {
    ...mapGetters(['loading']),
  },
  watch: {
    campaignIsMapped(current) {
      if (current) {
        this.$store.dispatch('validateGeneseRunner').then(response => {
          this.duplicatedDisputes = response.disputes
        }).finally(() => (this.duplicatedDisputesLoading = false))
      }
    },
  },
  async beforeMount() {
    if (!this.$store.getters.strategyList.length) {
      this.showLoading()
      for (const round in [1, 2, 3, 4]) {
        if (this.loading) {
          this.$store.dispatch('getMyStrategies').then(() => {
            this.hideLoading()
          }).catch(() => {
            const fileName = this.$store.getters.importedFileName
            this.$jusSegment(`Tentativa ${round} de buscar as estratégias para a importação do arquivo ${fileName}.`)
            this.$jusNotification({
              type: 'info',
              title: 'OPS',
              message: 'Ainda trabalhando...',
            })
          })
        } else {
          return
        }
        await new Promise((resolve) => setTimeout(resolve, 4000))
      }
    }

    this.$store.dispatch('validateGeneseRunner').then(response => {
      this.duplicatedDisputes = response.disputes
    }).finally(() => (this.duplicatedDisputesLoading = false))
  },
  methods: {
    ...mapActions(['showLoading', 'hideLoading']),
  },
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
    &.el-alert--info {
      p {
        display: flex;
      }
      .el-loading-parent--relative  {
        width: 42px;
        margin-right: 20px;
        .el-loading-mask {
          background-color: transparent;
        }
      }
    }
  }
}
</style>
