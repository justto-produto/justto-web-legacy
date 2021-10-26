<template>
  <el-dialog
    :title="state.title"
    :visible.sync="state.visible"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    center
    append-to-body
    custom-class="confirm-dialog"
  >
    <article class="confirm-dialog__container">
      <p>
        {{ state.message }}
      </p>

      <div
        v-if="state.action === 'FAVORITE' && features.AUTOMATIC_MESSAGES"
        class="confirm-dialog__container-favorite"
      >
        <p>
          <sup>*</sup>
          Ao confirmar esta ação, se receber novas mensagens da parte iremos responder automaticamente com a mensagem a seguir:
        </p>

        <p
          class="confirm-dialog__container-favorite-message"
          v-html="parsedTemplatesById[5111] || ''"
        />
      </div>
    </article>

    <span
      slot="footer"
      class="el-dialog__footer-container"
    >
      <div class="el-dialog__footer-container__buttons">
        <el-button
          @click="cancelAction()"
        >
          Cancelar
        </el-button>

        <el-button
          type="primary"
          @click="confirmAction()"
        >
          Confirmar
        </el-button>
      </div>

      <el-checkbox
        v-if="state.showNotifyInput"
        v-model="state.notify"
        class="el-dialog__footer-container__checkbox"
        @change="notifyAction"
      >
        Sempre notificar parte
      </el-checkbox>

    </span>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data: () => ({
    state: {
      title: '',
      notify: false,
      visible: false,
      showNotifyInput: false,
      message: 'Tem certeza que deseja realizar esta ação?'
    }
  }),

  computed: {
    ...mapGetters({
      templates: 'quickReplyTemplates',
      features: 'getMappedFeaturesAndModules'
    }),

    parsedTemplatesById() {
      return (this.templates || []).reduce((acc, { parsed }) => {
        acc[parsed.referenceTemplateId] = parsed.body
        return acc
      }, {})
    }
  },

  methods: {
    open(state) {
      this.state = {
        ...this.state,
        ...state
      }
    },

    cancelAction() {
      this.$emit('cancel', this.state)
      this.handleCancel()
      this.close()
    },

    confirmAction() {
      this.$emit('confirm', this.state)
      this.handleConfirm()
      this.close()
    },

    notifyAction(value) {
      this.$emit('notify', value)
      this.handleNotify(value)
    },

    handleNotify(notify) {},
    handleConfirm() {},
    handleCancel() {},

    close() {
      this.state = {
        title: '',
        notify: false,
        visible: false,
        showNotifyInput: false,
        message: 'Tem certeza que deseja realizar esta ação?'
      }

      this.$emit('close')

      this.handleNotify = (notify) => {}
      this.handleConfirm = () => {}
      this.handleCancel = () => {}
    }
  }
}
</script>

<style lang="scss">
.el-dialog.confirm-dialog {
  .el-dialog__body {
    .confirm-dialog__container {
      display: flex;
      flex-direction: column;
      text-align: center;

      .confirm-dialog__container-favorite {
        word-break: break-word;

        .confirm-dialog__container-favorite-message {
          border: solid thin lightgray;
          padding: 8px;
          border-radius: 10px;
        }
      }
    }
  }

  .el-dialog__footer {
    .el-dialog__footer-container {
      display: flex;
      flex-direction: column;
      gap: 24px;

      .el-dialog__footer-container__checkbox {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .el-dialog__footer-container__buttons {
        display: flex;
        justify-content: center;

        gap: 32px;
      }
    }
  }
}
</style>
