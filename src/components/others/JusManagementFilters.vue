<template>
  <div class="jus-management-filters">
    <el-form :model="filters" label-position="top">
      <el-row :gutter="20">
        <!--  CAMPANHA -->
        <el-col :span="12">
          <el-form-item label="Campanha">
            <el-select
              v-model="filters.campaignid"
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
              v-model="disputedealdate"
              format="dd/MM/yyyy"
              placeholder="Selecione uma data"
              value-format="yyyy-MM-dd'T'HH:mm:ss"
              @change="clearDisputedealdate"/>
          </el-form-item>
        </el-col>
        <!-- ÚLTIMA INTERAÇÃO -->
        <el-col v-if="isInteration" :span="12">
          <el-form-item label="Última interação">
            <el-date-picker
              v-model="lastinteractiondate"
              format="dd/MM/yyyy"
              placeholder="Selecione uma data"
              value-format="yyyy-MM-dd'T'HH:mm:ss"
              @change="clearLastinteractiondate" />
          </el-form-item>
        </el-col>
        <!-- MEIO DE INTERAÇÃO -->
        <el-col :span="12">
          <el-form-item v-if="isInteration" label="Meio de interação">
            <el-select
              v-model="interaction"
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
        <!-- <el-col :span="12">
          <el-form-item label="Ordenar por:" class="jus-management-filters__switch">
            <div>
              <div>
                <jus-icon icon="golden-star" /> Casos favoritos
              </div>
              <el-switch v-model="filters.favorites" />
            </div>
          </el-form-item>
        </el-col> -->

        <!-- FIM DA NEGOCIAÇÃO -->
        <el-col v-if="isEngagement || isInteration || isNewAgreements" :span="12">
          <el-form-item label="Fim da negociação">
            <el-date-picker
              v-model="disputeexpirationdate"
              format="dd/MM/yyyy"
              placeholder="Selecione uma data"
              value-format="yyyy-MM-dd'T'HH:mm:ss"
              @change="clearDisputeexpirationdate"/>
          </el-form-item>
        </el-col>
        <!-- STATUS -->
        <el-col v-if="isAll" :span="24">
          <el-form-item label="Status">
            <el-radio-group v-model="filters.disputestatus">
              <el-radio-button label="Engajamento" value="ENGAGEMENT" />
              <el-radio-button label="Com interação" value="INTERACTIONS" />
              <el-radio-button label="Novos acordos" value="ACCEPTED" />
              <el-radio-button label="Perdidos" value="LOST" />
              <el-radio-button label="Expirados" value="EXPIRED" />
              <el-radio-button label="Pausados" value="PAUSED" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- ESTADO 
        <el-col :span="12">
          <el-form-item label="Estado">
            <el-select
              v-model="filters.disputestate"
              placeholder="Selecione uma opção"
              clearable
              @clear="clearDisputestate">
              <el-option v-for="state in $store.state.statesList" :key="state" :value="state"/>
            </el-select>
          </el-form-item>
        </el-col> -->
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
      type: Number,
      default: 0
    },
    filters: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      interaction: '',
      disputedealdate: '',
      lastinteractiondate: '',
      disputeexpirationdate: '',
      test: '',
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
      return this.tabIndex === 0
    },
    isInteration () {
      return this.tabIndex === 1
    },
    isNewAgreements () {
      return this.tabIndex === 2
    },
    isAll () {
      return this.tabIndex === 3
    },
    strategies () {
      return this.$store.state.strategyModule.list
    },
    campaigns () {
      return this.$store.state.campaignModule.list
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
    }
  },
  beforeMount () {
    this.$store.dispatch('showLoading')
    var promise = []
    if (this.$store.state.campaignModule.list.length === 0) {
      promise.push(this.$store.dispatch('getCampaigns'))
    }
    if (this.$store.state.strategyModule.list.length === 0) {
      promise.push(this.$store.dispatch('getStrategies'))
    }
    Promise.all(promise).finally(() => {
      this.$store.dispatch('hideLoading')
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
  .el-radio-button__inner {
    margin: 0 10px 10px 0;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
  }
}
</style>
