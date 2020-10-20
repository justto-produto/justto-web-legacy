<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="visibleFilters"
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
          <!-- ÚLTIMA INTERAÇÃO -->
          <!-- <el-col v-if="isInteration" :span="12">
            <el-form-item label="Última interação">
              <el-date-picker
                v-model="filters.lastInteractionDate"
                type="daterange"
                align="right"
                format="dd/MM/yyyy"
                unlink-panels
                range-separator="-"
                start-placeholder="Data inicial"
                end-placeholder="Data final"
                @change="clearLastInteractionDate" />
            </el-form-item>
          </el-col> -->
          <!-- STATUS -->
          <!-- <el-col v-if="isEngagement" :span="12">
            <el-form-item label="Status" class="management-filters__switch">
              <div>
                <div>Pausadas</div>
                <el-switch v-model="filters.status" active-value="PAUSED" :inactive-value="false"/>
              </div>
              <el-radio-group v-model="filters.status">
                paused">Pausadas
                active">Ativos
              </el-radio-group>
            </el-form-item>
          </el-col> -->
          <!-- FIM DA NEGOCIAÇÃO -->
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
          <!-- TAGS -->
          <!-- <el-col :span="12">
            <el-form-item label="Etiquetas">
              <el-select
                v-model="filters.tags"
                filterable
                data-testid="filter-strategy"
                placeholder="Selecione uma opção"
                @clear="clearTags">
                <el-option
                  v-for="tag in workspaceTags"
                  :key="tag.id"
                  :label="tag.name"
                  :value="tag.id">
                  <el-tag :color="tag.color" class="el-tag--etiqueta el-tag--etiqueta-select">
                    <i :class="`el-icon-${tag.icon}`"/>
                    {{ tag.name }}
                  </el-tag>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <!-- RÉU -->
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
                  <jus-icon icon="star" /> Somente favoritas
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
            v-if="isInteration"
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
          <!-- ESTADO -->
          <!-- <el-col :span="12">
            <el-form-item label="Estado">
              <el-select
                v-model="filters.disputestate"
                placeholder="Selecione uma opção"
                @clear="clearDisputestate">
                <el-option v-for="state in $store.state.brazilianStates" :key="state.value" :value="state.value"/>
              </el-select>
            </el-form-item>
          </el-col>  -->
          <!-- VALOR INICIAL DO ACORDO -->
          <!-- <el-col v-if="isNewAgreements" :span="12">
            <el-form-item label="Valor inicial do acordo">
              <div class="el-input">
                <money v-model="filters.disputeDealValue" v-bind="money" class="el-input__inner" />
              </div>
            </el-form-item>
          </el-col> -->
          <!-- VALOR FINAL DO ACORDO -->
          <!-- <el-col v-if="isNewAgreements" :span="24">
            <el-form-item label="Valor final do acordo">
              <el-slider
                v-model="filters.value9"
                range
                :max="10000">
              </el-slider>
            </el-form-item>
          </el-col> -->
          <!-- STATUS -->
          <el-col
            v-if="isFinished || isAll"
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
          <!-- NEGOCIADORES -->
          <!-- <el-col :span="24">
            <el-form-item label="Negociadores">
              <el-select
                v-model="filters['negotiators.f3']"
                value-key="name"
                size="large"
                placeholder="Escolha os negociadores">
                <el-option
                  v-for="item in negotiatorsList"
                  :key="item.person.id"
                  :label="item.person.name"
                  :value="item.person.id">
                  <jus-avatar-user
                    :name="item.person.name" shape="circle"
                    size="xs" style="vertical-align: middle" />
                  <span style="vertical-align: middle;margin-left: 10px;">{{ item.person.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
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
// import { Money } from 'v-money'
import { mapGetters } from 'vuex'

export default {
  name: 'ManagementFilters',
  // components: {
  //   Money
  // },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tabIndex: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      filters: {}
      // money: {
      //   decimal: ',',
      //   thousands: '.',
      //   prefix: 'R$ ',
      //   precision: 0
      // }
    }
  },
  computed: {
    ...mapGetters({
      strategies: 'strategyList',
      campaigns: 'campaignList',
      respondents: 'respondents',
      workspaceTags: 'workspaceTags',
      negotiatorsList: 'workspaceMembers'
    }),

    visibleFilters: {
      get() { return this.visible },
      set(value) {
        this.$emit('update:visible', value)
      }
    },
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
      return this.tabIndex === '3' || this.tabIndex === '4'
    },
    isNewAgreementsLabel() {
      switch (this.tabIndex) {
        case '3':
          return 'Data do acordo'
        case '4':
          return 'Data de Finalização (ganho/perdido)'
      }

      return ''
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
          return 'Pré-Negociação'
        case '1':
          return 'Sem resposta'
        case '2':
          return 'Em negociação'
        case '3':
          return 'Proposta aceita'
        case '4':
          return 'Finalizados'
        default:
          return 'Todos'
      }
    },
    statuses() {
      switch (this.tabIndex) {
        case '4':
          return [
            'EXPIRED',
            'SETTLED',
            'UNSETTLED'
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
    visibleFilters(value) {
      if (value) {
        this.fetchData()
      }
    }
  },
  methods: {
    fetchData() {
      this.loading = true
      Promise.all([
        this.$store.dispatch('getCampaigns'),
        this.$store.dispatch('getMyStrategies'),
        this.$store.dispatch('getRespondents'),
        this.$store.dispatch('getWorkspaceTags')
      ]).finally(responses => {
        this.loading = false
      })
    },
    applyFilters() {
      if (!this.filters.onlyNotVisualized) delete this.filters.onlyNotVisualized
      this.$store.commit('setDisputeHasFilters', true)
      this.$store.commit('setDisputeQuery', this.filters)
      this.visibleFilters = false
      // SEGMENT TRACK
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
      if (this.tabIndex === '4') {
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
      this.filters.onlyFavorite = false
      this.filters.onlyPaused = false
      this.filters.hasCounterproposal = false
      this.$store.commit('setDisputeHasFilters', false)
      this.$store.commit('setDisputeQuery', this.filters)
      this.visibleFilters = false
      delete this.filters.onlyNotVisualized
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
    // clearDisputestate () {
    //   delete this.filters.disputestate
    // },
    changeDealDate(value) {
      if (value) {
        this.filters.dealDate = value
      } else {
        this.filters.dealDate = []
      }
    },
    // clearLastInteractionDate (value) {
    //   if (value) {
    //     this.filters.lastInteractionDate = value
    //   } else {
    //     delete this.filters.lastInteractionDate
    //   }
    // },
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
}
</style>
