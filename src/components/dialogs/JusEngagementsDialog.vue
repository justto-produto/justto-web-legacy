<template>
  <el-dialog :visible.sync="dialog" class="el-dialog--lg jus-engagements-dialog">
    <template slot="title">
      <h2>Estratégia de engajamento das partes</h2>
      <p>
        Abaixo, você encontra as mensagens a serem enviadas para às partes das disputas contidas
        nesta Campanha. Com os dados da sua disputas, nosso sistema escolhe a melhor estratégia de
        engajamento para as suas disputas.
      </p>
    </template>
    <el-collapse v-loading="$store.state.loading" class="jus-engagements-dialog__engagement el-collapse--bordered">
      <div v-for="step in strategyEngagements" :key="step.id">
        <div v-if="step.channel != 'DELAY'" class="jus-engagements-dialog__step">Envio</div>
        <el-collapse-item v-if="step.channel !== 'DELAY'">
          <template slot="title">
            <jus-icon :icon="getIcon(step.channel)" is-active/> {{ step.name | capitalize }}
          </template>
          <div v-if="step.template">
            <h3>{{ step.template.title }}</h3>
            <span v-html="step.template.body" />
          </div>
        </el-collapse-item>
        <div v-else class="jus-engagements-dialog__wait">
          <jus-icon :icon="getIcon(step.channel)" is-active/> {{ step.name }}
        </div>
      </div>
    </el-collapse>
  </el-dialog>
</template>

<script>
export default {
  name: 'JusEngagementsDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    strategyId: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      dialog: false,
      strategyEngagements: []
    }
  },
  watch: {
    dialogVisible (value) {
      if (value) {
        this.dialog = value
        this.getEngagements()
      }
    },
    dialog (value) {
      if (!value) this.$emit('update:dialogVisible', value)
    }
  },
  methods: {
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
    },
    getEngagements () {
      this.$store.dispatch('showLoading')
      this.$store.dispatch('getStrategyEngagement', this.strategyId).then(response => {
        this.strategyEngagements = response.steps
        this.$store.dispatch('hideLoading')
      }).catch(() => {
        this.$jusNotification({ type: 'error' })
        this.$store.dispatch('hideLoading')
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.jus-engagements-dialog {
  &__step {
    color: #dcdfe6;
    font-weight: bold;
    font-size: 12px;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  &__engagement {
    min-height: 100px;
    padding-bottom: 40px;
    .el-collapse-item__header {
      height: 100%;
      line-height: inherit;
      padding: 10px 0;
      font-size: 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      font-size: 16px;
      height: 100%;
      line-height: inherit;
      padding: 10px 0;
      font-size: 14px;
      img {
        margin-right: 10px;
      }
    }
    .el-collapse-item__arrow {
      padding-left: 10px;
      line-height: 20px;
      margin: 0;
    }
    .el-collapse-item__content {
      border-top: 1px solid #eeeeee;
    }
  }
  &__wait {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    color: $--color-primary;
    :first-child {
      margin-right: 10px;
    }
  }
}
</style>
