<template>
  <JusViewMain
    :loading-container="(dispute && !dispute.id) || isDeletingRole"
    :loading-container-text="deletingRoleText"
    :right-card-collapsed="isCollapsed"
    full-screen
    right-card-width="320"
    class="dispute-view"
  >
    <template
      v-if="false"
      slot="title"
    >
      <h1
        v-if="dispute"
        class="dispute-view__title"
      >
        <router-link to="/management">
          <jus-icon icon="back" />
        </router-link>
        Disputa #{{ dispute.id }}
      </h1>
    </template>
    <!-- CHAT -->
    <template slot="main">
      <JusDragArea>
        <div
          ref="sectionMessages"
          class="dispute-view__section-messages"
        >
          <!-- DRAGGING -->
          <vue-draggable-resizable
            v-if="typingTab !== '3'"
            ref="resizable"
            :handles="['tm']"
            :y="y"
            @dragging="onDrag"
          />
          <!-- ACTIONS -->
          <jus-dispute-actions
            :dispute="dispute"
            :is-collapsed.sync="isCollapsed"
            :tab="typingTab"
            @fetch-data="fetchData"
          />
          <!-- MESSAGES -->
          <dispute-occurrences
            v-if="['1', '3'].includes(typingTab)"
            ref="disputeOccurrences"
            :key="disputeOccurrencesKey"
            :dispute-id="id"
            :typing-tab.sync="typingTab"
            data-testid="dispute-messages"
            @dispute:reply="startReply"
          >
            <dispute-tips v-if="typingTab === '1'" />
          </dispute-occurrences>

          <dispute-notes
            v-else-if="typingTab === '2'"
            :dispute-id="id"
          />

          <dispute-negotiation
            v-else-if="typingTab === '4'"
            :dispute="dispute"
          />

          <NegotiationEditor
            v-if="useTicketComponents"
          />

          <div
            v-else
            :style="{ height: sendMessageHeightComputed }"
            class="dispute-view__send-message"
          >
            <div class="dispute-view__send-container">
              <div class="dispute-view__quick-reply">
                <!-- Respostas rápidas -->
                <el-popover
                  v-if="typingTab === '1'"
                  title="Respostas rápidas"
                  trigger="click"
                  placement="top"
                  popper-class="dispute-view__templates-popover"
                  class="dispute-view__templates"
                  @hide="closeTemplateMenu()"
                >
                  <ul
                    v-if="quickReplyTemplates.length"
                    class="dispute-view__templates-list"
                  >
                    <li
                      v-for="template in quickReplyTemplates"
                      :key="template.template.referenceTemplateId"
                      class="dispute-view__templates-list-item"
                    >
                      <div
                        class="dispute-view__templates-item-title"
                        @click="inputTemplate(template)"
                      >
                        <jus-icon
                          :icon="template.template.contentType === 'HTML' ? 'email' : 'whatsapp'"
                          class="dispute-view__templates-list-icon"
                        />
                        {{ template.template.title }}
                      </div>
                      <el-popover
                        :value="activeTemplateMenu === template.template.referenceTemplateId"
                        trigger="manual"
                        placement="right"
                        popper-class="dispute-view__templates-option-popover"
                        class="dispute-view__templates-item-options"
                        @mouseleave="closeTemplateMenu($event, template.template.referenceTemplateId)"
                      >
                        <div @click="openEditTemplateDialog(template.template)">
                          <i class="el-icon-edit" /> Editar
                        </div>
                        <div @click="resetQuickReplyTemplate({ templateId: template.template.referenceTemplateId, disputeId: id }); activeTemplateMenu = null">
                          <i class="el-icon-refresh-left" /> Restaurar
                        </div>
                        <div @click="archiveTemplate(template.template.referenceTemplateId); activeTemplateMenu = null">
                          <i class="el-icon-delete" /> Excluir
                        </div>
                        <el-button
                          slot="reference"
                          type="text"
                          class="dispute-view__templates-item-menu"
                          @click="openTemplateMenu(template.template.referenceTemplateId)"
                        >
                          <i class="el-icon-more" />
                        </el-button>
                      </el-popover>
                    </li>
                  </ul>
                  <span
                    v-else
                    class="dispute-view__templates-list-empty"
                  >
                    Não há templates para esta estratégia
                  </span>
                  <!-- <el-tooltip
                    content="Respostas rápidas"
                    placement="top"
                    :disabled="!isSmall"
                  > -->
                  <el-button
                    slot="reference"
                    size="mini"
                    class="dispute-view__templates-button"
                  >
                    <jus-icon
                      class="dispute-view__templates-button-icon"
                      icon="zap"
                    />
                    <span v-show="!isSmall">
                      Respostas rápidas
                    </span>
                  </el-button>
                  <!-- </el-tooltip> -->
                </el-popover>
              </div>
              <div
                v-show="selectedContacts && selectedContacts.length && typingTab === '1'"
                class="dispute-view__send-to"
              >
                Destinatário(s):
                <span
                  v-for="(selected, index) in selectedContacts"
                  :key="`${index}-${selected.id}`"
                >
                  <span v-if="index === 0">
                    <span v-if="selected.number">{{ selected.number | phoneNumber }}</span>
                    <span v-else-if="selected.address">
                      {{ selected.address | phoneNumber }}
                    </span>
                    <span v-else-if="messageType === 'negotiation'">
                      Portal Justto
                    </span>
                  </span>
                </span>
                <el-tooltip v-if="selectedContacts.length > 1">
                  <div slot="content">
                    <span
                      v-for="(selected, index) in selectedContacts"
                      :key="`${index}-${selected.id}`"
                    >
                      <span v-if="index !== 0">
                        <div v-if="selected.number">
                          <jus-icon
                            icon="phone"
                            is-white
                            style="width: 14px;vertical-align: top;"
                          />
                          {{ selected.number | phoneNumber }}
                        </div>
                        <div v-else-if="selected.address">
                          <jus-icon
                            icon="email"
                            is-white
                            style="width: 14px;vertical-align: top;"
                          />
                          {{ selected.address }}
                        </div>
                      </span>
                    </span>
                  </div>
                  <span>
                    (+ {{ selectedContacts.length - 1 }})
                  </span>
                </el-tooltip>
                <el-tooltip>
                  <span slot="content">
                    <span v-if="messageType === 'negotiation'">
                      Você está enviando mensagem para o Portal de comunicação Justto.
                    </span>
                    <span v-else>
                      Você está enviando um {{ messageType }}
                    </span>
                  </span>
                  <jus-icon
                    :icon="messageType"
                    class="dispute-view__send-to-icon"
                  />
                  {{ messageType }}
                </el-tooltip>
              </div>
            </div>

            <el-tabs
              ref="messageTab"
              v-model="typingTab"
              :before-leave="handleBeforeLeaveTabs"
              @tab-click="handleTabClick"
            >
              <el-tab-pane
                v-loading="loadingTextarea"
                label="Comunicação"
                name="1"
              >
                <el-card
                  v-loading="isPaused || isPreNegotiation || isCanceled"
                  :element-loading-text="loadingText"
                  element-loading-spinner="el-icon-video-pause"
                  element-loading-background="#fff"
                  class="dispute-view__send-message-box"
                  shadow="always"
                >
                  <div
                    v-if="validName"
                    :class="{ 'show-toolbar small-container': ['email', 'negotiation'].includes(messageType)}"
                    class="dispute-view__quill jus-ckeditor__parent"
                  >
                    <!-- placement="top" -->
                    <el-popover
                      v-if="messageType === 'email'"
                      title="Anexar"
                      trigger="click"
                      popper-class="dispute-view__attach-popover"
                      class="dispute-view__attach"
                    >
                      <el-checkbox-group
                        v-if="disputeAttachments.length"
                        v-model="selectedAttachments"
                      >
                        <el-checkbox
                          v-for="attachment in disputeAttachments"
                          :key="attachment.id"
                          :label="attachment.id"
                          class="dispute-view__attach-checkbox"
                          border
                        >
                          <i class="el-icon-document" />
                          {{ attachment.name }}
                        </el-checkbox>
                      </el-checkbox-group>
                      <span v-else>Não há nenhum anexo nessa disputa</span>
                      <span slot="reference">
                        <i class="el-icon-paperclip" />
                        <b class="dispute-view__attach-counter">{{ selectedAttachments.length }}x</b>
                      </span>
                    </el-popover>

                    <ckeditor
                      v-if="!hasWhatsAppContactSelect"
                      ref="messageEditor"
                      v-model="messageText"
                      :editor="editor"
                      :config="editorConfig"
                      class="dispute-view__quill-note"
                      type="classic"
                    />

                    <el-input
                      v-else
                      v-model="messageText"
                      type="textarea"
                      placeholder="Escreva alguma coisa"
                    />
                    <el-dialog
                      :visible.sync="editTemplateQuickReply.visible"
                      append-to-body
                      width="40%"
                      @close="closeEditTemplateDialog()"
                    >
                      <dispute-quick-reply-editor
                        :dispute-id="Number(id)"
                        :template="editTemplateQuickReply.template"
                        @cancel="closeEditTemplateDialog()"
                        @input="inputTemplate($event)"
                        @update="getQuickReplyTemplates(id)"
                      />
                    </el-dialog>
                  </div>

                  <div class="dispute-view__send-message-actions">
                    <el-tooltip
                      v-if="!validName"
                      content="Atualize sue nome em suas configurações de perfil para enviar mensagens"
                    >
                      <div class="dispute-view__disabled-text">
                        <jus-icon
                          icon="warn-dark"
                          style="vertical-align: bottom;"
                        />
                        Configure um nome em seu perfil
                      </div>
                    </el-tooltip>
                    <div>
                      <el-tooltip
                        :key="buttonKey"
                        :disabled="!validName || invalidReceiver === false || selectedContacts.length > 0"
                      >
                        <div slot="content">
                          <span v-if="selectedContacts.length === 0">
                            Escolha um destinatário ao lado para receber sua mensagem
                          </span>
                          <span v-else-if="invalidReceiver">
                            <span v-if="messageType === 'email'">Email(s) do destinatário selecionado não selecionado/configurado</span>
                            <span v-if="messageType === 'whatsapp'">Telefone(s) do destinatário selecionado não selecionado/configurado</span>
                          </span>
                        </div>
                        <span v-if="validName">
                          <el-button
                            type="primary"
                            size="medium"
                            data-testid="submit-message"
                            @click="sendMessage()"
                          >
                            Enviar mensagem
                          </el-button>
                        </span>
                        <el-button
                          v-else
                          type="primary"
                          size="medium"
                          @click="$router.push('/configuration')"
                        >
                          Configurações
                        </el-button>
                      </el-tooltip>
                    </div>
                  </div>
                </el-card>
              </el-tab-pane>

              <el-tab-pane
                v-loading="loadingTextarea"
                label="Notas"
                name="2"
              >
                <el-card
                  shadow="always"
                  class="dispute-view__send-message-box"
                >
                  <div class="dispute-view__quill jus-ckeditor__parent jus-ckeditor-note">
                    <el-button
                      class="jus-ckeditor-note__marker-btn"
                      type="primary"
                      icon="el-icon-document-add"
                      size="mini"
                      @click="focusOnEditor()"
                    >
                      NOTA
                    </el-button>

                    <ckeditor
                      ref="noteEditor"
                      v-model="noteText"
                      :editor="editor"
                      :config="editorConfig"
                      class="dispute-view__quill-note"
                      type="classic"
                    />
                  </div>

                  <div class="dispute-view__send-message-actions note">
                    <el-button
                      size="medium"
                      type="primary"
                      data-testid="submit-note"
                      @click="sendNote()"
                    >
                      Salvar nota
                    </el-button>
                  </div>
                </el-card>
              </el-tab-pane>

              <el-tab-pane
                label="Ocorrências"
                name="3"
                style="padding: 10px;"
              />
            </el-tabs>
          </div>
        </div>
      </JusDragArea>

      <ExpiredDisputeAlert ref="expiredDisputeAlert" />
    </template>
    <!-- DADOS DO CASO -->
    <template slot="right-card">
      <TicketOverview
        v-if="useTicketComponents"
        ref="disputeOverview"
        :show-overview="false"
        dispute-mode
        @addRecipient="clearDirectContacts"
      />

      <dispute-overview
        v-else-if="dispute && overviewType === 'DISPUTE'"
        ref="disputeOverview"
        :loading.sync="loadingDispute"
        :active-role-id.sync="activeRoleId"
        data-testid="dispute-overview"
        @fetch-data="fetchData"
        @updateActiveRole="updateActiveRole"
        @removeRole="removeRole"
        @activeNegotiator="setNegotiatorActive"
      />
    </template>
  </JusViewMain>
</template>

<script>
import { EditorBackup } from '@/models/message/editorBackup'
import { isSimilarStrings, eventBus } from '@/utils'
import { mapGetters, mapActions } from 'vuex'
import { JusDragArea } from '@/components/JusDragArea'
import ckeditor from '@/utils/mixins/ckeditor'

import events from '@/constants/negotiationEvents'

export default {
  name: 'Dispute',

  components: {
    DisputeOccurrences: () => import('./partials/DisputeOccurrences'),
    DisputeNotes: () => import('./partials/DisputeNotes'),
    DisputeOverview: () => import('./partials/DisputeOverview/DisputeOverview'),
    TicketOverview: () => import('@/views/main/negotiation/partials/ticket/overview/Overview.vue'),
    JusDisputeActions: () => import('@/components/buttons/JusDisputeActions'),
    DisputeTips: () => import('./partials/DisputeTips'),
    DisputeNegotiation: () => import('./partials/DisputeNegotiation'),
    VueDraggableResizable: () => import('vue-draggable-resizable'),
    DisputeQuickReplyEditor: () => import('@/components/layouts/DisuteQuickReplyEditor'),
    ExpiredDisputeAlert: () => import('@/components/dialogs/ExpiredDisputeAlert'),
    NegotiationEditor: () => import('@/views/main/negotiation/partials/ticket/omnichannel/editor/Editor.vue'),
    JusDragArea
  },

  mixins: [ckeditor],

  data() {
    return {
      y: 0,
      width: null,
      dragDebounce: 0,
      sendMessageHeight: 208,
      id: 0,
      disputeOccurrencesKey: (new Date()).getTime(),
      messageType: 'email',
      newChatMessage: '',
      componentKey: 0,
      buttonKey: 0,
      typingTab: '1',
      loadingTextarea: false,
      loadingDispute: false,
      activeRoleId: 0,
      activeRole: {},
      isCollapsed: false,
      directContactAddress: [],
      selectedAttachments: [],
      activeTemplateMenu: null,
      editTemplateQuickReply: {
        visible: false,
        template: {}
      },
      editorOptions: {
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
      },
      noteText: '',
      messageText: '',
      isDeletingRole: false,
      deletingRoleText: 'Por favor, aguarde enquanto carregamos a disputa...',
      inReplyTo: null,
      useMentionPlugin: true
    }
  },

  computed: {
    ...mapGetters([
      'ghostMode',
      'getActiveTab',
      'isJusttoAdmin',
      'loggedPersonId',
      'disputeStatuses',
      'disputeAttachments',
      'workspaceSubdomain',
      'isWorkspaceRecovery',
      'workspaceProperties',
      'getEditorRecipients',
      'quickReplyTemplates',
      'getMessagesBackupById'
    ]),

    isSmall() {
      return this.width < 840 && this.selectedContacts.length > 0
    },

    overviewType() {
      return this.workspaceProperties.DISPUTE_OVERVIEW || 'TICKET'
    },

    sendMessageHeightComputed() {
      switch (this.typingTab) {
        case '1':
          return this.validName ? (this.sendMessageHeight + 'px') : '115px'
        case '2':
          return this.sendMessageHeight + 'px'
        default:
          return '50px'
      }
    },

    validName() {
      if (this.$store.getters.loggedPersonName && this.$store.getters.loggedPersonName !== this.$store.state.accountModule.email) {
        return true
      } else {
        if (!this.$store.getters.loggedPersonName || (this.$store.getters.loggedPersonName === this.$store.state.accountModule.email)) {
          return false
        }
      }

      return null
    },

    dispute() {
      return this.$store.getters.dispute
    },

    isPaused() {
      return this.dispute ? this.dispute.paused : false
    },

    isPreNegotiation() {
      return this.dispute.status === 'PRE_NEGOTIATION'
    },

    isCanceled() {
      return this.dispute?.status === 'CANCELED'
    },

    loadingText() {
      if (this.isPaused || this.isCanceled) {
        return `Disputa ${this.isPaused ? 'pausada' : 'cancelada'}. Retome a disputa para enviar mensagens`
      } else return 'Disputa em pré negociação. Inicie a disputa para enviar mensagens'
    },

    isFavorite() {
      return this.dispute ? this.dispute.favorite : false
    },

    socketHeaders() {
      return {
        Authorization: this.$store.getters.accountToken,
        Workspace: this.$store.getters.workspaceSubdomain
      }
    },

    recentMessages() {
      return this.$store.getters.messageRecentMessages
    },

    selectedContacts() {
      const makeContact = (contact) => ({ id: 0, address: contact })
      const recipientToContact = ({ value: address }) => ({ id: 0, address })

      const recipients = this.getEditorRecipients.map(recipientToContact)

      // Respostas rápidas
      if (this.directContactAddress.length) {
        return this.directContactAddress.map(makeContact).concat(recipients)
      }

      // Contatos do Overview
      switch (this.messageType) {
        case 'email':
          return this.activeRole.emails ? this.activeRole.emails.filter(e => e.selected).concat(recipients) : recipients
        case 'whatsapp':
          return this.activeRole.phones ? this.activeRole.phones.filter(e => e.selected) : recipients
        default:
          return recipients
      }
    },

    hasWhatsAppContactSelect() {
      return this.selectedContacts.some(contact => {
        return Object.keys(contact).includes('number')
      }) || this.messageType === 'whatsapp'
    },

    invalidReceiver() {
      switch (this.messageType) {
        case 'email':
          return this.activeRole.invalidEmail
        case 'whatsapp':
          return this.activeRole.invalidPhone
      }

      return ''
    },

    useTicketComponents() {
      return this.dispute && this.overviewType === 'TICKET'
    }
  },

  watch: {
    '$route.params.id': function(id, oldId) {
      this.id = id.toString()
      this.removeReply()
      if (this.$refs.messageEditor) {
        this.$refs.messageEditor.quill.container.firstChild.innerHTML = ''
      }
      this.socketAction('unsubscribe', oldId)
      this.fetchData()
      this.disputeOccurrencesKey += 1

      this.handleRestoreBackup()
    },

    typingTab() {
      const { id } = this.$route.params
      this.getLastInteractions(id)
      this.handleMessageBackup()
    },

    y(y) {
      const height = this.$refs.sectionMessages.offsetHeight - this.y
      this.setHeight(window.document.getElementById('app').clientHeight)
      this.sendMessageHeight = height >= 0 ? height : this.sendMessageHeight
    },

    getActiveTab(tab) {
      this.handleTabClick({ name: { MESSAGES: '1', NOTES: '2', OCCURRENCES: '3' }[tab] })
    },

    messageText: {
      deep: true,
      handler: 'handleMessageBackup'
    },

    noteText: {
      deep: true,
      handler: 'handleMessageBackup'
    },

    selectedContacts: {
      deep: true,
      handler: 'handleMessageBackup'
    }
  },

  created() {
    this.id = this.$route.params.id.toString()
    this.fetchData()
    if (!this.disputeStatuses.UNSETTLED || !Object.keys(this.disputeStatuses.UNSETTLED).length) {
      this.getDisputeStatuses('UNSETTLED')
    }
    this.disputeSetVisualized({
      visualized: true,
      disputeId: this.id,
      anonymous: this.isJusttoAdmin && this.ghostMode
    })
    this.getQuickReplyTemplates(this.id).then(_ => {}).catch(_ => {})
  },

  mounted() {
    setTimeout(() => {
      this.disputeOccurrencesKey += 1
      this.width = this.$refs.sectionMessages.offsetWidth
      this.y = parseInt(localStorage.getItem('jusoffsetheight')) || this.$refs.sectionMessages.offsetHeight - 208
    }, 800)

    window.addEventListener('resize', this.updateWindowHeight)

    this.setHeight(window.document.getElementById('app').clientHeight)
    this.typingTab = localStorage.getItem('jusoccurrencestab') || '1'

    eventBus.$on(events.EDITOR_FOCUS.callback, this.focusOnEditor)
  },

  beforeDestroy() {
    eventBus.$off(events.EDITOR_FOCUS.callback, this.focusOnEditor)
    window.removeEventListener('resize', this.updateWindowHeight)
    this.resetRecipients()
    this.unsubscribeOccurrences(this.id)
  },

  beforeRouteUpdate(_to, _from, next) {
    this.resetRecipients()
    next()
  },

  methods: {
    ...mapActions([
      'setHeight',
      'addRecipient',
      'sendNegotiator',
      'disfavorTicket',
      'getDisputeNotes',
      'resetRecipients',
      'verifyRecipient',
      'setMessageBackup',
      'getDisputeStatuses',
      'setAccountProperty',
      'getLastInteractions',
      'disputeSetVisualized',
      'getQuickReplyTemplates',
      'resetQuickReplyTemplate',
      'archiveQuickReplyTemplate'
    ]),

    focusOnEditor() {
      if (this.typingTab === '1' && this.$refs.messageEditor) {
        this.ckeditorFocus(this.$refs.messageEditor)
      } else if (this.typingTab === '2' && this.$refs.messageEditor) {
        this.ckeditorFocus(this.$refs.noteEditor)
      } else if (this.typingTab === '3') {
        this.typingTab = '1'
        this.$nextTick(this.focusOnEditor)
      }
    },

    setNegotiatorActive(params) {
      this.setMessageType('negotiation')
      this.activeRoleId = params.roleId
      this.directContactAddress = [params.email]
    },

    clearDirectContacts() {
      this.directContactAddress = []
      this.activeRoleId = 0

      this.$nextTick().then(() => {
        this.getEditorRecipients.slice(0, 1).forEach(({ type }) => this.setMessageType(type))
      })
    },

    archiveTemplate(templateId) {
      this.archiveQuickReplyTemplate(templateId)
      this.getQuickReplyTemplates(this.id).then(_ => {}).catch(_ => {})
    },

    closeEditTemplateDialog() {
      this.editTemplateQuickReply = {
        visible: false,
        template: {}
      }
    },

    openEditTemplateDialog(template) {
      this.editTemplateQuickReply = {
        visible: true,
        template
      }
    },

    closeTemplateMenu() {
      this.activeTemplateMenu = null
    },

    openTemplateMenu(templateId) {
      this.activeTemplateMenu = this.activeTemplateMenu === templateId ? null : templateId
    },

    formatBody(body) {
      const start = body.indexOf('<body>') + 6
      const end = body.indexOf('</body>') - 7
      let newBody = body

      if (start > 5 && end > 0) {
        newBody = body.substring(start, end).trim()
      }

      newBody = newBody.split('\n').filter(l => l.trim().indexOf('<meta') !== 0).join('\n')
      return newBody
    },

    inputTemplate(template) {
      this.closeTemplateMenu()
      this.messageText = template.parsed.body
    },

    updateWindowHeight() {
      this.width = this.$refs.sectionMessages.offsetWidth
      this.onDrag(0, this.$refs.sectionMessages.offsetHeight - this.sendMessageHeight)
    },

    onDrag(x, y) {
      const minTop = this.$refs.sectionMessages.offsetHeight - 208
      const maxTop = 65 + 120
      if (y > minTop) this.y = minTop
      else if (y < maxTop) this.y = maxTop
      else this.y = y
      this.updateDragHeight(this.y)
    },

    updateDragHeight(height) {
      clearTimeout(this.dragDebounce)
      this.dragDebounce = setTimeout(() => {
        this.$refs.resizable.top = height
        localStorage.setItem('jusoffsetheight', height)
      }, 100)
    },

    startReply(params) {
      if (this.useTicketComponents) {
        const reply = {
          disputeId: this.dispute.id,
          type: params.type.toLowerCase(),
          value: params.senders[0],
          key: 'address',
          inReplyTo: params.inReplyTo
        }

        this.verifyRecipient(reply)
          .then((data) => {
            if (data.value === 'AUTHORIZED') {
              delete reply.disputeId
              this.addRecipient(reply)
            }
          })

        return
      }

      const { type, senders } = params
      const messageType = type.toLowerCase()

      this.setMessageType(messageType)
      if (['email'].includes(messageType)) {
        const peviewText = this.messageText

        this.messageText = `${peviewText}`
      } else if (this.messageType !== 'email') {
        this.resetRecipients()
      }
      this.activeRoleId = 0
      this.directContactAddress = senders
      this.inReplyTo = params.inReplyTo
    },

    setMessageType(type) {
      this.removeReply()
      this.messageType = ''
      this.messageType = type
      this.handleTabClick({ name: '1' })
      this.handleMessageBackup()
      this.$nextTick(() => this.ckeditorFocus(this.$refs.messageEditor))
    },

    updateActiveRole(params) {
      if (typeof params === 'number') {
        const disputeId = params
        params = {}
        params.activeRole = this.dispute.disputeRoles.find(role => {
          return role.id === disputeId
        })
      }
      if (params.activeRole) {
        this.activeRole = Object.assign(params.activeRole, {
          invalidEmail: !params.activeRole.emails.length || !params.activeRole.emails.filter(e => e.selected === true).length,
          invalidPhone: !params.activeRole.phones.length || !params.activeRole.phones.filter(e => e.selected === true).length,
          invalidOab: !params.activeRole.oabs.length || !params.activeRole.oabs.filter(e => e.selected === true).length
        })
      } else {
        this.activeRole = {}
      }
      if (this.typingTab !== '1' && params.activeRole) this.typingTab = '1'
      if (params.messageType) this.setMessageType(params.messageType)
    },

    removeReply() {
      this.inReplyTo = null
      this.directContactAddress = []
      // this.resetRecipients()
    },

    socketAction(action, id) {
      if (this.workspaceSubdomain && this.loggedPersonId) {
        const channel = '/topic/' + this.workspaceSubdomain + '/' + this.loggedPersonId + '/dispute/' + id + '/occurrence'

        this.$socket.emit(action, {
          headers: this.socketHeaders,
          channel
        })
      }
    },

    unsubscribeOccurrences(id) {
      this.$store.commit('clearDisputeOccurrences')
      this.socketAction('unsubscribe', id)
    },

    fetchData() {
      this.loadingDispute = true
      this.handleRestoreBackup()
      this.setAccountProperty({ PREFERRED_INTERFACE: 'DISPUTE' })
      this.socketAction('subscribe', this.id)
      this.$store.commit('clearDisputeOccurrences')
      this.$store.dispatch('getDispute', this.id).then(dispute => {
        if (!dispute || dispute.archived) this.backToManagement()
        else this.$store.dispatch('getDisputeTags', this.id)
      }).then(() => {
        this.$jusSegment('Disputa Visualizada', { disputeId: this.dispute.id })
      }).catch(error => {
        this.$jusNotification({ error })
        this.backToManagement()
      }).finally(() => {
        setTimeout(() => {
          this.loadingDispute = false
        }, 500)
      })
    },

    backToManagement() {
      if (this.$store.state.disputeModule.tab === '9') this.$router.push('/management/all')
      else this.$router.push('/management')
    },

    handleTabClick({ name }) {
      if (!['1', '3'].includes(name)) this.activeRoleId = 0
      this.typingTab = name
      localStorage.setItem('jusoccurrencestab', name)
    },

    handleBeforeLeaveTabs() {
      this.$store.commit('clearOccurrencesSize')
    },

    verifyWhatsappMessage(quillMessage) {
      return new Promise((resolve, reject) => {
        if (this.messageType === 'whatsapp') {
          this.$store.dispatch('canSendWhatsapp', this.directContactAddress[0] || this.selectedContacts[0].number || this.selectedContacts[0].address).then(response => {
            if (response.canSend) {
              if (isSimilarStrings(quillMessage, this.recentMessages.map(rm => rm.messageBody), 75)) {
                this.$jusNotification({
                  title: 'Ops!',
                  message: 'Parece que você enviou uma mensagem parecida recentemente. Devido às políticas de SPAM do WhatsApp, a mensagem não pôde ser enviada.',
                  type: 'warning'
                })
                reject(new Error('Mensagem similar enviada recentemente'))
              } else {
                this.$store.state.messageModule.recentMessages.push({
                  messageBody: quillMessage,
                  selfDestroy: () => (setTimeout(() => {
                    for (let i = 0; i < this.recentMessages.length; i++) {
                      if (quillMessage === this.recentMessages[i].messageBody) {
                        this.recentMessages.splice(i, 1)
                      }
                    }
                  }, 30000))
                })
                const lastMessage = this.recentMessages.length - 1
                this.$store.state.messageModule.recentMessages[lastMessage].selfDestroy()
                resolve()
              }
            } else {
              const message = 'O envio de mensagem para este número WhatsApp não é permitido neste momento. O prazo para responder mensagens no WhatsApp é de 24 horas.<br><br>Não encontramos uma mensagem deste número nas últimas 24 horas para que você possa responder.'
              this.$alert(message, 'Ops!', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: 'OK'
              })
              reject(new Error('Ultima mensagem recebida a mais de 24h'))
            }
          })
        } else {
          resolve()
        }
      })
    },

    validateSendMessage() {
      if (!this.messageText.trim()) {
        return new Promise((resolve, reject) => reject(Error()))
      } else if (['EXPIRED'].includes(this.dispute.status)) {
        return this.$refs.expiredDisputeAlert.open()
      } else if (this.ticket?.favorite) {
        return new Promise((resolve, reject) => {
          const text = `<p>Olá Lucas, esta disputa está marcada como <b>Aguardando análise da empresa</b>.<br><br>Estamos respondendo todas as mensagens d${this.$tc('ARTICLE', this.isWorkspaceRecovery)} ${this.$tc('fields.claimantParty', this.isWorkspaceRecovery)} informando que o processo está em análise pela empresa.<br><br>Gostaria de desmarcar esta opção?</p>`

          this.$confirm(text, 'Aguardando análise pela empresa', {
            cancelButtonText: 'Desmarcar e enviar',
            confirmButtonText: 'Não enviar',
            dangerouslyUseHTMLString: true,
            closeOnPressEscape: false,
            closeOnClickModal: false,
            showClose: false,
            center: true
          }).then(() => {
            reject(new Error('Ticket aguardando análise da empresa.'))
          }).catch(() => {
            // Refatorar isso pra Disputa.
            this.disfavorTicket(Number(this.dispute?.id || this.$route.params.id))
            resolve()
          })
        })
      } else {
        return new Promise((resolve) => resolve())
      }
    },

    sendMessage() {
      this.validateSendMessage().then(() => {
        if (this.messageType === 'negotiation') {
          const role = this.dispute.disputeRoles.find(role => {
            return role.roles.includes('NEGOTIATOR')
          })

          const to = this.selectedContacts.filter(contact => {
            return !!contact.address
          }).map(contact => contact.address)

          this.loadingTextarea = true

          this.sendNegotiator({
            disputeId: this.id,
            data: {
              message: this.messageText,
              roleId: role.id,
              email: to[0] || ''
            }
          }).then(() => {
            setTimeout(function() {
              this.messageText = ''
            }.bind(this), 200)
            this.$jusNotification({
              title: 'Yay!',
              message: 'Mensagem enviado com sucesso.',
              type: 'success'
            })
          }).catch(error => {
            this.$jusNotification({ error })
          }).finally(() => {
            this.loadingTextarea = false
          })
          return
        }

        const quillMessage = this.messageText
        if (this.selectedContacts.map(c => c.id).length) {
          this.loadingTextarea = true
          this.verifyWhatsappMessage(quillMessage).then(() => {
            const to = []

            if (this.directContactAddress.length) {
              this.directContactAddress.forEach(email => { to.push({ address: email }) })
            } else if (this.getEditorRecipients.length) {
              this.selectedContacts.forEach(({ address }) => { to.push({ address }) })
            } else {
              to.push({
                roleId: this.activeRole.id,
                contactsId: this.selectedContacts.map(c => c.id)
              })
            }
            const externalIdentification = +new Date()
            const inReplyTo = this.inReplyTo
            for (const contact of this.selectedContacts) {
              this.addLoadingOccurrence({
                message: this.messageText,
                type: this.messageType,
                receiver: this.messageType === 'email' ? contact.address : contact.phone,
                externalIdentification
              })
            }
            const messageData = {
              to,
              message: quillMessage,
              disputeId: this.dispute.id,
              externalIdentification,
              inReplyTo
            }
            if (this.messageType === 'email') messageData.attachments = this.selectedAttachments
            this.$store.dispatch('send' + this.messageType, messageData).then(() => {
              // SEGMENT TRACK
              if (this.directContactAddress.length) {
                this.$jusSegment(`Envio de ${this.messageType} via resposta rápida`)
              } else {
                this.$jusSegment(`Envio de ${this.messageType} manual`)
              }
              this.selectedAttachments = []
              this.$jusNotification({
                title: 'Yay!',
                message: this.messageType + ' enviado com sucesso.',
                type: 'success'
              })
              setTimeout(function() {
                this.messageText = ''
              }.bind(this), 200)
            }).catch(error => {
              this.$jusNotification({ error })
            }).finally(() => {
              this.loadingTextarea = false
            })
          }).finally(() => {
            this.loadingTextarea = false
          })
        } else {
          this.$jusNotification({
            title: 'Ops!',
            dangerouslyUseHTMLString: true,
            message: `Selecione ao menos um contato do tipo <b>${this.messageType.toUpperCase()}</b> para envio.`,
            type: 'warning'
          })
        }
      })
    },

    addLoadingOccurrence(params) {
      this.$store.commit('addLoadingOccurrence', Object.assign({
        sender: this.$store.getters.loggedPersonName,
        createAt: { dateTime: this.$moment() }
      }, params))
    },

    sendNote() {
      const note = this.noteText
      if (note.trim()) {
        this.loadingTextarea = true
        this.$store.dispatch('sendDisputeNote', {
          note,
          disputeId: this.dispute.id
        }).then(() => {
          // SEGMENT TRACK
          this.$jusSegment('Nova nota salva')
          this.noteText = ''
          this.$jusNotification({
            title: 'Yay!',
            message: 'Nota gravada com sucesso.',
            type: 'success'
          })
        }).catch(error => {
          this.$jusNotification({ error })
        }).finally(() => {
          this.loadingTextarea = false
          this.getDisputeNotes(Number(this.$route.params.id))
        })
      }
    },

    removeRole() {
      this.isDeletingRole = true
      this.deletingRoleText = 'Por favor, aguarde enquanto apagamos a parte...'
      setTimeout(() => {
        this.deletingRoleText = 'Estamos analisando outras disputas usando a mesma pessoa para replicar esta ação, caso seja necessário...'
      }, 2500)
      setTimeout(() => {
        this.isDeletingRole = false
        this.deletingRoleText = 'Por favor, aguarde enquanto carregamos a disputa...'
      }, 4500)
    },

    handleRestoreBackup() {
      const { tab, message, note, type, contacts } = this.getMessagesBackupById(this.dispute.id)

      if (tab) {
        this.handleTabClick({ name: { MESSAGES: '1', NOTES: '2', OCCURRENCES: '3' }[tab] })
      }

      if (type) { this.messageType = type }

      if (contacts) contacts.map(contact => this.addRecipient(contact))

      if (message) {
        if (this.hasWhatsAppContactSelect || this.loadingTextarea) {
          this.messageText = message
        }
      }

      if (note) {
        if (this.loadingTextarea) {
          this.noteText = note
        }
      }
    },

    handleMessageBackup() {
      this.setMessageBackup(new EditorBackup({
        disputeId: this.dispute.id,
        message: this.messageText,
        tab: { 1: 'MESSAGES', 2: 'NOTES', 3: 'OCCURRENCES' }[this.typingTab],
        note: this.noteText,
        type: this.messageType,
        contacts: this.getEditorRecipients || []
      }))
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.dispute-view {
  &__section-messages {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
  }

  &__send-message {
    position: relative;
    border-top: 1px solid #eeeeee;

    .el-tabs__header {
      width: fit-content;
      padding: 0 20px;
      margin-bottom: -10px;
    }
    .el-tabs__active-bar {
      width: 80px;
    }
    .el-tabs__nav-wrap::after {
      background-color: transparent;
    }
    .el-icon-video-pause {
      display: none;
    }
    .el-loading-text {
      color: $--color-text-secondary;
      font-size: 15px;
      font-style: italic;
      margin-top: 21px;
      transform: translateY(-50%);
    }
    .el-tabs, .el-tab-pane, .el-card__body {
      height: 100%;
    }
    .el-tabs__content, .dispute-view__send-message-box, .ql-container {
      height: calc(100% - 30px);
    }

    .dispute-view__send-message-box {
      .el-card__body {
        padding-bottom: 0;
        min-height: 20vh;

        .jus-ckeditor__parent {
          margin: -10px;

          .ck-editor {
            border: none !important;
          }

          .el-textarea {
            .el-textarea__inner {
              min-height: 20vh;
              border: none;
            }
          }

          &.jus-ckeditor-note {
            margin: -10px;
            height: 20vh;
            background-color: #F4EFFE !important;

            .ck-editor {
              .ck-editor__top {
                background: white;
              }

              .ck-editor__editable {
                background-color: #F4EFFE !important;
                color: #9461F7;
                text-indent: 88px;
              }
            }

            .jus-ckeditor-note__marker-btn {
              position: absolute;
              z-index: 1;
              margin: 44px 0 0 4px;
              cursor: default;
            }
          }
        }

        .dispute-view__send-message-actions {
          z-index: 1;

          div > span > .el-button {
            z-index: 5;
            position: absolute;
            bottom: 0;
            right: 0;
            margin: 0 12px 12px 0;
          }

          &.note {
            background: transparent;
            position: absolute;
            bottom: 0;
            right: 0;
            margin: 0 16px 16px 0;
          }
        }
      }
    }

    .ql-container {
      margin-bottom: 10px;
    }
    .ql-toolbar {
      display: none;
    }
    .dispute-view__send-container {
      display: flex;
      align-items: center;
      justify-content: space-between;

      position: absolute;
      right: 0;
      left: 325px;
      padding: 8px 14px;

      .dispute-view__quick-reply {
        display: flex;
        align-items: center;
      }
      .dispute-view__send-to {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    }
    .dispute-view__send-to-icon {
      width: 20px;
    }
  }

  &__quill {
    height: calc(100% - 32px);
    position: relative;

    .quill-editor {
      height: 100%;

      .ql-container {
        margin-bottom: 0;
        height: 100%;

        .ql-editor {
          padding: 0 !important;
        }
      }
    }

    &.show-toolbar {
      .ql-toolbar {
        display: inherit;

        @media (max-height: 780px) {
          padding-bottom: 0px;
        }
      }

      .quill-editor > .ql-container {
        height: calc(100% - 32px) !important;
      }
    }

    .dispute-view__attach {
      position: absolute;
      top: 10px;
      left: 480px;
      cursor: pointer;
      z-index: 1;

      .el-icon-paperclip {
        font-size: 18px;
      }

      .dispute-view__attach-counter {
        font-size: 12px;
      }

      &:hover { color: $--color-primary }
    }

    .dispute-view__templates {
      position: absolute;
      top: 6px;
      left: 390px;

      .dispute-view__templates-button {
        padding: 6px 8px;

        > span {
          display: flex;
          align-items: center;
        }

        .dispute-view__templates-button-icon {
          width: 10px !important;
          margin: 0px;
        }
      }
    }
  }

  &__quill-note {
    height: 100% !important;

    .ql-container {
      height: calc(100% - 20px);
      margin: 0 !important;
    }
  }

  &__show-scheduled {
    margin-top: 10px;
  }

  &__send-message-box {
    margin: 10px;
    margin-top: 20px;
    border: 0;
    .el-textarea__inner {
      resize: none;
      border: 0;
      padding: 3px 0 1px;
    }
    > .el-card__body {
      padding: 10px 10px 10px 20px;
      display: flex;
      flex-direction: column;
    }
  }

  &__send-message-actions {
    margin-top: 6px;
    @media (max-height: 780px) {
      margin-top: 0px;
    }

    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    &.note {
      justify-content: flex-end;
      z-index: 0;
    }
  }

  &__disabled-text {
    color: $--color-text-secondary;
    cursor: default;
    align-self: center;
  }

  &__back {
    margin-right: 10px;
  }

  &__title {
    font-weight: 500;
  }

  &__steps {
    padding: 20px 0;
    ul {
      margin: 0;
    }
    .el-button--text {
      padding-top: 0;
    }
  }

  .jus-main-view__right-card {
    .el-card__body {
      padding: 8px 16px;
    }
  }

  .jus-main-view__main-card {
    height: 100%;
    min-width: 532px;
    z-index: 0;

    > .el-card__body {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0;
    }
  }

  hr {
    margin: 1px -20px 20px;
  }

  &__search {
    visibility: hidden;
    transition: 0.3s ease all;
    height: 0px;
    .el-input__suffix {
      cursor: pointer;
    }
    .el-input {
      display: none;
    }
    &.isVisible {
      margin-top: 20px;
      margin-bottom: 10px;
      visibility: visible;
      height: auto;
      .el-input {
        display: inline-block;
      }
    }
  }
  // &__send-to {
  //   position: absolute;
  //   right: 0;
  //   padding: 15px 14px;
  // }
  .el-input-group__append {
    border-color: #9462f7;
    background-color: #9462f7;
    img {
      margin-top: 1px;
    }
  }
  .el-select, .el-date-editor, .el-radio-group {
    width: 100%;
  }
  &__counterproposal-dialog .el-form-item__error{
    top: 11px !important;
  }
  .el-collapse-item__header, .el-collapse-item__wrap {
    background-color: #ffffff00;
  }
  .draggable.resizable {
    z-index: 9 !important;
    width: 100% !important;
    height: 16px !important;
    left: 0 !important;
    right: 0 !important;
    &:hover {
      cursor: ns-resize;
    }
  }
}

.dispute-view__attach-popover {
  max-width: 500px;
  width: auto;
  max-height: calc(100vh - 32px);
  margin-bottom: 12px;
  overflow-y: auto;
  overflow-x: hidden;

  .dispute-view__attach-checkbox {
    display: flex;
    align-items: center;
    margin: 0 0 10px 0 !important;
    padding: 8px 12px 8px 10px;
    max-width: 100%;
    height: auto;
    &:last-child { margin-bottom: 0 !important }

    .el-checkbox__label {
      white-space: normal;
      text-align: start;
      word-break: break-word !important;
      max-width: calc(100% - 14px);
    }
  }
}

.dispute-view__templates-button-icon {
  width: 10px;
  height: 10px;
}

.dispute-view__templates-popover {
  padding: 20px 0;

  .el-popover__title {
    margin: 0 20px 12px 20px;
  }

  .dispute-view__templates-list-empty {
    margin: 0 20px
  }

  .dispute-view__templates-list {
    list-style: none;
    margin: 0;
    padding: 0;

    .dispute-view__templates-list-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;

      .dispute-view__templates-item-title {
        padding: 8px 20px;
        flex: 1;

        .dispute-view__templates-list-icon {
          margin-right: 6px;
          margin-bottom: -2px;
        }
      }

      .dispute-view__templates-item-options {
        .dispute-view__templates-item-menu {
          padding: 0;
          visibility: hidden;
          &:focus { visibility: visible; }

          .el-icon-more {
            color: $--color-text-primary;
            margin-right: 20px;
            cursor: pointer;
            transform: rotate(90deg);
            &:hover { color: $--color-primary; }
          }
        }

      }

      &:hover {
        background-color: #fafafa;

        & .dispute-view__templates-item-menu {
          visibility: visible;
        }
      }
    }
  }
}

.dispute-view__templates-option-popover {
  padding: 8px 0 8px 8px;
  width: 100px !important;

  > div {
    padding: 2px 8px;
    cursor: pointer;
    &:hover { background-color: #fafafa; }
    &:nth-child(3) { color: $--color-danger }
  }
}

.dialog_edit_template__container {
  padding-top: 16px;
}

</style>
