<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="advancedFiltersDialogVisible"
    width="650px"
    destroy-on-close
    append-to-body
    @open="restoreFilters()"
  >
    <template slot="title">
      <h2>Filtrar {{ $t(`tickets-tabs.${activeTab}`) }}</h2>
    </template>
    <div class="management-filters">
      <el-form
        v-loading="loading"
        :model="filters"
        label-position="top"
        style="margin-bottom: -22px;"
      >
        <el-row>
          <el-col v-if="warningSixtyLastDaysRange && isFinished">
            <span class="error">
              Na aba finalizadas contém apenas disputas finalizadas nos últimos 60 dias. Para filtrar qualquer período, utilize a tela que mostra
              <a @click="redirectToAllDisputes()">
                todas as disputas do sistema.
              </a>
            </span>
          </el-col>
        </el-row>
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
            <el-form-item :label="newAgreementsLabel">
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
            <el-form-item label="Réu">
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
                />
              </div>
            </el-form-item>
          </el-col>
          <!-- FAVORITOS -->
          <el-col
            v-if="isRunning"
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
            v-if="isRunning"
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
          <el-col
            v-if="isFinished || isEngagement"
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
  name: 'TicketsAdvancedFilters',
  props: {
    activeTab: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      advancedFiltersDialogVisible: false,
      warningSixtyLastDaysRange: false,
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
      ticketsQuery: 'getTicketsQuery'
    }),

    isPreNegotiation() {
      return this.activeTab === 'pre-negotiation'
    },
    isEngagement() {
      return this.activeTab === 'engagement'
    },
    isRunning() {
      return this.activeTab === 'running'
    },
    isFinished() {
      return this.activeTab === 'finished'
    },
    isNewAgreements() {
      return ['finished', 'accepted'].includes(this.activeTab)
    },
    newAgreementsLabel() {
      switch (this.activeTab) {
        case 'accepted':
          return 'Data do acordo'
        case 'finished':
          return 'Data de Finalização (ganho/perdido)'
        default:
          return ''
      }
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
    statuses() {
      switch (this.activeTab) {
        case 'finished':
          return [
            'EXPIRED',
            'SETTLED',
            'UNSETTLED'
          ]
        case 'engagement':
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
            'REFUSED'
          ]
      }
    }
  },
  watch: {
    advancedFiltersDialogVisible(value) {
      if (value) {
        this.fetchData()
      }
    }
  },
  methods: {
    ...mapActions([
      'getCampaigns',
      'getTicketsFilteredTags',
      'getMyStrategiesLite',
      'getRespondents',
      'getWorkspaceTags',
      'setTicketsFilters',
      'getTickets'
    ]),
    fetchData() {
      this.loading = true
      Promise.all([
        this.getCampaigns(),
        this.getMyStrategiesLite(),
        this.getRespondents(),
        this.getWorkspaceTags()
      ]).finally(_responses => {
        this.loading = false
      })
    },
    openDialog() {
      this.advancedFiltersDialogVisible = true
    },
    applyFilters() {
      const { filters } = this
      if (!filters.onlyNotVisualized) delete filters.onlyNotVisualized
      this.setTicketsFilters({ filters, hasFilters: true })
      this.advancedFiltersDialogVisible = false
      this.getTickets()
      this.getTicketsFilteredTags()
      // SEGMENT TRACK
      if (filters.status) {
        if (filters.status.includes('EXPIRED')) {
          this.$jusSegment('Filtro por status expirado')
        }
        if (filters.status.includes('PENDING')) {
          this.$jusSegment('Filtro por status pendente')
        }
        if (filters.status.includes('CHECKOUT')) {
          this.$jusSegment('Filtro por status acordo')
        }
      }
      if (filters.hasCounterproposal) {
        this.$jusSegment('Filtro por status com contraproposta')
      }
      if (filters.hasCounterproposal) {
        this.$jusSegment('Filtro por status com contraproposta')
      }
      if (filters.importingDate && filters.importingDate.length) {
        this.$jusSegment('Filtro por data importação')
      }
      if (filters.expirationDate && filters.expirationDate.length) {
        this.$jusSegment('Filtro por data fim negociação')
      }
    },
    clearFilters() {
      const { filters } = this
      if (this.activeTab === 'finished') {
        this.filters.status = []
      }
      this.clearCampaign()
      this.clearStrategy()
      this.clearTags()
      this.clearRespondent()
      this.changeDealDate()
      this.changeExpirationDate()
      this.changeimportingDate()
      this.clearInteraction()
      this.warningSixtyLastDaysRange = false
      this.filters.onlyFavorite = false
      this.filters.onlyPaused = false
      this.filters.hasCounterproposal = false
      this.setTicketsFilters({ filters, hasFilters: false })
      this.advancedFiltersDialogVisible = false
      delete this.filters.onlyNotVisualized
      this.getTickets()
    },
    restoreFilters() {
      this.filters = JSON.parse(JSON.stringify(this.ticketsQuery))
    },
    clearInteraction(_value) {
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
        if (this.isFinished) {
          const initialDateRange = this.$moment(value[0], 'YYYY-MM-DD')
          const diffDaysRange = Math.abs(initialDateRange.diff(this.$moment(), 'days'))
          const isMoreThan60DaysRange = diffDaysRange > 60
          if (isMoreThan60DaysRange) {
            this.$jusNotification({
              title: 'Opa!',
              message: 'Filtro inválido, tente novamente com outra data!',
              type: 'error'
            })
            this.warningSixtyLastDaysRange = true
            this.filters.dealDate = []
          } else {
            this.warningSixtyLastDaysRange = false
            this.filters.dealDate = value
          }
        } else {
          this.filters.dealDate = value
        }
      } else {
        this.filters.dealDate = []
      }
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
    },
    redirectToAllDisputes() {
      this.advancedFiltersDialogVisible = this.warningSixtyLastDaysRange = false
      this.$router.push({ path: '/management/all' })
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/colors.scss";

.management-filters {
  .el-select, .el-date-editor, .el-radio-group {
    width: 100%;
  }
  .el-form-item__content {
    line-height: 36px;
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

  .error {
    color: $--color-danger;
  }
}
</style>
