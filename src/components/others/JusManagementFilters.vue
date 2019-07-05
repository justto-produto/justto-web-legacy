<template>
  <div class="jus-management-filters">
    <el-form v-loading="loading" :model="filters" label-position="top">
      <el-row :gutter="20">
        <!--  CAMPANHA -->
        <el-col :span="12">
          <el-form-item label="Campanha">
            <el-select
              v-model="filters.campaignid"
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
        <el-col :span="12">
          <el-form-item label="Estratégia">
            <el-select
              v-model="filters.strategyid"
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
              v-model="filters.disputedealdate"
              format="dd/MM/yyyy"
              placeholder="Selecione uma data"
              value-format="yyyy-MM-dd"
              @change="clearDisputedealdate"/>
          </el-form-item>
        </el-col>
        <!-- ÚLTIMA INTERAÇÃO -->
        <el-col v-if="isInteration" :span="12">
          <el-form-item label="Última interação">
            <el-date-picker
              v-model="filters.lastinteractiondate"
              format="dd/MM/yyyy"
              placeholder="Selecione uma data"
              value-format="yyyy-MM-dd"
              @change="clearLastinteractiondate" />
          </el-form-item>
        </el-col>
        <!-- MEIO DE INTERAÇÃO -->
        <el-col :span="12">
          <el-form-item v-if="isInteration" label="Meio de interação">
            <el-select
              v-model="filters.interaction"
              placeholder="Selecione uma opção"
              clearable
              @change="setInteraction">
              <el-option
                v-for="interaction in interactions"
                :key="interaction.key"
                :value="interaction.key"
                :label="interaction.value"/>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- STATUS -->
        <!-- <el-col v-if="isEngagement" :span="12">
          <el-form-item label="Status" class="jus-management-filters__switch">
            <div>
              <div>Pausados</div>
              <el-switch v-model="filters.disputestatus" active-value="PAUSED" :inactive-value="false"/>
            </div>
            <el-radio-group v-model="filters.status">
              <el-radio-button label="paused">Pausados</el-radio-button>
              <el-radio-button label="active">Ativos</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col> -->
        <!-- FAVORITOS -->
        <el-col :span="12">
          <el-form-item label="Exibir somente:" class="jus-management-filters__switch">
            <div>
              <div>
                <jus-icon icon="golden-star" /> Disputas favoritas
              </div>
              <el-switch v-model="filters.favorite" data-testid="filters-favorite" />
            </div>
          </el-form-item>
        </el-col>
        <!-- FIM DA NEGOCIAÇÃO -->
        <el-col v-if="isEngagement || isInteration || isNewAgreements" :span="12">
          <el-form-item label="Fim da negociação">
            <el-date-picker
              data-testid="filters-disputeexpirationdate"
              v-model="filters.disputeexpirationdate"
              format="dd/MM/yyyy"
              placeholder="Selecione uma data"
              value-format="yyyy-MM-dd"
              @change="clearDisputeexpirationdate"/>
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
        <el-col v-if="isNewAgreements" :span="12">
          <el-form-item label="Valor inicial do acordo">
            <div class="el-input">
              <money v-model="filters.disputedealvalue" v-bind="money" class="el-input__inner" />
            </div>
          </el-form-item>
        </el-col>
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
            <el-radio-group v-model="filters.disputestatus">
              <el-radio-button label="ENGAGEMENT">Engajamento</el-radio-button>
              <el-radio-button label="INTERACTIONS">Com interação</el-radio-button>
              <el-radio-button label="ACCEPTED">Novos acordos</el-radio-button>
              <el-radio-button label="SETTLED">Ganhos</el-radio-button>
              <el-radio-button label="UNSETTLED">Perdidos</el-radio-button>
              <el-radio-button label="EXPIRED">Expirados</el-radio-button>
              <el-radio-button label="PENDING">Pendentes</el-radio-button>
              <el-radio-button label="PAUSED">Pausados</el-radio-button>
            </el-radio-group>
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
</template>

<script>
import { Money } from 'v-money'

export default {
  name: 'JusManagementFilters',
  components: { Money },
  props: {
    tabIndex: {
      type: String,
      default: '0'
    },
    filters: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      loading: false,
      money: {
        decimal: ',',
        thousands: '.',
        prefix: 'R$ ',
        precision: 0
      }
    }
  },
  computed: {
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
      return this.$store.getters.activeCampaigns
    },
    interactions () {
      return [{
        key: 'haswhatsappinteration',
        value: 'Whatsapp'
      }, {
        key: 'hasemailinteraction',
        value: 'Email'
      }, {
        key: 'hascnainteraction',
        value: 'CNA'
      }]
    },
    negotiatorsList () {
      return this.$store.state.workspaceModule.members
    }
  },
  beforeMount () {
    this.loading = true
    Promise.all([
      this.$store.dispatch('getCampaigns'),
      this.$store.dispatch('getStrategies')
    ]).finally(responses => {
      this.loading = false
    })
  },
  methods: {
    setInteraction (value) {
      delete this.filters['whatsappinterations']
      delete this.filters['emailinteractions']
      delete this.filters['cnainteractions']
      if (value) this.filters[value] = true
    },
    clearStrategy () {
      delete this.filters.strategyid
    },
    clearCampaign () {
      delete this.filters.campaignid
    },
    clearDisputestate () {
      delete this.filters.disputestate
    },
    clearDisputedealdate (value) {
      if (value) {
        this.filters.disputedealdate = value
      } else {
        delete this.filters.disputedealdate
      }
    },
    clearLastinteractiondate (value) {
      if (value) {
        this.filters.lastinteractiondate = value
      } else {
        delete this.filters.lastinteractiondate
      }
    },
    clearDisputeexpirationdate (value) {
      if (value) {
        this.filters.disputeexpirationdate = value
      } else {
        delete this.filters.disputeexpirationdate
      }
    }
  }
}
</script>

<style lang="scss">
.jus-management-filters {
  .el-form-item__content {
    // max-height: 40px;
  }
  .el-select, .el-date-editor, .el-radio-group {
    width: 100%;
  }
  &__switch {
    .el-form-item__content > div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        vertical-align: text-top;
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
}
</style>
