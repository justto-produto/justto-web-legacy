<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="automaticMessagesDialogVisible"
    :fullscreen="windowMode !== 'desktop'"
    title="Defina quando o sistema deve automatizar ações"
    custom-class="automatic-messages-dialog"
    width="50%"
  >
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

        <!-- <el-form-item>
          <span slot="label">
            O sistema identifica e sugere ao negociador ações automáticas que, caso aceitas pelo negociador, passarão a ser executadas automaticamente pelo sistema em situações similares.
          </span>

          <el-radio
            v-model="sendAutomaticMessage"
            label="ASK"
          >
            Permitir que o negociador decida
          </el-radio>
        </el-form-item> -->

        <el-form-item>
          <span slot="label">
            Defina quais ações que devem ser executadas automaticamente.
          </span>

          <el-radio
            v-model="sendAutomaticMessage"
            label="CUSTOM"
          >
            Customizar ações
          </el-radio>
        </el-form-item>
      </el-form>

      <div
        v-if="sendAutomaticMessage === 'CUSTOM'"
        class="el-dialog__body-container__custom-properties"
      >
        <el-switch
          v-for="key in Object.keys(customProperties)"
          :key="key"
          v-model="customProperties[key]"
          :active-text="$tc(`configurations.property.${key}.title`)"
          @input="$forceUpdate()"
        />
      </div>
    </span>

    <span
      slot="footer"
      class="el-dialog__footer-container"
    >
      <el-button
        size="small"
        @click="close()"
      >
        Cancelar
      </el-button>

      <el-button
        type="success"
        size="small"
        @click="save()"
      >
        Confirmar
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

const CUSTOM_PROPERTIES = {
  NOTIFY_UNANSWERED_EMAIL: true,
  NOTIFY_UNANSWERED_WHATSAPP: true,
  NOTIFY_OUT_OF_BUSINESS_HOURS: true,
  SEND_COUNTEROFFER: true,
  SEND_DISPUTE_INFO_REPLY: true,
  DISPUTE_UNDER_ANALYSIS_REPLY: true
}

export default {
  name: 'AutomaticMessagesDialog',
  data: () => ({
    automaticMessagesDialogVisible: false,
    sendAutomaticMessage: 'ALWAYS'
  }),

  computed: {
    ...mapGetters({
      isRecovery: 'isWorkspaceRecovery',
      properties: 'workspaceProperties',
      windowMode: 'getWindowMode'
    }),

    customProperties() {
      const { NOTIFY_UNANSWERED_WHATSAPP, ...properties } = CUSTOM_PROPERTIES

      return this.isRecovery ? properties : CUSTOM_PROPERTIES
    }
  },

  methods: {
    ...mapActions({
      editProperties: 'editWorkpaceProperties',
      getFeatureProperties: 'getFeatureProperties',
      saveFeatureProperties: 'saveFeatureProperties'
    }),

    openFeatureDialog() {
      this.sendAutomaticMessage = this.properties.SEND_AUTOMATIC_MESSAGES || 'ALWAYS'
      this.automaticMessagesDialogVisible = true

      this.getFeatureProperties(3).then(({ properties }) => {
        properties.forEach(({ key, value }) => {
          this.customProperties[key] = !(value === String(false))
          this.$forceUpdate()
        })
      })
    },

    close() {
      this.automaticMessagesDialogVisible = false
    },

    save() {
      const { customProperties } = this

      const properties = Object.keys(customProperties).reduce((acc, key) => {
        acc[key] = String(customProperties[key] === true)

        return [...acc, { key, value: String(customProperties[key] === true) }]
      }, [])

      this.editProperties({
        SEND_AUTOMATIC_MESSAGES: this.sendAutomaticMessage
      }).then(() => {
        this.saveFeatureProperties({ featureId: 3, properties })
      }).finally(() => this.close())
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

      .el-dialog__body-container__custom-properties {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-left: 24px;
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
