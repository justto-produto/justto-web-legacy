<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialog"
      width="80%"
      class="jus-engagements-dialog"
    >
      <template slot="title">
        <h2>Estratégia de engajamento das partes</h2>
        <p v-if="!isManual">
          Abaixo, você encontra as mensagens a serem enviadas para às partes das disputas contidas
          nesta Campanha. Com os dados da sua disputas, nosso sistema escolhe a melhor estratégia de
          engajamento para as suas disputas.
        </p>
      </template>
      <p v-if="isManual">
        Essa estratégia não possuí mensagens pré-definidas e não envia mensagens automáticas; Todas as mensagens devem ser enviadas manualmente pelo negociador usando a plataforma Justto 3DR.
      </p>
      <el-collapse
        v-else
        ref="collapse"
        v-loading="$store.state.loading"
        class="jus-engagements-dialog__engagement el-collapse--bordered"
      >
        <div
          v-for="step in strategy.communications"
          :key="step.id"
        >
          <div
            v-if="!step.archived"
            @click="getTemplates(step)"
          >
            <div
              v-if="step.type != 'DELAY'"
              class="jus-engagements-dialog__step"
            >
              Envio
            </div>
            <el-collapse-item v-if="step.type !== 'DELAY'">
              <template slot="title">
                <jus-icon :icon="getIcon(step.type)" />
                {{ step.name | capitalize }}
              </template>
              <div v-if="step.template">
                <h3>{{ step.template.title }}</h3>
                <span v-html="step.template.body" />
              </div>
              <div
                v-else
                class="jus-engagements-dialog__step-loading"
              >
                <i class="el-icon-loading" />
              </div>
            </el-collapse-item>
            <div
              v-else
              class="jus-engagements-dialog__wait"
            >
              <jus-icon
                :icon="getIcon(step.type)"
                is-active
              /> {{ step.name }}
            </div>
          </div>
        </div>
      </el-collapse>
    </el-dialog>
    <el-dialog
      :visible.sync="editDialog"
      width="70%"
    >
      <div v-if="!preview">
        <el-input
          v-if="communication.template"
          v-model="communication.template.title"
          :disabled="editDialogLoading"
        />
        <br><br>
        <el-input
          v-if="communication.template"
          v-model="communication.template.body"
          :disabled="editDialogLoading"
          class="jus-engagements-dialog__textarea"
          type="textarea"
        />
      </div>
      <div v-else>
        <h2 style="margin: 20px;">
          {{ communication.template.title }}
        </h2>
        <br><br>
        <span v-html="communication.template.body" />
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :disabled="editDialogLoading"
          :icon="preview ? 'el-icon-edit' : 'el-icon-view'"
          plain
          @click="preview = !preview"
        >
          {{ preview ? 'Voltar' : 'Visualizar' }}
        </el-button>
        <el-button
          :disabled="editDialogLoading"
          plain
          @click="editDialog = false"
        >Cancelar</el-button>
        <el-button
          v-loading="editDialogLoading"
          type="primary"
          @click="editTemplate"
        >Editar template</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'JusEngagementsDialog',
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      required: true
    },
    isManual: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      communication: '',
      editDialog: false,
      editDialogLoading: false,
      editorKey: 0,
      preview: false
    }
  },
  computed: {
    ...mapGetters({
      strategies: 'getMyStrategiesLite'
    }),
    strategy() {
      return this.strategies.find(el => {
        return el.id === this.value.id
      }) || { communications: [] }
    },
    strategyId() {
      return this.value.id
    }
  },
  watch: {
    dialogVisible(value) {
      this.dialog = value
      if (!this.isManual) this.getEngagements()
    },
    dialog(value) {
      this.$emit('update:dialogVisible', value)
    }
  },
  methods: {
    ...mapActions([
      'getStrategyCommunicationTemplate',
      'getStrategyEngagementLite',
      'showLoading',
      'hideLoading'
    ]),
    openEditDialog(step) {
      this.preview = false
      this.editDialog = true
      this.communication = step
    },
    editTemplate() {
      this.editDialogLoading = true
      this.$store.dispatch('editStrategyTemplate', {
        id: this.communication.template.id,
        contentType: 'TEXT',
        title: this.communication.template.title,
        body: this.communication.template.body,
        protocolId: this.communication.template.protocolId
      }).then(() => {
        this.editDialog = false
        this.getEngagements()
        this.$jusNotification({
          title: 'Yay!',
          message: 'Template editado com sucesso',
          type: 'success'
        })
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.editDialogLoading = false
      })
    },
    getIcon(type) {
      switch (type) {
        case 'WHATSAPP':
          return 'whatsapp'
        case 'EMAIL':
          return 'email'
        case 'EMAIL_CNA':
          return 'email-cna'
        case 'DELAY':
          return 'clock'
        default:
          return 'sms'
      }
    },
    getEngagements() {
      this.showLoading()
      this.getStrategyEngagementLite(this.strategyId).then(response => {
        this.$forceUpdate()
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(this.hideLoading)
    },
    getTemplates({ id }) {
      if (this.$refs.collapse.activeNames.length) {
        this.getStrategyCommunicationTemplate({
          strategyId: this.strategyId,
          comunicationId: id
        }).then(() => {
          this.$forceUpdate()
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.jus-engagements-dialog__step-loading {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

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
  .el-dialog__body {
    padding: 10px 20px 40px;
  }
  &__textarea .el-textarea__inner {
    height: 50vh;
    resize: none;
  }
}
</style>
