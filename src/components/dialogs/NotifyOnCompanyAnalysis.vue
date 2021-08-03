<template>
  <el-dialog
    v-if="visible"
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
      <el-tooltip
        content="Não notificará desta vez, porém perguntará se deve notificar na próxima."
        placement="top"
      >
        <el-button
          size="small"
          type="default"
          @click="handleCompanyAnalysisAction('NEVER')"
        >
          Não notificar
        </el-button>
      </el-tooltip>

      <el-tooltip
        content="Notificará desta vez, e todas as próximas."
        placement="top"
      >
        <el-button
          size="small"
          type="secondary"
          @click="handleCompanyAnalysisAction('ALWAYS')"
        >
          Sempre notificar
        </el-button>
      </el-tooltip>

      <el-tooltip
        content="Notificará desta vez e perguntará se deve notificar na próxima."
        placement="top"
      >
        <el-button
          size="small"
          type="primary"
          @click="handleCompanyAnalysisAction('ASK')"
        >
          Notificar somente dessa vez
        </el-button>
      </el-tooltip>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

const actionToTemplateId = {
  DISFAVOR: 4500,
  FAVORITE: 4494
}

export default {
  data: () => ({
    disputeId: null,
    visible: false,
    message: '',
    action: '',
    email: '',
    name: ''
  }),

  computed: {
    ...mapGetters({
      userPreferences: 'userPreferences'
    })
  },

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

        if (!ticket.lastReceivedMessage?.properties?.PERSON_EMAIL || !ticket.lastReceivedMessage?.properties?.PERSON_NAME) {
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

      this.disputeId = Number(this.$route.params.id)

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

      this.action = action

      this.getAccountProperty('ACTION_NOTIFICATION').then(({ ACTION_NOTIFICATION = '[]' }) => {
        if (JSON.parse(ACTION_NOTIFICATION).filter(item => (Number(item.disputeId) === Number(this.disputeId) && item.action === action)).length) {
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
      this.action = ''
      this.email = ''
      this.name = ''
    },

    handleCompanyAnalysisAction(key) {
      const { action, disputeId } = this

      const ACTION_NOTIFICATION = JSON.parse(this.userPreferences.properties.ACTION_NOTIFICATION || '[]')

      switch (key) {
        case 'ALWAYS':
          this.sendMessage()
          this.setAccountProperty({
            ACTION_NOTIFICATION: JSON.stringify([
              ...ACTION_NOTIFICATION,
              { action, disputeId }
            ])
          })
          break
        default:
          if (key === 'ASK') {
            this.sendMessage()
          }

          this.setAccountProperty({
            ACTION_NOTIFICATION: JSON.stringify([
              ...ACTION_NOTIFICATION.filter(item => !(item.action === action && Number(item.disputeId) === Number(disputeId)))
            ])
          })
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
