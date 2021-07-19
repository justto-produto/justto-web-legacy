<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="automaticMessagesDialogVisible"
    custom-class="automatic-messages-dialog"
    width="50%"
  >
    <span
      slot="title"
      class="el-dialog__header-title"
    >
      Defina quando o sistema deve automatizar ações
    </span>

    <span class="el-dialog__body-container">
      <el-form ref="form">
        <el-form-item>
          <span slot="label">
            O sistema identifica e executa certas ações automaticamente na negociação.
          </span>

          <el-radio
            v-model="sendAutomaticMessage"
            label="ALWAYS"
          >
            Sempre definido como automático
          </el-radio>
        </el-form-item>

        <el-form-item>
          <span slot="label">
            O sistema identifica e sugere ao negociador ações automáticas que, caso aceitas pelo negociador, passarão a ser executadas automaticamente pelo sistema em situações similares.
          </span>

          <el-radio
            v-model="sendAutomaticMessage"
            label="AKS"
          >
            Permitir que o negociador decida
          </el-radio>
        </el-form-item>
      </el-form>
    </span>

    <span
      slot="footer"
      class="el-dialog__footer-container"
    >
      <!-- TODO: SAAS-4075 Implementar botões de cancelar e salvar -->
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'AutomaticMessagesDialog',
  data: () => ({
    automaticMessagesDialogVisible: false,
    sendAutomaticMessage: 'ALWAYS'
  }),

  computed: {
    ...mapGetters({
      properties: 'workspaceProperties'
    })
  },

  beforeMount() {
    this.sendAutomaticMessage = this.properties.SEND_AUTOMATIC_MESSAGES || ''
  },

  methods: {
    ...mapActions({
      editProperties: 'editWorkpaceProperties'
    }),

    openFeatureDialog() {
      this.automaticMessagesDialogVisible = true
    },

    save() {
      this.editProperties({
        SEND_AUTOMATIC_MESSAGES: this.sendAutomaticMessage
      })
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.automatic-messages-dialog {
  .el-dialog__header {
    .el-dialog__header-title {
      line-height: 24px;
      font-size: 20px;
      color: $--color-black;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }

  .el-dialog__body {
    padding-top: 0;
    padding-bottom: 0;

    .el-dialog__body-container {
      .el-form {
        .el-form-item {
          display: flex;
          flex-direction: column-reverse;

          .el-form-item__content {
            .el-radio {
              .el-radio__label {
                font-weight: 600;
              }
            }
          }

          .el-form-item__label {
            display: flex;
            justify-content: flex-start;

            span {
              text-align: left;
              line-height: 16px;
              color: $--color-text-secondary;
              margin-left: 24px;
            }
          }
        }
      }
    }
  }

  .el-dialog__footer {
    .el-dialog__footer-container {
      display: flex;
      justify-content: space-evenly;
    }
  }
}
</style>
