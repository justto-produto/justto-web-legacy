<template>
  <el-dialog
    :visible.sync="visible"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :title="`Quer notificar ${$options.filters.resumedName(name)} desta ação?`"
    append-to-body
    destroy-on-close
    width="604px"
    custom-class="dialog-actions__increase-alert"
  >
    <article class="dialog-actions__increase-alert-body">
      <label class="dialog-actions__increase-alert-body-label">
        Mensagem que será enviada:
      </label>
      <div
        class="dialog-actions__increase-alert-body-text"
        v-html="message"
      />
    </article>

    <div
      slot="footer"
      class="dialog-actions__increase-alert-footer"
    >
      <el-button
        size="small"
        type="default"
        @click="handleCompanyAnalysisAction('NEVER')"
      >
        Não notificar
      </el-button>

      <el-button
        size="small"
        type="secondary"
        @click="handleCompanyAnalysisAction('ALWAYS')"
      >
        Sempre notificar
      </el-button>

      <el-button
        size="small"
        type="primary"
        @click="handleCompanyAnalysisAction('ASK')"
      >
        Notificar somente dessa vez
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'

const actionToTemplateId = {
  DISFAVOR: 4500,
  FAVORITE: 4494
}

export default {
  data: () => ({
    disputeId: null,
    visible: false,
    message: '',
    email: '',
    name: ''
  }),

  methods: {
    ...mapActions([
      'getAccountProperty',
      'setAccountProperty',
      'getQuickReplyTemplates',
      'sendemail'
    ]),

    async open(action, ticket) {
      if (Object.keys(ticket.lastReceivedMessage?.properties).length > 0) {
        const { PERSON_EMAIL, PERSON_NAME } = ticket.lastReceivedMessage?.properties

        if (!ticket.lastReceivedMessage?.properties?.PERSON_EMAIL) {
          this.$jusNotification({
            type: 'error',
            title: 'Ops!',
            message: 'E-mail do destinatário não foi encontrado'
          })
          close()
          return
        } else if (!ticket.lastReceivedMessage?.properties?.PERSON_NAME) {
          this.$jusNotification({
            type: 'error',
            title: 'Ops!',
            message: 'Nome do destinatário não foi encontrado'
          })
          close()
          return
        } else {
          this.email = PERSON_EMAIL
          this.name = PERSON_NAME
        }
      } else {
        close()
        return
      }

      await this.getQuickReplyTemplates(this.$route.params.id).then(res => {
        res.forEach(({ parsed: { body, referenceTemplateId } }) => {
          if (referenceTemplateId === actionToTemplateId[action]) {
            this.message = body
          }
        })
      })

      if (!this.message) {
        close()
        return
      }

      this.getAccountProperty('FAVORITE_NOTIFICATION').then(({ FAVORITE_NOTIFICATION = '' }) => {
        if (['ALWAYS'].includes(FAVORITE_NOTIFICATION)) {
          this.sendMessage()
        } else {
          this.visible = true
        }
      })
    },

    close() {
      this.disputeId = null
      this.visible = false
      this.message = ''
      this.email = ''
      this.name = ''
    },

    handleCompanyAnalysisAction(action) {
      switch (action) {
        case 'ALWAYS':
          this.sendMessage()
          this.setAccountProperty({ FAVORITE_NOTIFICATION: 'ALWAYS' })
          break
        default:
          if (action === 'ASK') {
            this.sendMessage()
          }
          this.setAccountProperty({ FAVORITE_NOTIFICATION: '' })
          break
      }

      this.close()
    },

    sendMessage() {
      const data = {
        to: [{ address: this.email }],
        disputeId: this.disputeId,
        attachments: [],
        message: this.message,
        externalIdentification: null,
        inReplyTo: null
      }

      this.sendemail(data).then(() => {
        this.$jusNotification({
          type: 'success',
          title: 'Yay!',
          message: 'Notificação enviada com sucesso'
        })
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(this.close)
    }
  }
}
</script>

<style lang="scss">
.dialog-actions__increase-alert {
  .el-dialog__body {
    margin-top: 0 !important;

    .dialog-actions__increase-alert-body {
      .dialog-actions__increase-alert-body-label {
        font-weight: 600;
      }

      .dialog-actions__increase-alert-body-text {
        word-break: keep-all;
      }
    }
  }
}
</style>
