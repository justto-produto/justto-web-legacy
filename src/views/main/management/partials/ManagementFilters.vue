<template>
  <el-dialog :visible.sync="visibleFilters" @open="restoreFilters()">
    <template slot="title">
      <h2>Filtrar {{ activeTabLabel }}</h2>
    </template>
    <div class="management-filters">
      <el-form v-loading="loading" :model="filters" label-position="top">
        <el-row :gutter="20">
          <!--  CAMPANHA -->
          <el-col v-if="!loading" :span="12">
            <el-form-item label="Campanha">
              <el-select
                v-model="filters.campaigns"
                multiple
                filterable
                data-testid="filter-campaign"
                placeholder="Selecione uma opção"
                clearable
                @clear="clearCampaign">
                <el-option
                  v-for="campaign in campaigns"
                  :key="campaign.id"
                  :value="campaign.id"
                  :label="campaign.name"/>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- ESTRATÉGIA -->
          <el-col v-if="!loading" :span="12">
            <el-form-item label="Estratégia">
              <el-select
                v-model="filters.strategy"
                multiple
                filterable
                data-testid="filter-strategy"
                placeholder="Selecione uma opção"
                clearable
                @clear="clearStrategy">
                <el-option
                  v-for="strategy in strategies"
                  :key="strategy.id"
                  :value="strategy.id"
                  :label="strategy.name"/>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- DATA DO ACORDO -->
          <el-col v-if="isNewAgreements" :span="12">
            <el-form-item label="Data do acordo">
              <el-date-picker
                v-model="filters.dealDate"
                data-testid="filters-disputeexpirationdate"
                type="daterange"
                align="right"
                format="dd/MM/yyyy"
                unlink-panels
                clearable
                range-separator="-"
                start-placeholder="Data inicial"
                end-placeholder="Data final"
                @change="changeDealDate" />
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
                clearable
                range-separator="-"
                start-placeholder="Data inicial"
                end-placeholder="Data final"
                @change="clearLastInteractionDate" />
            </el-form-item>
          </el-col> -->
          <!-- MEIO DE INTERAÇÃO -->
          <!-- <el-col :span="12">
            <el-form-item v-if="isInteration" label="Meio de interação">
              <el-select
                v-model="filters.lastInteractionType"
                data-testid="filter-setinteraction"
                placeholder="Selecione uma opção"
                clearable
                @clear="clearInteraction">
                <el-option
                  v-for="interaction in interactions"
                  :key="interaction.key"
                  :value="interaction.key"
                  :label="interaction.value"/>
              </el-select>
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
            <el-form-item label="Fim da negociação">
              <el-date-picker
                v-model="filters.expirationDate"
                data-testid="filters-disputeexpirationdate"
                type="daterange"
                align="right"
                format="dd/MM/yyyy"
                unlink-panels
                clearable
                range-separator="-"
                start-placeholder="Data inicial"
                end-placeholder="Data final"
                @change="changeExpirationDate" />
            </el-form-item>
          </el-col>
          <!-- RÉU -->
          <el-col v-if="!loading && isAll" :span="12">
            <el-form-item label="Réu">
              <el-select
                v-model="filters.respondent"
                multiple
                filterable
                data-testid="filter-respondent"
                placeholder="Selecione uma opção"
                clearable
                @clear="clearRespondent">
                <el-option
                  v-for="respondent in respondents"
                  :key="respondent"
                  :value="respondent"
                  :label="respondent"/>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- FAVORITOS -->
          <el-col :span="12">
            <el-form-item label="Exibir ocorrências:" class="management-filters__switch">
              <div>
                <div>
                  <jus-icon icon="star" /> Somente favoritas
                </div>
                <el-switch v-model="filters.onlyFavorite" data-testid="filters-favorite" />
              </div>
              <div>
                <div>
                  <jus-icon icon="pause" /> Somente pausadas
                </div>
                <el-switch v-model="filters.onlyPaused" data-testid="filters-favorite" />
              </div>
            </el-form-item>
          </el-col>
          <!-- ESTADO -->
          <!-- <el-col :span="12">
            <el-form-item label="Estado">
              <el-select
                v-model="filters.disputestate"
                placeholder="Selecione uma opção"
                clearable
                @clear="clearDisputestate">
                <el-option v-for="state in $store.state.statesList" :key="state" :value="state"/>
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
          <el-col v-if="isAll" :span="24">
            <el-form-item label="Status">
              <el-checkbox-group v-model="filters.status">
                <el-checkbox v-for="status in statuses" :label="status" :key="status">
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
      <el-button plain @click="clearFilters()">Limpar filtros</el-button>
      <el-button
        data-testid="filter-applyfilter"
        type="primary"
        @click="applyFilters()">
        Aplicar filtros
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { Money } from 'v-money'

export default {
  name: 'ManagementFilters',
  components: {
    Money
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tabIndex: {
      type: String,
      default: '0'
    }
  },
  data () {
    return {
      loading: false,
      filters: {},
      money: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        precision: 0
      }
    }
  },
  computed: {
    visibleFilters: {
      get () { return this.visible },
      set (value) {
        this.$emit('update:visible', value)
      }
    },
    isEngagement () {
      return this.tabIndex === '0'
    },
    isInteration () {
      return this.tabIndex === '1'
    },
    isNewAgreements () {
      return this.tabIndex === '2'
    },
    isAll () {
      return this.tabIndex === '3'
    },
    strategies () {
      return this.$store.getters.strategyList
    },
    campaigns () {
      return this.$store.getters.campaignList
    },
    respondents () {
      return this.$store.getters.respondents
    },
    interactions () {
      return [{
        key: 'WHATSAPP',
        value: 'Whatsapp'
      }, {
        key: 'EMAIL',
        value: 'Email'
      }, {
        key: 'CNA',
        value: 'CNA'
      }]
    },
    negotiatorsList () {
      return this.$store.state.workspaceModule.members
    },
    activeTabLabel () {
      switch (this.tabIndex) {
        case '0':
          return 'Sem resposta'
        case '1':
          return 'Em negociação'
        case '2':
          return 'Proposta aceita'
        case '3':
          return 'Todos'
      }
    },
    statuses () {
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
        'REFUSED',
        'ARCHIVED'
      ]
    }
  },
  watch: {
    visibleFilters (value) {
      if (value) {
        this.fetchData()
      }
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      Promise.all([
        this.$store.dispatch('getCampaigns'),
        this.$store.dispatch('getMyStrategies'),
        this.$store.dispatch('getRespondents')
      ]).finally(responses => {
        this.loading = false
      })
    },
    applyFilters () {
      this.$store.commit('setDisputeHasFilters', true)
      this.$store.commit('setDisputeQuery', this.filters)
      this.visibleFilters = false
    },
    clearFilters () {
      if (this.tabIndex === '3') {
        this.filters.status = []
      }
      this.clearCampaign()
      this.clearStrategy()
      this.clearRespondent()
      this.changeDealDate()
      this.changeExpirationDate()
      this.filters.onlyFavorite = false
      this.filters.onlyPaused = false
      this.$store.commit('setDisputeHasFilters', false)
      this.$store.commit('setDisputeQuery', this.filters)
      this.visibleFilters = false
    },
    restoreFilters () {
      this.filters = JSON.parse(JSON.stringify(this.$store.getters.disputeQuery))
    },
    // clearInteraction (value) {
    //   delete this.filters.lastInteractionType
    // },
    clearStrategy () {
      this.filters.strategy = []
    },
    clearRespondent () {
      this.filters.respondent = []
    },
    clearCampaign () {
      this.filters.campaigns = []
    },
    // clearDisputestate () {
    //   delete this.filters.disputestate
    // },
    changeDealDate (value) {
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
    changeExpirationDate (value) {
      if (value) {
        this.filters.expirationDate = value
      } else {
        this.filters.expirationDate = []
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
  &__switch {
    margin-bottom: 18px;
    .el-form-item__content {
      line-height: 22px;
      > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        img {
          width: 14px;
        }
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
