<template>
  <div class="last-interactions-table">
    <el-popover
      trigger="hover"
      popper-class="el-popover--dark"
      @show="getMessageSummaryHandler(data.lastOutboundInteraction, data.id)"
      @hide="messageSummary = {}">
      <div>
        <strong>
          <jus-icon
            :icon="getInteractionIcon(data.lastOutboundInteraction)"
            is-white
          />
          Último {{ getLastInteractionTooltip(data.lastOutboundInteraction) }}
          em {{ data.lastOutboundInteraction.createAt.dateTime | moment('DD/MM/YYYY [às] HH:mm') }}
        </strong>
      </div>
      <div v-if="data.lastOutboundInteraction.message.sender">
        De: {{ data.lastOutboundInteraction.message.sender | phoneNumber }}
      </div>
      <div v-if="data.lastOutboundInteraction.message.receiver">
        Para: {{ data.lastOutboundInteraction.message.receiver | phoneNumber }}
      </div>
      <span v-if="data.lastOutboundInteraction.message.parameters.READ_DATE && Object.keys(messageSummary).length">
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
        :icon="`status-${data.lastOutboundInteraction.message.parameters.READ_DATE ? 'readed' : 'sent'}`"
        slot="reference"
      />
    </el-popover>

    <el-tooltip>
      <div slot="content">
        <span v-if="!!data.lastNegotiatorAccess">
          Último acesso ao sistema Justto: <strong>{{ data.lastNegotiatorAccess.createAt.dateTime | moment('DD/MM/YYYY [às] HH:mm') }}</strong>
        </span>
        <span v-else>
          Ainda não houve acesso ao sistema Justto de Negociação
        </span>
      </div>
      <jus-icon
        :is-active="!!data.lastNegotiatorAccess"
        icon="justto-access"
      />
    </el-tooltip>

    <el-popover
      v-if="data.lastReceivedMessage"
      trigger="hover"
      popper-class="el-popover--dark"
      @after-enter="startResponseBox(data.id)"
      @hide="hideResponseBox(data.id)"
    >
      <div>
        <div>
          <strong>
            <jus-icon
              :icon="getInteractionIcon(data.lastReceivedMessage)"
              is-white
            />
            {{ getLastInteractionTooltip(data.lastReceivedMessage) }}
            recebido em {{ data.lastReceivedMessage.createAt.dateTime | moment('DD/MM/YYYY [às] HH:mm') }}
          </strong>
        </div>
        <div v-if="data.lastReceivedMessage.message.sender">
          De: {{ data.lastReceivedMessage.message.sender | phoneNumber }}
        </div>
        <div
          v-if="data.lastReceivedMessage.message.resume"
          class="last-interactions-table__last-recived-message-tooltip"
          v-html="`Resumo: ${data.lastReceivedMessage.message.resume}${data.lastReceivedMessage.message.resume.length >= 140 ? '...' : ''}`"
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
            @click="showResponseBox(data.id)"
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
              @click="hideResponseBox(data.id, true)"
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
            v-if="data.lastReceivedMessage"
            :icon="getInteractionIcon(data.lastReceivedMessage)"
          />
          <i
            v-if="!data.visualized"
            class="last-interactions-table__interaction-pulse el-icon-warning el-icon-pulse el-icon-primary"
          />
        </span>
      </span>
    </el-popover>

    <div v-if="data.lastReceivedMessage && data.lastReceivedMessage.createAt && data.lastReceivedMessage.createAt.dateTime">
      {{ getLastInteraction(data.lastReceivedMessage.createAt.dateTime) }}
    </div>

    <el-dialog
      :visible.sync="responseDialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      :title="`Resposta ao processo ${responseRow.code}`"
      append-to-body
      modal-append-to-body
      class="last-interactions-table__response-dialog">
      <div v-if="Object.keys(responseRow).length">
        <div>
          Negociável até <b>{{ responseRow.expirationDate.dateTime | moment('DD/MM/YY') }}</b>.
        </div>
        <div>
          Alçada máxima é de <b>{{ responseRow.disputeUpperRange | currency }}</b>
        </div>
        <div>
          Última proposta foi de <b>{{ responseRow.lastOfferValue | currency }}</b>
        </div>
        <div v-if="responseRow.lastCounterOfferValue">
          Contra proposta de <b>{{ responseRow.lastCounterOfferValue | currency }}</b>
        </div>
        <div v-else>
          <b>Ainda não houve contraproposta</b>
        </div>
        <br>
        <div>
          Resposta via:
          <jus-icon :icon="responseRow.lastReceivedMessage.message.communicationType.toLowerCase()" />
          <b>{{ responseRow.lastReceivedMessage.message.communicationType.toLowerCase() | capitalize }}</b>
        </div>
        <div>
          Destinatário: <b>{{ responseRow.lastReceivedMessage.message.sender | phoneNumber }}</b>
        </div>
        <quill-editor
          v-if="responseDialogVisible"
          ref="messageEditor"
          v-model="richMessage"
          v-loading="responseBoxLoading"
          :class="{ 'show-toolbar': responseRow.lastReceivedMessage.message.communicationType === 'EMAIL' }"
          :options="editorOptions"
        />
      </div>
      <span
        slot="footer"
        class="dialog-footer">
        <el-button
          :disabled="responseBoxLoading"
          plain
          @click="responseDialogVisible = false">
          Cancelar
        </el-button>
        <el-button
          :loading="responseBoxLoading"
          type="primary"
          icon="el-icon-s-promotion"
          @click="sendMessage(responseRow)">
          Enviar
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import {
  getLastInteraction,
  getInteractionIcon,
  getLastInteractionTooltip,
} from '@/utils/jusUtils'

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
  components: { quillEditor },
  data() {
    return {
      message: '',
      messageCache: {},
      messageSummary: {},
      responseRow: {},
      responseBoxVisible: false,
      responseBoxLoading: false,
      responseDialogVisible: false,
      richMessage: '',
    }
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    editorOptions() {
      return {
        placeholder: 'Escreva alguma coisa',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['blockquote'],
            ['clean'],
          ],
        },
      }
    },
  },
  methods: {
    ...mapActions([
      'getMessageSummary',
    ]),

    getMessageSummaryHandler(lastOutboundInteraction, disputeId) {
      if (lastOutboundInteraction.message && lastOutboundInteraction.message.parameters.READ_DATE) {
        const messageResume = this.$store.getters.getMessageResumeByDisputeId(disputeId)
        if (messageResume) {
          this.messageSummary = messageResume.resume
        } else {
          this.getMessageSummary(lastOutboundInteraction.message.messageId).then(resume => {
            this.$store.commit('addMessageResume', { resume, disputeId })
            this.messageSummary = resume
          })
        }
      }
    },

    getInteractionIcon: (i) => getInteractionIcon(i),
    getLastInteraction: (i) => getLastInteraction(i),
    getLastInteractionTooltip: (i) => getLastInteractionTooltip(i),

    startResponseBox(id) {
      this.message = ''
      if (this.messageCache[id]) {
        this.message = this.messageCache[id]
        this.responseBoxVisible = true
      }
    },

    showResponseBox(id) {
      this.responseBoxVisible = true
    },

    hideResponseBox(id, cancel) {
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
      this.responseDialogVisible = true
      this.richMessage = this.message + ''
    },

    sendMessage(dispute) {
      if (this.message.trim().replace('\n', '') || this.richMessage.trim().replace('\n', '')) {
        const message = this.richMessage ? this.richMessage : this.message
        this.responseBoxLoading = true
        this.$emit('update:responseBoxLoading', true)
        this.$store.dispatch('send' + dispute.lastReceivedMessage.message.communicationType.toLowerCase(), {
          to: [{ address: dispute.lastReceivedMessage.message.sender }],
          message,
          disputeId: dispute.id,
        }).then(() => {
          this.message = ''
          this.richMessage = ''
          this.responseDialogVisible = false
          delete this.messageCache[dispute.id]
          this.$jusNotification({
            title: 'Yay!',
            message: 'Mensagem enviada com sucesso.',
            type: 'success',
          })
        }).catch(error => {
          this.$jusNotification({ error })
        }).finally(() => {
          this.responseBoxLoading = false
          this.$emit('update:responseBoxLoading', false)
        })
      }
    },
  },
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

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
</style>
