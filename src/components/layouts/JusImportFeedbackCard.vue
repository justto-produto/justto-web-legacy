<template>
  <div class="jus-import-feedback-card">
    <el-tag :color="color" class="el-tag--mapped-campaign-tag">{{ campaignTitle }}</el-tag>
    <el-card :style="'border-left: solid 4px ' + color">
      <el-input v-model="respondent" data-testid="feedback-respondent" placeholder="Dê um nome para o seu Réu">
        <i
          slot="prefix"
          :class="respondent === '' ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
          class="el-input__icon" />
      </el-input>
      <el-input v-model="campaignName" data-testid="feedback-campaignName" placeholder="Dê um nome para a sua Campanha">
        <i
          slot="prefix"
          :class="campaignName === '' ? 'el-icon-circle-check-outline' : 'el-icon-circle-check el-input__icon--success'"
          class="el-input__icon" />
      </el-input>
      <el-select
        ref="strategySelect"
        v-model="strategy"
        :default-first-option="false"
        value-key="name"
        clearable
        class="select-strategy"
        placeholder="Escolha uma estratégia"
        data-testid="feedback-strategy">
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
      <div v-if="isPaymentStrategy" class="jus-import-feedback-card__number">
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
      <div v-if="isPaymentStrategy" class="jus-import-feedback-card__number">
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
        placeholder="Defina a data limite para a negociação"
        data-testid="feedback-datapicker" />
      <el-select
        v-model="negotiatorIds"
        value-key="name"
        size="large"
        multiple
        placeholder="Escolha os negociadores"
        class="select-negotiator"
        data-testid="feedback-negotiators">
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
      default: () => {}
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
      initialCampaignName: '',
      mappedName: '',
      respondent: '',
      protocolDeadLine: 1,
      paymentDeadLine: 1,
      campaignName: '',
      campaignTimeout: null,
      strategy: '',
      strategyId: '',
      dialogVisible: false,
      dueDate: null,
      negotiatorIds: [],
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
    negotiatorsList () {
      return this.$store.state.workspaceModule.members
    },
    campaignTitle () {
      return this.campaignName ? this.campaignName : this.initialCampaignName ? this.initialCampaignName : 'Campanha ' + this.index
    },
    isPaymentStrategy () {
      let isStrategy = false
      if (this.strategy && this.strategy.types) {
        this.strategy.types.map(type => {
          if (type.includes('PAYMENT')) isStrategy = true
        })
        return isStrategy
      } else {
        return false
      }
    }
  },
  watch: {
    respondent (value) {
      this.mappedCampaign.respondent = value
    },
    campaignName (value) {
      this.mappedCampaign.name = value
    },
    strategy (value) {
      this.mappedCampaign.strategy = value.name
      this.mappedCampaign.strategyId = value.id
    },
    dueDate (value) {
      this.mappedCampaign.deadline = {
        dateTime: this.$moment(value).format('YYYY-MM-DD[T]HH:mm:ss[Z]')
      }
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
    this.initialCampaignName = this.mappedCampaign.name
    this.mappedCampaign.campaign = {}
    this.mappedCampaign.protocolDeadLine = this.protocolDeadLine
    this.mappedCampaign.paymentDeadLine = this.paymentDeadLine
    if (this.mappedCampaign.respondent) {
      this.respondent = this.mappedCampaign.respondent
    }
    if (this.mappedCampaign.dueDate && this.mappedCampaign.dueDate !== '0') {
      this.dueDate = this.mappedCampaign.dueDate
    }
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
