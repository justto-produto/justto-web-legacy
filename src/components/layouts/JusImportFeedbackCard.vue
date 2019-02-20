<template>
  <div class="jus-import-feedback-card">
    <el-tag :color="color" class="el-tag--mapped-campaign-tag">{{ mappedName }}</el-tag>
    <el-card :style="'border-left: solid 4px ' + color">
      <el-input v-model="campaignName" placeholder="Dê um nome para a sua Campanha">
        <i
          slot="prefix"
          :class="campaignName === '' ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
          class="el-input__icon" />
      </el-input>
      <!-- <el-autocomplete
        v-model="campaignName"
        :fetch-suggestions="querySearchCampaign"
        :trigger-on-focus="false"
        value-key="name"
        clearable
        placeholder="Dê um nome para a sua Campanha"
        @select="handleSelectCampaign">
        <i
          slot="prefix"
          :class="campaignName === '' ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
          class="el-input__icon" />
      </el-autocomplete> -->
      <el-select
        ref="strategySelect"
        v-model="strategy"
        :default-first-option="false"
        value-key="name"
        clearable class="select-strategy"
        placeholder="Escolha uma estratégia">
        <i
          slot="prefix"
          :class="strategy === '' ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
          class="el-input__icon" />
        <el-option
          v-for="strategy in strategies"
          :key="strategy.id"
          :label="strategy.name"
          :value="strategy" />
      </el-select>
      <div class="select-strategy__messages">
        <a v-show="strategy !== ''" @click="showStrategyMessages()">Ver estratégia de engajamento das partes</a>
      </div>
      <div v-if="strategy.id === 1" class="jus-import-feedback-card__number">
        <div>
          <i class="el-icon-circle-check el-input__icon--success" />Data do pagamento
        </div>
        <div>
          <el-input-number
            v-model="paymentDeadLine"
            :min="1"
            :max="9999"
            name="payment-deadline"
            controls-position="right" />
          dia(s) após acordo
        </div>
      </div>
      <div class="jus-import-feedback-card__number">
        <div>
          <i class="el-icon-circle-check el-input__icon--success" />Data do protocolo
        </div>
        <div>
          <el-input-number
            v-model="protocolDeadLine"
            :min="1"
            :max="9999"
            name="protocol-deadline"
            controls-position="right" />
          dia(s) após acordo
        </div>
      </div>
      <el-date-picker
        v-model="dueDate"
        :prefix-icon="dueDate === null ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
        :picker-options="datePickerOptions"
        type="date"
        format="dd-MM-yyyy"
        placeholder="Defina a data limite para a negociação" />
      <el-select
        v-model="negotiatorIds"
        :loading="loading"
        value-key="name"
        size="large"
        multiple
        placeholder="Escolha os negociadores"
        class="select-negotiator">
        <i
          slot="prefix"
          :class="negotiatorIds.length === 0 ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
          class="el-input__icon" />
        <el-option
          v-for="item in negotiatorsList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          <jus-avatar-user
            :name="item.name" shape="circle"
            size="xs" style="vertical-align: middle" />
          <span style="vertical-align: middle;margin-left: 10px;">{{ item.name }}</span>
        </el-option>
      </el-select>
    </el-card>
    <el-dialog :visible.sync="dialogVisible">
      <template slot="title">
        <h2>Estretégia de engajamento das partes</h2>
        <p>
          Abaixo você encontra as mensagens enviadas para às partes dos casos contidos nesta Campanha. Através da
          inteligência artificial da nossa plataforma, junto com os dados já obtidos pelo nosso sistema, aprende cada
          vez mais sobre o perfil dos usuários e seus comportamentos, escolhendo a estratégia mais apropriada para
          encontrar as pessoas e chegar uma solução adequada.
        </p>
      </template>
      <el-collapse v-loading="$store.state.loading" class="jus-import-feedback-card__engagement el-collapse--bordered">
        <el-collapse-item v-for="step in strategyEngagements" :key="step.id">
          <template slot="title">
            <jus-icon :icon="getIcon(step.channel)" is-active/> {{ step.name | capitalize }}
          </template>
          <div v-if="step.template">
            <h3>{{ step.template.title }}</h3>
            <span v-html="step.template.body" />
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'JusImportFeedbackCard',
  props: {
    mappedCampaign: {
      type: Object,
      default: function () {
        return {}
      }
    },
    color: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      mappedName: '',
      protocolDeadLine: 1,
      paymentDeadLine: 1,
      campaignName: '',
      campaignTimeout: null,
      strategy: '',
      strategyEngagements: [],
      dialogVisible: false,
      dueDate: null,
      negotiatorIds: [],
      // filteredNegotiators: [],
      loading: false,
      datePickerOptions: {
        disabledDate (date) {
          return date < new Date()
        }
      }
    }
  },
  computed: {
    strategies () {
      return this.$store.state.strategyModule.list
    },
    campaigns () {
      return this.$store.state.campaignModule.list
    },
    negotiatorsList () {
      return this.$store.state.workspaceModule.negotiators
    }
  },
  watch: {
    campaignName (value) {
      if (value === '') {
        this.mappedCampaign.newName = ''
      } else {
        this.mappedCampaign.newName = value
      }
    },
    strategy (value) {
      this.mappedCampaign.strategy = value
    },
    dueDate (value) {
      this.mappedCampaign.deadline = value
    },
    negotiatorIds (value) {
      this.mappedCampaign.negotiatorIds = value
    },
    protocolDeadLine (value) {
      this.mappedCampaign.protocolDeadLine = value
    },
    paymentDeadLine (value) {
      this.mappedCampaign.paymentDeadLine = value
    }
  },
  beforeMount () {
    this.$store.dispatch('getWorkspaceNegotiators')
    this.mappedName = this.mappedCampaign.name
    this.mappedCampaign.campaign = {}
    this.mappedCampaign.protocolDeadLine = this.protocolDeadLine
    this.mappedCampaign.paymentDeadLine = this.paymentDeadLine
  },
  methods: {
    // querySearchCampaign (queryString, callback) {
    //   var campaigns = this.campaigns
    //   var results = queryString ? campaigns.filter(this.createCampaignFilter(queryString)) : campaigns
    //   clearTimeout(this.campaignTimeout)
    //   this.campaignTimeout = setTimeout(() => {
    //     callback(results)
    //   }, 1000 * Math.random())
    // },
    // createCampaignFilter (queryString) {
    //   return (campaigns) => {
    //     return (campaigns.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    //   }
    // },
    // handleSelectCampaign (item) {
    //   this.mappedCampaign.campaign = {
    //     name: item.name,
    //     cluster: item.cluster,
    //     deadline: item.deadline,
    //     protocolDeadLine: item.protocolDeadline,
    //     paymentDeadLine: item.paymentDeadline
    //   }
    // },
    // searchNegotiators (query) {
    //   if (query !== '') {
    //     this.loading = true
    //     setTimeout(() => {
    //       this.loading = false
    //       this.filteredNegotiators = this.negotiatorsList.filter(item => {
    //         return item.name.toLowerCase()
    //           .indexOf(query.toLowerCase()) > -1
    //       })
    //     }, 1000 * Math.random())
    //   } else {
    //     this.filteredNegotiators = []
    //   }
    // },
    showStrategyMessages () {
      this.dialogVisible = true
      this.$store.dispatch('showLoading')
      this.$store.dispatch('getStrategyEngagement', this.strategy.id).then(response => {
        this.strategyEngagements = response.steps
        this.$store.dispatch('hideLoading')
      }).catch(error => {
        console.error(error)
        this.$store.dispatch('hideLoading')
      })
    },
    getIcon (channel) {
      switch (channel) {
        case 'WHATSAPP':
          return 'whatsapp'
        case 'EMAIL':
          return 'email'
        case 'EMAIL_CNA':
          return 'cna'
        case 'DELAY':
          return 'clock'
        default:
          return 'sms'
      }
    }
  }
}
</script>

<style lang="scss">
.jus-import-feedback-card {
  width: 100%;
  &+.jus-import-feedback-card {
    margin-top: 30px;
  }
  .el-tag--mapped-campaign-tag {
    margin-bottom: 10px;
    text-align: center;
    color: #ffffff;
  }
  .el-autocomplete, .el-select, .el-input, .select-strategy__messages {
    width: 100%;
  }
  .select-strategy{
    .el-input__inner {
      border: 0 !important;
    }
  }
  .jus-import-feedback-card__number {
    .el-input__inner {
      border-left: 1px solid #dcdfe6 !important;
      border-right: 1px solid #dcdfe6 !important;
      border-top: 0 !important;
      border-bottom: 0 !important;
    }
  }
  .el-input__inner {
    border-bottom: 1px solid #dcdfe6 !important;
    border-top: 0;
    border-left: 0;
    border-right: 0;
  }

  .el-input__inner {
    border-color: #dcdfe6 !important;
  }
  .el-input-number {
    margin: 0 8px;
    width: 100px;
    .el-input__inner {
      border-top: 0;
      border-bottom: 0;
    }
  }
  .el-card__body {
    padding: 0;
    .el-select:last-of-type {
      .el-input__inner {
        border-bottom: 0;
      }
    }
  }
  .el-select__tags {
    margin-left: 35px;
  }
  .el-icon-circle-check-outline {
    color: #d1dbe2;
  }
  .select-strategy__messages {
    border-bottom: 1px solid #dcdfe6;
    a {
      display: block;
      padding: 0px 0px 10px 16px;
    }
  }
  .select-negotiator {
    .el-select__input {
      margin-left: 5px;
    }
  }
  &__number {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 13px;
    width: 100%;
    border-bottom: 1px solid #dcdfe6;
    .el-icon-circle-check-outline, .el-icon-circle-check {
      font-size: 1.3rem;
      margin-right: 5px;
    }
  }
  .el-select {
    .el-select__tags-text {
      color: #424242;
    }
    .el-tag__close.el-icon-close {
      background-color: #adadad;
    }
  }
}
.jus-import-feedback-card__engagement {
  min-height: 100px;
  padding-bottom: 40px;
  .el-collapse-item__header {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 16px;
    img {
      margin-right: 10px;
    }
  }
  .el-collapse-item__arrow {
    padding-left: 10px;
  }
  .el-collapse-item__content {
    border-top: 1px solid #eeeeee;
  }
}
</style>
