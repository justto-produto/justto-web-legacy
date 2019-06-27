<template>
  <div class="jus-import-feedback-card">
    <el-tag :color="color" class="el-tag--mapped-campaign-tag">{{ mappedName ? mappedName : 'Campanha ' + index }}</el-tag>
    <el-card :style="'border-left: solid 4px ' + color">
      <el-input v-model="respondent" placeholder="Dê um nome para o seu Réu">
        <i
          slot="prefix"
          :class="respondent === '' ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
          class="el-input__icon" />
      </el-input>
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
        clearable
        class="select-strategy"
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
        <a v-show="strategy !== ''" @click.prevent="dialogVisible = true">Ver estratégia de engajamento das partes</a>
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
          <span class="jus-import-feedback-card__sufix">
            dia(s) corridos após acordo
          </span>
        </div>
      </div>
      <div v-if="strategy.id === 1 || strategy.id === 4" class="jus-import-feedback-card__number">
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
          <span class="jus-import-feedback-card__sufix">
            dia(s) corridos após o protocolo
          </span>
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
          :key="item.person.id"
          :label="item.person.name"
          :value="item.person.id">
          <jus-avatar-user
            :name="item.person.name"
            shape="circle"
            size="xs"
            style="vertical-align: middle" />
          <span style="vertical-align: middle;margin-left: 10px;">{{ item.person.name }}</span>
        </el-option>
      </el-select>
    </el-card>
    <jus-engagements-dialog
      :dialog-visible.sync="dialogVisible"
      :strategy-id="strategy.id"
    />
  </div>
</template>

<script>
import JusEngagementsDialog from '@/components/dialogs/JusEngagementsDialog'

export default {
  name: 'JusImportFeedbackCard',
  components: { JusEngagementsDialog },
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
    },
    index: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      mappedName: '',
      respondent: '',
      protocolDeadLine: 1,
      paymentDeadLine: 1,
      campaignName: '',
      campaignTimeout: null,
      strategy: '',
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
      return this.$store.getters.strategyList
    },
    // campaigns () {
    //   return this.$store.state.campaignModule.list
    // },
    negotiatorsList () {
      return this.$store.state.workspaceModule.members
    }
  },
  watch: {
    respondent (value) {
      this.mappedCampaign.respondent = value
      this.mappedCampaign.newName = value
      this.campaignName = value
    },
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
    // }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

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
    color: $--color-cloudy-blue;
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
  &__sufix {
    width: 218px;
    display: inline-block;
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
    .el-input__inner {
      border-left: 1px solid #dcdfe6 !important;
      border-right: 1px solid #dcdfe6 !important;
      border-top: 0 !important;
      border-bottom: 0 !important;
    }
  }
  .el-select {
    .el-select__tags-text {
      color: $--color-text-regular;
    }
    .el-tag__close.el-icon-close {
      background-color: $--color-text-secondary;
    }
  }
}
</style>
