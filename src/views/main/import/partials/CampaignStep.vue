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
      v-if="validationInProgress"
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
      v-if="!strategyList.length && !loadingStrategies"
      :closable="false"
      type="error"
    >
      <div>
        <h2>Atenção.</h2>
        <p>
          Estratégias não encontradas.
          Tente novamente clicando
          <el-button
            type="text"
            @click="getStrategies"
          >
            aqui
          </el-button>.
        </p>
      </div>
    </el-alert>
    <el-alert
      v-if="!strategyList.length && loadingStrategies"
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
        <h2>Carregando estratégias</h2>
        <span>Aguarde um momento enquanto o sistema carrega as estratégias disponíveis para esta campanha.</span>
      </div>
    </el-alert>
    <el-alert
      v-if="!validationInProgress && duplicatedDisputes.length"
      type="error"
    >
      <h2>Atenção!</h2>

      <div v-if="summaryWarnings.duplicated || summaryWarnings.expired">
        <span v-if="summaryWarnings.duplicated">
          - Encontramos {{ summaryWarnings.duplicated }} registro<span v-if="summaryWarnings.duplicated > 1">s</span> duplicado<span v-if="summaryWarnings.duplicated > 1">s</span><br>
        </span>

        <span v-if="summaryWarnings.expired">
          - Encontramos {{ summaryWarnings.expired }} disputa<span v-if="summaryWarnings.expired > 1">s</span> expirada<span v-if="summaryWarnings.expired > 1">s</span><br>
        </span>

        <div
          v-show="summaryWarnings.duplicated && isJusttoAdmin"
          class="summary-duplucated-container"
        >
          <span>O que deseja fazer com as duplicidades?</span>

          <el-radio-group v-model="duplicatedActionToDo">
            <el-radio-button label="IGNORE">
              Ignorar duplicadas
            </el-radio-button>

            <el-radio-button label="UPDATE">
              Atualizar dados
            </el-radio-button>

            <el-radio-button label="DUPLICATE">
              Duplicar disputas
            </el-radio-button>
          </el-radio-group>
        </div>

        <a @click="showDetails = !showDetails">
          {{ showDetails ? 'ocultar detalhes' : 'ver detalhes' }}
        </a>
      </div>

      <ul
        v-for="(d, index) in duplicatedDisputes"
        v-show="showDetails"
        :key="d.code + index"
      >
        <li>
          {{ d.code }} - Disputa

          <span v-if="d.status === 'DUPLICATED_DISPUTE' || d.status === 'DUPLICATE_AND_EXPIRED' || d.status === 'DUPLICATED'">
            <span v-if="duplicatedActionToDo === 'IGNORE'">
              <strong>não será importada</strong> porque já está cadastrada
              (campanha {{ d.duplicatedBy.campaignName }}).
            </span>

            <span v-if="duplicatedActionToDo === 'UPDATE'">
              já está cadastrada e <strong>será atuailzada</strong> com os novos dados
              (campanha {{ d.duplicatedBy.campaignName }}).
            </span>

            <span v-if="duplicatedActionToDo === 'DUPLICATE'">
              já está cadastrada e <strong>será duplicada</strong> quando prosseguir a importação
              (campanha {{ d.duplicatedBy.campaignName }}).
            </span>
          </span>

          <span v-if="d.status === 'DUPLICATED_ROW'">
            <span v-if="duplicatedActionToDo === 'IGNORE'">
              <strong>será importada apenas 1 vez</strong> pois está duplicada na planilha
            </span>

            <span v-if="duplicatedActionToDo === 'UPDATE'">
              está duplicada na planilha. Irá importar <strong>apenas 1 vez</strong> e terá os dados atualizados pelas linhas duplicadas
            </span>

            <span v-if="duplicatedActionToDo === 'DUPLICATE'">
              está duplicada na planilha. Irá <strong>criar uma disputa para cada registro duplicado</strong> da planilha
            </span>
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
        v-if="!validationInProgress"
        class="import-view__content"
      >
        <jus-import-feedback-card
          v-for="(mappedCampaign, index) in mappedCampaigns"
          :key="mappedCampaign.cluster"
          :mapped-campaign.sync="mappedCampaigns[index]"
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
    JusImportFeedbackCard: () => import('@/components/layouts/JusImportFeedbackCard')
  },

  props: {
    campaignIsMapped: {
      type: Boolean,
      default: false
    },
    mappedCampaigns: {
      type: Array,
      default: () => []
    },
    duplicatedAction: {
      type: String,
      default: 'IGNORE'
    }
  },

  data() {
    return {
      duplicatedDisputes: [],
      loadingStrategies: false,
      showDetails: false
    }
  },

  computed: {
    ...mapGetters({
      loading: 'loading',
      isJusttoAdmin: 'isJusttoAdmin',
      strategyList: 'getMyStrategiesLite',
      importedFileName: 'importedFileName',
      validationInProgress: 'validationInProgress'
    }),

    summaryWarnings() {
      return {
        duplicated: this.duplicatedDisputes.filter(w => w.status === 'DUPLICATED_DISPUTE' || w.status === 'DUPLICATED' || w.status === 'DUPLICATED_ROW').length,
        expired: this.duplicatedDisputes.filter(w => w.status === 'EXPIRED' || w.status === 'DUPLICATE_AND_EXPIRED').length
      }
    },

    duplicatedActionToDo: {
      get() {
        return this.duplicatedAction
      },

      set(value) {
        this.$emit('update:duplicatedAction', value)
      }
    }
  },

  watch: {
    campaignIsMapped(current) {
      if (current) {
        this.$store.dispatch('validateGeneseRunner').then(response => {
          this.duplicatedDisputes = response.disputes
        }).finally(() => (this.finishDuplicateValidations()))
      }
    }
  },

  async beforeMount() {
    this.startDuplicateValidations()
    if (!this.strategyList.length) {
      this.getStrategies()
    }

    this.$store.dispatch('validateGeneseRunner').then(response => {
      this.duplicatedDisputes = response.disputes
    }).finally(() => (this.finishDuplicateValidations()))
  },

  methods: {
    ...mapActions([
      'showLoading',
      'hideLoading',
      'getMyStrategiesLite',
      'startDuplicateValidations',
      'finishDuplicateValidations'
    ]),

    async getStrategies() {
      this.loadingStrategies = true
      this.showLoading()
      for (const round in [0, 1, 2, 3, 4]) {
        await new Promise((resolve) => setTimeout(resolve, round * 3000))
        if (this.loading) {
          this.getMyStrategiesLite().then(this.hideLoading).catch(() => {
            this.$jusSegment(`Tentativa ${(Number(round) + Number(1))} de buscar as estratégias para a importação do arquivo ${this.importedFileName}.`)
          })
        } else {
          this.loadingStrategies = false
          return
        }
      }
      this.loadingStrategies = false
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
  .el-alert {
    margin-top: 20px;
    padding-bottom: 12px;
    .el-radio-button__inner {
      line-height: 0
    }
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
.summary-duplucated-container {
  display: flex;
  gap: 8px;
  flex-direction: column;
  margin: 16px 0;
}
</style>
