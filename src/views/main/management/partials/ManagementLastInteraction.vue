<template>
  <div class="last-interactions-table">
    <el-popover
      v-if="data.getDisputeHasLastOutboundInteraction"
      trigger="hover"
      popper-class="el-popover--dark"
      @show="getMessageSummaryHandler(data.getDisputeLastOutboundInteractionMessage, data.getDisputeId)"
      @hide="messageSummary = {}"
    >
      <div>
        <strong v-if="data.getDisputeHasLastOutboundInteraction">
          <jus-icon
            :icon="getInteractionIcon(data.getDisputeLastOutboundInteraction)"
            is-white
          />
          Último {{ getLastInteractionTooltip(data.getDisputeLastOutboundInteraction) }}
          em {{ data.getDisputeLastOutboundInteractionCreateAt | moment('DD/MM/YYYY [às] HH:mm') }}
        </strong>
      </div>
      <div v-if="data.getDisputeLastOutboundInteractionMessage.sender">
        De: {{ data.getDisputeLastOutboundInteractionMessage.sender | phoneNumber }}
      </div>
      <div v-if="data.getDisputeLastOutboundInteractionMessage.receiver">
        Para: {{ data.getDisputeLastOutboundInteractionMessage.receiver | phoneNumber }}
      </div>
      <span v-if="data.getDisputeLastOutboundInteractionMessage.parameters.READ_DATE && Object.keys(messageSummary).length">
        <div v-if="messageSummary.countVisualization !== null">
          Total de visualizações: {{ messageSummary.countVisualization }}
        </div>
        <div v-if="messageSummary.countClick !== null">
          Total de clicks: {{ messageSummary.countClick }}
        </div>
        <div v-if="messageSummary.firstVisualizationDate !== null">
          Primeira visualização: {{ messageSummary.firstVisualizationDate.dateTime | moment('DD/MM/YYYY [às] HH:mm') }}
        </div>
        <div v-if="messageSummary.lastVisualizationDate !== null">
          Última visualização: {{ messageSummary.lastVisualizationDate.dateTime | moment('DD/MM/YYYY [às] HH:mm') }}
        </div>
        <div v-if="messageSummary.firstClickDate !== null">
          Primeiro click: {{ messageSummary.firstClickDate.dateTime | moment('DD/MM/YYYY [às] HH:mm') }}
        </div>
        <div v-if="messageSummary.lastClickDate !== null">
          Último click: {{ messageSummary.lastClickDate.dateTime | moment('DD/MM/YYYY [às] HH:mm') }}
        </div>
      </span>
      <jus-icon
        slot="reference"
        :icon="`status-${data.getDisputeLastOutboundInteractionMessage.parameters.READ_DATE ? 'readed' : 'sent'}`"
      />
    </el-popover>

    <el-tooltip>
      <div slot="content">
        <negotiator-interaction
          :value="data"
          :dialog-visibility.sync="canShowDialogReplyEditor"
        >
          <div slot="condition">
            <span v-if="data.getDisputeHasLastNegotiatorAccess">
              <span>
                Último acesso ao sistema ProJuris: <strong>{{ data.getDisputeLastNegotiatorAccessCreatAt | moment('DD/MM/YYYY [às] HH:mm') }}</strong>
              </span>
            </span>

            <span v-else>
              Ainda não houve acesso ao sistema ProJuris de Negociação
            </span>
          </div>
        </negotiator-interaction>
      </div>
      <jus-icon
        :is-active="data.getDisputeHasLastNegotiatorAccess"
        icon="justto-access"
      />
    </el-tooltip>

    <el-popover
      v-if="data.getDisputeHasLastReceivedMessage"
      trigger="hover"
      popper-class="el-popover--dark"
      @after-enter="startResponseBox(data.getDisputeId)"
      @hide="hideResponseBox(data.getDisputeId)"
    >
      <div>
        <div>
          <strong v-if="data.getDisputeHasLastReceivedMessage">
            <jus-icon
              :icon="getInteractionIcon(data.getDisputeLastReceivedMessage)"
              is-white
            />
            {{ getLastInteractionTooltip(data.getDisputeLastReceivedMessage) }}
            recebido em {{ data.getDisputeLastReceivedMessage.createAt.dateTime | moment('DD/MM/YYYY [às] HH:mm') }}
          </strong>
        </div>
        <div v-if="data.getDisputeLastReceivedMessageHasSender">
          De: {{ data.getDisputeLastReceivedMessageSender | phoneNumber }}
        </div>
        <div
          v-if="data.getDisputeLastReceivedMessageHasResume"
          class="last-interactions-table__last-recived-message-tooltip"
          v-html="`Resumo: ${data.getDisputeLastReceivedMessageResume}${data.getDisputeLastReceivedMessageResume.length >= 140 ? '...' : ''}`"
        />
        <div
          class="position-relative"
          style="width: 100%;text-align: right;min-width:300px"
        >
          <el-button
            v-if="!responseBoxVisible"
            size="mini"
            icon="el-icon-s-promotion"
            style="margin-top: 10px;"
            @click="showResponseBox()"
          >
            Responder
          </el-button>

          <div v-else>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-top-right"
              @click="openResponseDialog(data)"
            >
              Expandir
            </el-button>

            <el-input
              v-model="message"
              type="textarea"
              rows="4"
              placeholder="Escreva alguma coisa"
              style="padding-bottom: 10px"
            />

            <el-button
              size="mini"
              @click="hideResponseBox(data.getDisputeId, true)"
            >
              Cancelar
            </el-button>
            <el-button
              size="mini"
              icon="el-icon-s-promotion"
              @click="sendMessage(data)"
            >
              Enviar
            </el-button>
          </div>
        </div>
      </div>
      <span slot="reference">
        <span class="position-relative">
          <jus-icon
            v-if="data.getDisputeHasLastReceivedMessage"
            :icon="getInteractionIcon(data.getDisputeLastReceivedMessage)"
          />

          <i
            v-if="!data.getDisputeVisualized"
            class="last-interactions-table__interaction-pulse el-icon-warning el-icon-pulse el-icon-primary"
          />
        </span>
      </span>
    </el-popover>

    <div v-if="data.getDisputeHasLastInteraction">
      {{ getLastInteraction(data.getDisputeLastInteractionCreateAt) }}
    </div>

    <el-dialog
      :visible.sync="responseDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="`Resposta ao processo ${responseRow.getDisputeCode}`"
      append-to-body
      modal-append-to-body
      class="last-interactions-table__response-dialog"
    >
      <div v-if="Object.keys(responseRow).length">
        <div>
          Negociável até <b>{{ responseRow.getDisputeExpirationDate.dateTime | moment('DD/MM/YY') }}</b>.
        </div>

        <div>
          {{ $tc('UPPER_RANGE', isRecoveryStrategy) }} é de <b>{{ responseRow.getDisputeUpperRange | currency }}</b>
        </div>

        <div>
          Última proposta foi de <b>{{ responseRow.getDisputeLastOfferValue | currency }}</b>
        </div>

        <div v-if="responseRow.getDisputeLastCounterOfferValue">
          Contra proposta de <b>{{ responseRow.getDisputeLastCounterOfferValue | currency }}</b>
        </div>

        <div v-else>
          <b>Ainda não houve contraproposta</b>
        </div>

        <br>

        <div>
          Resposta via:
          <jus-icon :icon="answerVia" />

          <b>{{ answerVia | capitalize }}</b>
        </div>
        <div>
          Destinatário: <b>{{ responseRow?.getDisputeLastReceivedMessageSender ?? '' | phoneNumber }}</b>
        </div>

        <quill-editor
          v-if="responseDialogVisible"
          ref="messageEditor"
          v-model="richMessage"
          v-loading="responseBoxLoading"
          :class="{ 'show-toolbar': answerIcon === 'email' }"
          :options="editorOptions"
        />
      </div>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          :disabled="responseBoxLoading"
          plain
          @click="responseDialogVisible = false"
        >
          Cancelar
        </el-button>

        <el-button
          :loading="responseBoxLoading"
          type="primary"
          icon="el-icon-s-promotion"
          @click="sendMessage(responseRow)"
        >
          Enviar
        </el-button>
      </span>
    </el-dialog>

    <negotiator-activeReply
      v-model="canShowDialogReplyEditor"
      :dispute="data"
      @close="canShowDialogReplyEditor = false"
    />
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  getLastInteraction,
  getInteractionIcon,
  getLastInteractionTooltip
} from '@/utils'

import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import Quill from 'quill'
const SizeStyle = Quill.import('attributors/style/size')
const AlignStyle = Quill.import('attributors/style/align')
Quill.register(AlignStyle, true)
Quill.register(SizeStyle, true)

export default {
  name: 'ManagementLasrInteractions',

  components: {
    quillEditor,
    NegotiatorInteraction: () => import('./partials/NegotiatorInteraction'),
    NegotiatorActiveReply: () => import('./partials/NegotiatorActiveReply')
  },

  props: {
    data: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      message: '',
      messageCache: {},
      messageSummary: {},
      responseRow: {},
      responseBoxVisible: false,
      responseBoxLoading: false,
      responseDialogVisible: false,
      canShowDialogReplyEditor: false,
      richMessage: '',
      replyMessage: ''
    }
  },

  computed: {
    ...mapGetters({
      isRecoveryStrategy: 'isWorkspaceRecovery',
      getMessageResumeByDisputeId: 'getMessageResumeByDisputeId'
    }),

    editorOptions() {
      return {
        placeholder: 'Escreva alguma coisa',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote'],
            ['clean']
          ]
        }
      }
    },

    answerVia() {
      return (this.responseRow?.getDisputeLastReceivedMessage?.message?.communicationType ?? '').toLowerCase()
    }
  },

  methods: {
    ...mapActions([
      'getMessageSummary'
    ]),

    getMessageSummaryHandler(message, disputeId) {
      if (message?.parameters?.READ_DATE) {
        const messageResume = this.getMessageResumeByDisputeId(disputeId)

        if (messageResume) {
          this.messageSummary = messageResume.resume
        } else {
          this.getMessageSummary(message.messageId).then(resume => {
            this.$store.commit('addMessageResume', { resume, disputeId })
            this.messageSummary = resume
          })
        }
      }
    },

    getInteractionIcon,
    getLastInteraction,
    getLastInteractionTooltip,

    startResponseBox(id) {
      this.message = ''

      if (this.messageCache[id]) {
        this.message = this.messageCache[id]
        this.responseBoxVisible = true
      }
    },

    showResponseBox() {
      this.responseBoxVisible = true
    },

    hideResponseBox(id, cancel = false) {
      if (cancel) {
        delete this.messageCache[id]
      } else if (this.message) {
        this.messageCache[id] = this.message
      }

      this.message = ''
      this.responseBoxVisible = false
    },

    openResponseDialog(row) {
      this.responseRow = row

      this.$nextTick().then(_ => {
        this.responseDialogVisible = true
        this.richMessage = this.message + ''
      })
    },

    sendMessage(dispute) {
      if (this.message.trim().replace('\n', '') || this.richMessage.trim().replace('\n', '')) {
        const message = this.richMessage ? this.richMessage : this.message

        this.responseBoxLoading = true
        this.$emit('update:responseBoxLoading', true)

        this.$store.dispatch('send' + dispute.getDisputeLastReceivedMessage.message.communicationType.toLowerCase(), {
          to: [{ address: dispute.getDisputeLastReceivedMessageSender }],
          message,
          disputeId: dispute.getDisputeId
        }).then(() => {
          this.message = ''
          this.richMessage = ''
          this.responseDialogVisible = false

          delete this.messageCache[dispute.getDisputeId]

          this.$jusNotification({
            title: 'Yay!',
            message: 'Mensagem enviada com sucesso.',
            type: 'success'
          })
        }).catch(error => {
          this.$jusNotification({ error })
        }).finally(() => {
          this.responseBoxLoading = false
          this.$emit('update:responseBoxLoading', false)
        })
      }
    }
  }
}
</script>

<style lang="scss">
@import '~projuris-acordos-theme/src/common/colors.scss';

.last-interactions-table {
  .last-interactions-table__interaction-pulse {
    position: absolute;
    font-size: 14px;
    bottom: -5px;
    right: -3px;
  }
}

.last-interactions-table__response-dialog {
  .quill-editor {
    margin-top: 8px;
    background-color: #eaeaed;
    padding: 0 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    min-height: 300px;
    height: 30vh;
    &.show-toolbar .ql-toolbar {
      display: inherit !important;
    }
  }
  img {
    width: 14px;
    margin: 0 4px 0 2px;
  }
}

.last-interactions-table__last-recived-message-tooltip {
  display: flex;
  word-break: break-word;
  max-width: 400px;
}

.follow-up-button.follow-up-tooltip {
  color: $--color-secondary;
  font-weight: bold;
}
</style>
