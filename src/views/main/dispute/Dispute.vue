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
          <div
            :style="{ height: sendMessageHeightComputed }"
            class="dispute-view__send-message"
          >
            <div class="dispute-view__send-container">
              <div class="dispute-view__quick-reply">
                <!-- Respostas rápidas -->
                <el-popover
                  v-if="typingTab === '1' && selectedContacts.length"
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
                  <el-button
                    slot="reference"
                    size="mini"
                    class="dispute-view__templates-button"
                  >
                    <jus-icon
                      class="dispute-view__templates-button-icon"
                      icon="zap"
                    />
                    Respostas rápidas
                  </el-button>
                </el-popover>
              </div>
              <div
                v-show="selectedContacts && selectedContacts.length && typingTab === '1'"
                class="dispute-view__send-to"
              >
                Destinatário(s):
                <span
                  v-for="(selected, index) in selectedContacts"
                  :key="selected.id"
                >
                  <span v-if="index === 0">
                    <span v-if="selected.number">{{ selected.number | phoneNumber }}</span>
                    <span v-else-if="selected.address">{{ selected.address | phoneNumber }}</span>
                  </span>
                </span>
                <el-tooltip v-if="selectedContacts.length > 1">
                  <div slot="content">
                    <span
                      v-for="(selected, index) in selectedContacts"
                      :key="selected.id"
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
                <el-tooltip :content="`Você está enviando um ${messageType}`">
                  <jus-icon
                    :is-active="true"
                    :icon="messageType"
                    class="dispute-view__send-to-icon"
                  />
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
                  v-loading="isPaused || isPreNegotiation"
                  :element-loading-text="loadingText"
                  element-loading-spinner="el-icon-video-pause"
                  element-loading-background="#fff"
                  class="dispute-view__send-message-box"
                  shadow="always"
                >
                  <div
                    v-if="validName"
                    :class="{ 'show-toolbar': messageType === 'email' }"
                    class="dispute-view__quill"
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

                    <!-- placement="top" -->
                    <quill-editor
                      ref="messageEditor"
                      :options="editorOptions"
                      data-testid="email-editor"
                      @focus="$refs.disputeOverview.overviewTab = 'roles'"
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
                        :disabled="!validName || invalidReceiver === false"
                      >
                        <div slot="content">
                          <span v-if="!activeRole.personId">
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
                  <div class="dispute-view__quill">
                    <quill-editor
                      ref="noteEditor"
                      :options="editorOptions"
                      class="dispute-view__quill-note"
                      data-testid="input-note"
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
              <!-- <el-tab-pane v-if="this.$store.getters.isJusttoAdmin" label="Negociação" name="4" style="padding: 10px;" /> -->
            </el-tabs>
          </div>
        </div>
      </JusDragArea>
    </template>
    <!-- DADOS DO CASO -->
    <template slot="right-card">
      <dispute-overview
        v-if="dispute"
        ref="disputeOverview"
        :loading.sync="loadingDispute"
        :active-role-id.sync="activeRoleId"
        data-testid="dispute-overview"
        @fetch-data="fetchData"
        @updateActiveRole="updateActiveRole"
        @removeRole="removeRole"
      />
    </template>
  </JusViewMain>
</template>

<script>
import { isSimilarStrings } from '@/utils'
import { mapGetters, mapActions } from 'vuex'
import { JusDragArea } from '@/components/JusDragArea'
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
  name: 'Dispute',
  components: {
    DisputeOccurrences: () => import('./partials/DisputeOccurrences'),
    DisputeNotes: () => import('./partials/DisputeNotes'),
    DisputeOverview: () => import('./partials/DisputeOverview/DisputeOverview'),
    JusDisputeActions: () => import('@/components/buttons/JusDisputeActions'),
    DisputeTips: () => import('./partials/DisputeTips'),
    DisputeNegotiation: () => import('./partials/DisputeNegotiation'),
    VueDraggableResizable: () => import('vue-draggable-resizable'),
    DisputeQuickReplyEditor: () => import('./partials/DisuteQuickReplyEditor'),
    JusDragArea,
    quillEditor
  },
  data() {
    return {
      y: 0,
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
      isDeletingRole: false,
      deletingRoleText: 'Por favor, aguarde enquanto carregamos a disputa...'
    }
  },
  computed: {
    ...mapGetters([
      'disputeAttachments',
      'disputeStatuses',
      'isJusttoAdmin',
      'ghostMode',
      'quickReplyTemplates',
      'loggedPersonId',
      'workspaceSubdomain'
    ]),

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
    loadingText() {
      return this.isPaused
        ? 'Disputa pausada. Retome a disputa para enviar mensagens'
        : 'Disputa em pré-negociação. Inicie a disputa para enviar mensagens'
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
      if (this.directContactAddress.length) {
        return this.directContactAddress.map(contact => ({ id: 0, address: contact }))
      }
      switch (this.messageType) {
        case 'email':
          return this.activeRole.emails ? this.activeRole.emails.filter(e => e.selected) : []
        case 'whatsapp':
          return this.activeRole.phones ? this.activeRole.phones.filter(e => e.selected) : []
        default:
          return []
      }
    },
    invalidReceiver() {
      switch (this.messageType) {
        case 'email':
          return this.activeRole.invalidEmail
        case 'whatsapp':
          return this.activeRole.invalidPhone
      }

      return ''
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
      this.unsubscribeOccurrences(oldId)
      this.fetchData()
      this.disputeOccurrencesKey += 1
    },
    y(y) {
      const height = this.$refs.sectionMessages.offsetHeight - this.y
      this.sendMessageHeight = height >= 0 ? height : this.sendMessageHeight
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
    this.getQuickReplyTemplates(this.id)
  },
  mounted() {
    this.getLastInteractions(this.id)
    setTimeout(() => {
      this.disputeOccurrencesKey += 1
      this.y = parseInt(localStorage.getItem('jusoffsetheight')) || this.$refs.sectionMessages.offsetHeight - 208
    }, 800)
    window.addEventListener('resize', this.updateWindowHeight)
    this.typingTab = localStorage.getItem('jusoccurrencestab') || '1'
  },
  beforeDestroy() {
    this.unsubscribeOccurrences(this.id)
    window.removeEventListener('resize', this.updateWindowHeight)
  },
  methods: {
    ...mapActions([
      'getDisputeStatuses',
      'getLastInteractions',
      'disputeSetVisualized',
      'getQuickReplyTemplates',
      'resetQuickReplyTemplate',
      'archiveQuickReplyTemplate',
      'getDisputeMetadata',
      'sendNegotiator'
    ]),
    archiveTemplate(templateId) {
      this.archiveQuickReplyTemplate(templateId)
      this.getQuickReplyTemplates(this.id)
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
      if (start > 5 && end > 0) {
        return body.substring(start, end).trim()
      }
      return body
    },

    inputTemplate(template) {
      this.closeTemplateMenu()
      this.$refs.messageEditor.quill.container.firstChild.innerHTML = this.formatBody(template.parsed.body)
    },
    updateWindowHeight() {
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
      if (this.$refs.messageEditor) {
        this.$refs.messageEditor.quill.container.firstChild.innerHTML = ''
      }
      const { type, resume, senders } = params
      const messageType = type.toLowerCase()
      this.setMessageType(messageType)
      if (['email'].includes(messageType)) {
        this.$refs.messageEditor.quill.insertText(9999999999, '\n\n___________________\n' + resume)
      }
      this.activeRoleId = 0
      this.directContactAddress = senders
    },
    setMessageType(type) {
      this.removeReply()
      this.messageType = ''
      this.messageType = type
      this.$nextTick(() => this.$refs.messageEditor.quill.focus())
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
      this.directContactAddress = []
      const message = this.$refs.messageEditor.quill.getText()
      const messageIndex = message.indexOf('\n\n___________________')
      if (messageIndex !== -1) {
        this.$refs.messageEditor.quill.setText(message.substring(messageIndex, 0))
      }
    },
    socketAction(action, id) {
      if (this.workspaceSubdomain && this.loggedPersonId) {
        this.$socket.emit(action, {
          headers: this.socketHeaders,
          channel: '/topic/' + this.workspaceSubdomain + '/' + this.loggedPersonId + '/dispute/' + id + '/occurrence'
        })
      }
    },
    unsubscribeOccurrences(id) {
      this.$store.commit('clearDisputeOccurrences')
      this.socketAction('unsubscribe', id)
    },
    fetchData() {
      this.loadingDispute = true
      this.socketAction('subscribe', this.id)
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
    handleTabClick(tab) {
      if (!['1', '3'].includes(tab.name)) this.activeRoleId = 0
      this.typingTab = tab.name
      localStorage.setItem('jusoccurrencestab', tab.name)
    },
    handleBeforeLeaveTabs() {
      this.$store.commit('clearOccurrencesSize')
    },
    verifyWhatsappMessage(quillMessage) {
      return new Promise((resolve, reject) => {
        if (this.messageType === 'whatsapp') {
          this.$store.dispatch('canSendWhatsapp', this.directContactAddress[0] || this.selectedContacts[0].number).then(response => {
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
    sendMessage() {
      if (!this.$refs.messageEditor.quill.getText().trim()) {
        return false
      }
      if (this.messageType === 'negotiation') {
        const role = this.dispute.disputeRoles.find(role => {
          return role.roles.includes('NEGOTIATOR')
        })
        this.loadingTextarea = true
        this.sendNegotiator({
          disputeId: this.id,
          data: {
            message: this.$refs.messageEditor.quill.getText(),
            roleId: role.id,
            email: role.emails[0].address
          }
        }).then(() => {
          setTimeout(function() {
            this.$refs.messageEditor.quill.deleteText(0, 9999999999)
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
      const quillMessage = this.messageType === 'email'
        ? this.$refs.messageEditor.quill.container.firstChild.innerHTML : this.$refs.messageEditor.quill.getText()
      if (this.selectedContacts.map(c => c.id).length) {
        this.loadingTextarea = true
        this.verifyWhatsappMessage(quillMessage).then(() => {
          const to = []
          if (this.directContactAddress.length) {
            this.directContactAddress.forEach(email => {
              to.push({ address: email })
            })
          } else {
            to.push({
              roleId: this.activeRole.id,
              contactsId: this.selectedContacts.map(c => c.id)
            })
          }
          const externalIdentification = +new Date()
          for (const contact of this.selectedContacts) {
            this.addLoadingOccurrence({
              message: this.$refs.messageEditor.quill.getText(),
              type: this.messageType,
              receiver: this.messageType === 'email' ? contact.address : contact.phone,
              externalIdentification
            })
          }
          const messageData = {
            to,
            message: quillMessage,
            disputeId: this.dispute.id,
            externalIdentification
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
              this.$refs.messageEditor.quill.deleteText(0, 9999999999)
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
    },
    addLoadingOccurrence(params) {
      this.$store.commit('addLoadingOccurrence', Object.assign({
        sender: this.$store.getters.loggedPersonName,
        createAt: { dateTime: this.$moment() }
      }, params))
    },
    sendNote() {
      const note = this.$refs.noteEditor.quill.getText()
      if (note.trim()) {
        this.loadingTextarea = true
        this.$store.dispatch('sendDisputeNote', {
          note,
          disputeId: this.dispute.id
        }).then(() => {
          // SEGMENT TRACK
          this.$jusSegment('Nova nota salva')
          this.$refs.noteEditor.quill.deleteText(0, 9999999999)
          this.$jusNotification({
            title: 'Yay!',
            message: 'Nota gravada com sucesso.',
            type: 'success'
          })
        }).catch(error => {
          this.$jusNotification({ error })
        }).finally(() => {
          this.loadingTextarea = false
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
      color: #adadad;
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
      left: 40%;
      padding: 8px 14px;

      gap: 40px;

      .dispute-view__quick-reply {
        display: flex;
        align-items: center;
      }
      .dispute-view__send-to {
        display: flex;
        align-items: center;
      }
    }
    .dispute-view__send-to-icon {
      margin-left: 8px;
      width: 20px;
    }
  }
  &__quill {
    height: calc(100% - 44px);
    position: relative;
    &.show-toolbar {
      .ql-toolbar {
        display: inherit;
      }
    }

    .quill-editor {
      height: calc(100% - 8px);
      .ql-container {
        margin-bottom: 0;
        .ql-editor {
          padding: 0 !important;
        }
      }
    }

    .dispute-view__attach {
      position: absolute;
      top: 10px;
      left: 348px;
      cursor: pointer;

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
          // margin-right: 4px;
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
    margin-top: 8px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    &.note {
      justify-content: flex-end;
    }
  }
  &__disabled-text {
    color: #adadad;
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
