<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visibleFilters"
    width="650px"
    @open="restoreFilters()"
  >
    <template slot="title">
      <h2>Filtrar {{ activeTabLabel }}</h2>
    </template>

    <div class="management-filters">
      <el-form
        v-loading="loading"
        :model="filters"
        label-position="top"
        style="margin-bottom: -22px;"
      >
        <el-row :gutter="20">
          <!--  CAMPANHA -->
          <el-col
            v-if="!loading"
            :span="12"
          >
            <el-form-item label="Campanha">
              <el-select
                v-model="filters.campaigns"
                multiple
                filterable
                data-testid="filter-campaign"
                placeholder="Selecione uma opção"
                @clear="clearCampaign"
              >
                <el-option
                  v-for="campaign in campaigns"
                  :key="campaign"
                  :value="campaign"
                  :label="campaign"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- MOTIVOS DE PRENEGOCIACAO -->
          <el-col
            v-if="!loading && (isPreNegotiation || isAll)"
            :span="12"
          >
            <el-form-item label="Palavras de pré-negociação">
              <el-select
                v-model="filters.preNegotiationKeywords"
                multiple
                filterable
                placeholder="Selecione uma opção"
                @clear="clearPreNegotitationKeyWorks"
              >
                <el-option
                  v-for="keyword in preNegotiationKeywords.keyWords"
                  :key="keyword"
                  :value="keyword"
                  :label="keyword"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- ESTRATÉGIA -->
          <el-col
            v-if="!loading"
            :span="12"
          >
            <el-form-item label="Estratégia">
              <el-select
                v-model="filters.strategy"
                multiple
                filterable
                data-testid="filter-strategy"
                placeholder="Selecione uma opção"
                @clear="clearStrategy"
              >
                <el-option
                  v-for="strategy in strategies"
                  :key="strategy.id"
                  :value="strategy.id"
                  :label="strategy.name"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- DATA DO ACORDO -->
          <el-col
            v-if="isNewAgreements"
            :span="12"
          >
            <el-form-item :label="isNewAgreementsLabel">
              <el-date-picker
                v-model="filters.dealDate"
                data-testid="filters-disputeexpirationdate"
                type="daterange"
                align="right"
                format="dd/MM/yyyy"
                unlink-panels
                range-separator="-"
                start-placeholder="Data inicial"
                end-placeholder="Data final"
                value-format="yyyy-MM-dd"
                @change="changeDealDate"
              />
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="Data limite para negociar">
              <el-date-picker
                v-model="filters.expirationDate"
                data-testid="filters-disputeexpirationdate"
                type="daterange"
                align="right"
                format="dd/MM/yyyy"
                unlink-panels
                range-separator="-"
                start-placeholder="Data inicial"
                end-placeholder="Data final"
                value-format="yyyy-MM-dd"
                @change="changeExpirationDate"
              />
            </el-form-item>
          </el-col>

          <!-- IMPORTAÇÃO -->
          <el-col :span="12">
            <el-form-item label="Data da Importação">
              <el-date-picker
                v-model="filters.importingDate"
                data-testid="filters-disputeimportingDate"
                type="daterange"
                align="right"
                format="dd/MM/yyyy"
                unlink-panels
                range-separator="-"
                start-placeholder="Data inicial"
                end-placeholder="Data final"
                value-format="yyyy-MM-dd"
                @change="changeimportingDate"
              />
            </el-form-item>
          </el-col>

          <el-col
            v-if="!loading && isFinished || isPreNegotiation"
            :span="12"
          >
            <el-form-item :label="$tc('PARTY_RESPONDENT', isRecovery)">
              <el-select
                v-model="filters.respondentNames"
                multiple
                filterable
                data-testid="filter-respondent"
                placeholder="Selecione uma opção"
                clearable
                @clear="clearRespondent"
              >
                <el-option
                  v-for="respondent in respondents"
                  :key="respondent"
                  :value="respondent"
                  :label="respondent"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- FAVORITOS -->
          <el-col :span="12">
            <el-form-item
              label="Exibir ocorrências:"
              class="management-filters__switch"
            >
              <div>
                <div>
                  <jus-icon icon="offices-tower" /> Aguardando análise da empresa
                </div>
                <el-switch
                  v-model="filters.onlyFavorite"
                  data-testid="filters-favorite"
                />
              </div>
              <div v-if="!isPreNegotiation">
                <div>
                  <jus-icon icon="pause" /> Somente pausadas
                </div>
                <el-switch
                  v-model="filters.onlyPaused"
                  data-testid="filters-only-paused"
                  @change="toggleOnlyPaused"
                />
              </div>

              <div v-if="!isPreNegotiation">
                <div>
                  <jus-icon icon="pause" /> Somente não pausadas
                </div>
                <el-switch
                  v-model="filters.onlyNotPaused"
                  data-testid="filters-only-not-paused"
                  @change="toggleOnlyNotPaused"
                />
              </div>

              <div v-if="isEngagement || isInteration || isAll">
                <div>
                  <i class="el-icon-warning-outline" /> Advogados ofensores
                </div>
                <el-switch
                  v-model="filters.vexatiousLawyer"
                  data-testid="filters-advogados-ofensores"
                />
              </div>
            </el-form-item>
          </el-col>

          <!-- FAVORITOS -->
          <el-col
            v-if="isInteration"
            :span="12"
          >
            <el-form-item
              label="Exibir ocorrências:"
              class="management-filters__switch management-filters__switch--invisible"
            >
              <div>
                <div>
                  <jus-icon icon="eye" /> Somente não visualizadas
                </div>
                <el-switch
                  v-model="filters.onlyNotVisualized"
                  data-testid="filters-only-not-visualized"
                />
              </div>
              <div>
                <div>
                  <jus-icon icon="proposal" /> Tem contraproposta
                </div>
                <el-switch
                  v-model="filters.hasCounterproposal"
                  data-testid="filters-has-counterproposal"
                />
              </div>
            </el-form-item>
          </el-col>

          <!-- MEIO DE INTERAÇÃO -->
          <el-col
            v-if="isInteration || isAll"
            :span="12"
          >
            <el-form-item label="Meio de interação">
              <el-select
                v-model="filters.lastInteractionType"
                data-testid="filter-setinteraction"
                placeholder="Selecione uma opção"
                multiple
                @clear="clearInteraction"
              >
                <el-option
                  v-for="interaction in interactions"
                  :key="interaction.key"
                  :value="interaction.key"
                  :label="interaction.value"
                />
              </el-select>
            </el-form-item>
          </el-col>

          <!-- STATUS -->
          <el-col
            v-if="isFinished || isEngagement || isAll"
            :span="24"
          >
            <el-form-item label="Status">
              <el-checkbox-group v-model="filters.status">
                <el-checkbox
                  v-for="status in statuses"
                  :key="status"
                  :label="status"
                >
                  {{ $t('occurrence.type.' + status) | capitalize }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>

          <!-- ID, Código do Processo ou Código Externo -->
          <el-col
            :span="24"
          >
            <el-form-item>
              <MultipleFields
                ref="MultipleFields"
                v-model="filters"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <span slot="footer">
      <el-button
        plain
        @click="clearFilters()"
      >Limpar filtros</el-button>
      <el-button
        data-testid="filter-applyfilter"
        type="primary"
        @click="applyFilters()"
      >
        Aplicar filtros
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ManagementFilters',

  components: {
    MultipleFields: () => import('./partials/MultipleFieldsFilter')
  },

  props: {
    tabIndex: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      visibleFilters: false,
      loading: false,
      filters: {}
    }
  },

  computed: {
    ...mapGetters({
      strategies: 'getMyStrategiesLite',
      campaigns: 'campaignList',
      respondents: 'respondents',
      workspaceTags: 'workspaceTags',
      negotiatorsList: 'workspaceMembers',
      preNegotiationKeywords: 'getPreNegotiation',
      isRecovery: 'isWorkspaceRecovery'
    }),

    isPreNegotiation() {
      return this.tabIndex === '0'
    },
    isEngagement() {
      return this.tabIndex === '1'
    },
    isInteration() {
      return this.tabIndex === '2'
    },
    isNewAgreements() {
      return ['3', '4', '9'].includes(this.tabIndex)
    },
    isNewAgreementsLabel() {
      switch (this.tabIndex) {
        case '3':
          return 'Data do acordo'
        case '4':
        case '9':
          return 'Data de Finalização (ganho/perdido)'
        default:
          return ''
      }
    },
    isFinished() {
      return this.tabIndex === '4'
    },
    isAll() {
      return this.tabIndex === '9'
    },
    interactions() {
      return [{
        key: 'WHATSAPP',
        value: 'Whatsapp'
      }, {
        key: 'EMAIL',
        value: 'Email'
      }, {
        key: 'NEGOTIATOR_ACCESS',
        value: 'Sistema Justto'
      }]
    },
    activeTabLabel() {
      switch (this.tabIndex) {
        case '0':
          return 'pré-Negociação'
        case '1':
          return 'sem resposta'
        case '2':
          return 'em negociação'
        case '3':
          return 'proposta aceita'
        case '4':
          return 'finalizados'
        default:
          return 'todos'
      }
    },
    statuses() {
      switch (this.tabIndex) {
        case '4':
          return [
            'EXPIRED',
            'SETTLED',
            'UNSETTLED',
            'CANCELED'
          ]
        case '1':
          return [
            'IMPORTED',
            'PENDING',
            'ENRICHED',
            'ENGAGEMENT'
          ]
        default:
          return [
            'IMPORTED',
            'ENRICHED',
            'ENGAGEMENT',
            'RUNNING',
            'PENDING',
            'ACCEPTED',
            'CHECKOUT',
            'EXPIRED',
            'SETTLED',
            'UNSETTLED',
            // 'REFUSED',
            'CANCELED'
          ]
      }
    }
  },

  watch: {
    visibleFilters(value) {
      if (value) {
        this.fetchData()
      }
    }
  },

  methods: {
    ...mapActions([
      'getCampaigns',
      'getMyStrategiesLite',
      'getRespondents',
      'getWorkspaceTags',
      'getWorkspacePreNegotiationKeywords'
    ]),

    fetchData() {
      this.loading = true
      Promise.all([
        this.getCampaigns(),
        this.getMyStrategiesLite(),
        this.getRespondents(),
        this.getWorkspaceTags(),
        this.getWorkspacePreNegotiationKeywords()
      ]).finally(responses => {
        this.loading = false
      })
    },

    openDialog() {
      this.visibleFilters = true
    },

    toggleOnlyPaused(active) {
      this.filters.onlyPaused = active

      if (active) {
        this.filters.onlyNotPaused = !active
      } else {
        delete this.filters.onlyPaused
      }
      this.$forceUpdate()
    },

    toggleOnlyNotPaused(active) {
      this.filters.onlyNotPaused = active

      if (active) {
        this.filters.onlyPaused = !active
      } else {
        delete this.filters.onlyNotPaused

        if (this.filters.onlyPaused === false) delete this.filters.onlyPaused
      }
      this.$forceUpdate()
    },

    applyFilters() {
      if (!this.filters.onlyNotVisualized) delete this.filters.onlyNotVisualized

      this.$store.commit('setDisputeHasFilters', true)
      this.$store.commit('setDisputeQuery', this.filters)
      this.visibleFilters = false

      if (this.filters.status) {
        if (this.filters.status.includes('EXPIRED')) {
          this.$jusSegment('Filtro por status expirado')
        }
        if (this.filters.status.includes('PENDING')) {
          this.$jusSegment('Filtro por status pendente')
        }
        if (this.filters.status.includes('CHECKOUT')) {
          this.$jusSegment('Filtro por status acordo')
        }
      }

      if (this.filters.hasCounterproposal) {
        this.$jusSegment('Filtro por status com contraproposta')
      }

      if (this.filters.hasCounterproposal) {
        this.$jusSegment('Filtro por status com contraproposta')
      }

      if (this.filters.importingDate && this.filters.importingDate.length) {
        this.$jusSegment('Filtro por data importação')
      }

      if (this.filters.expirationDate && this.filters.expirationDate.length) {
        this.$jusSegment('Filtro por data fim negociação')
      }
    },

    clearFilters() {
      if (this.$refs.MultipleFields) {
        this.$refs.MultipleFields.clear()
      }
      this.clearCampaign()
      this.clearStrategy()
      this.clearTags()
      this.clearRespondent()
      this.changeDealDate()
      this.changeExpirationDate()
      this.changeimportingDate()
      this.clearInteraction()
      this.clearStatuses()
      this.clearPreNegotitationKeyWorks()
      this.filters.onlyFavorite = false
      this.filters.onlyPaused = false
      this.filters.onlyNotPaused = false
      this.filters.hasCounterproposal = false
      this.filters.vexatiousLawyer = false
      this.$store.commit('setDisputeHasFilters', false)
      this.$store.commit('setDisputeQuery', this.filters)
      this.visibleFilters = false
      delete this.filters.onlyNotVisualized
      delete this.filters.onlyPaused
    },
    restoreFilters() {
      this.filters = JSON.parse(JSON.stringify(this.$store.getters.disputeQuery))
    },
    clearInteraction(value) {
      delete this.filters.lastInteractionType
    },
    clearStrategy() {
      this.filters.strategy = []
    },
    clearTags() {
      this.filters.tags = []
    },
    clearRespondent() {
      this.filters.respondentNames = []
    },
    clearCampaign() {
      this.filters.campaigns = []
    },
    changeDealDate(value) {
      if (value) {
        this.filters.dealDate = value
      } else {
        this.filters.dealDate = []
      }
    },
    clearStatuses() {
      if (this.isFinished || this.isEngagement || this.isAll) {
        switch (this.tabIndex) {
          case '1':
            this.filters.status = ['IMPORTED', 'ENRICHED', 'ENGAGEMENT', 'PENDING']
            break
          case '4':
          case '9':
          default:
            this.filters.status = []
            break
        }
      }
    },
    clearPreNegotitationKeyWorks() {
      this.filters.preNegotiationKeywords = []
    },
    changeExpirationDate(value) {
      if (value) {
        this.filters.expirationDate = value
      } else {
        this.filters.expirationDate = []
      }
    },
    changeimportingDate(value) {
      if (value) {
        this.filters.importingDate = value
      } else {
        this.filters.importingDate = []
      }
    }
  }
}
</script>

<style lang="scss">
.management-filters {
  overflow-x: hidden;

  .el-select, .el-date-editor, .el-radio-group {
    width: 100%;
  }
  .el-form-item__content {
    line-height: 36px;
    width: 100%;
  }
  &__switch {
    margin-bottom: 18px;
    .el-form-item__content {
      line-height: 24px;
      > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          width: 14px;
        }
      }
    }
    &.management-filters__switch--invisible {
      .el-form-item__label {
        opacity: 0;
      }
    }
  }
  &__member {
    display: inline-block;
    margin: 10px 10px 0 0;
  }
  .el-radio-button__inner {
    margin: 0 10px 10px 0;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
  }
  .el-tag {
    overflow: hidden;
  }

  .el-form {
    .el-row {
      .el-col {
        .el-form-item {
          max-width: 100%;
        }
      }
    }
  }
}
</style>
