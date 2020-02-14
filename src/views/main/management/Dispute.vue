<template>
  <JusViewMain
    :loading-container="dispute && !dispute.id"
    :right-card-collapsed="isCollapsed"
    full-screen
    right-card-width="320"
    class="dispute-view">
    <template v-if="false" slot="title">
      <h1 v-if="dispute" class="dispute-view__title">
        <router-link to="/management">
          <jus-icon icon="back"/>
        </router-link>
        Disputa #{{ dispute.id }}
      </h1>
    </template>
    <!-- CHAT -->
    <template slot="main">
      <div class="dispute-view__section-messages">
        <!-- ACTIONS -->
        <jus-dispute-actions :dispute="dispute" :is-collapsed.sync="isCollapsed" @fetch-data="fetchData" />
        <!-- MESSAGES -->
        <dispute-occurrences
          v-if="['1', '3'].includes(typingTab)"
          ref="disputeOccurrences"
          :dispute-id="id"
          :typing-tab.sync="typingTab"
          data-testid="dispute-messages"
          @dispute:reply="startReply">
          <dispute-tips v-if="typingTab === '1'" />
        </dispute-occurrences>
        <dispute-notes v-else-if="typingTab === '2'" :dispute-id="id" />
        <div :key="loadingKey" class="dispute-view__send-message">
          <div v-show="selectedContacts && selectedContacts.length && typingTab === '1'" class="dispute-view__send-to">
            Destinatário(s):
            <span v-for="(selected, index) in selectedContacts" :key="selected.id">
              <span v-if="index === 0">
                <span v-if="selected.number">{{ selected.number | phoneMask }}</span>
                <span v-else-if="selected.address">{{ selected.address | phoneMask }}</span>
              </span>
            </span>
            <el-tooltip v-if="selectedContacts.length > 1">
              <div slot="content">
                <span v-for="selected in selectedContacts" :key="selected.id">
                  <div v-if="selected.number">
                    <jus-icon icon="phone" is-white style="width: 14px;vertical-align: top;" />
                    {{ selected.number | phoneMask }}
                  </div>
                  <div v-else-if="selected.address">
                    <jus-icon icon="email" is-white style="width: 14px;vertical-align: top;" />
                    {{ selected.address }}
                  </div>
                </span>
              </div>
              <span>
                (+ {{ selectedContacts.length - 1 }})
              </span>
            </el-tooltip>
          </div>
          <el-tabs ref="messageTab" v-model="typingTab" :before-leave="handleBeforeLeaveTabs" @tab-click="handleTabClick">
            <el-tab-pane v-loading="loadingTextarea" label="Comunicação" name="1">
              <el-card
                v-loading="isPaused"
                element-loading-text="Disputa pausada, retome a disputa para enviar novas mensagens."
                element-loading-spinner="el-icon-video-pause"
                element-loading-background="#fff"
                class="dispute-view__send-message-box"
                shadow="always">
                <el-tooltip v-if="expandedMessageBox && validName" content="Recolher caixa de mensagem">
                  <i class="el-icon-arrow-down dispute-view__collapse-message-box" @click="collapseTextarea()" />
                </el-tooltip>
                <div
                  v-if="validName"
                  :class="{ 'dispute-view__send-message-expanded': expandedMessageBox && !isPaused, 'show-toolbar': messageType === 'email' }">
                  <quill-editor
                    ref="messageEditor"
                    :options="editorOptions"
                    data-testid="email-editor"
                    @focus="expandTextarea()"
                    @blur="collapseTextarea() "/>
                </div>
                <div class="dispute-view__send-message-actions">
                  <el-tooltip
                    v-if="!validName"
                    content="Atualize sue nome em suas configurações de perfil para enviar mensagens">
                    <div class="dispute-view__disabled-text">
                      <jus-icon icon="warn-dark" style="vertical-align: bottom;" />
                      Configure um nome em seu perfil
                    </div>
                  </el-tooltip>
                  <div v-else>
                    <el-tooltip content="Enviar E-mail">
                      <a href="#" data-testid="select-email" @click.prevent="setMessageType('email')">
                        <jus-icon :is-active="messageType === 'email'" icon="email"/>
                      </a>
                    </el-tooltip>
                    <el-tooltip content="Enviar Whatsapp">
                      <a href="#" data-testid="select-whatsapp" @click.prevent="setMessageType('whatsapp')">
                        <jus-icon :is-active="messageType === 'whatsapp'" icon="whatsapp"/>
                      </a>
                    </el-tooltip>
                  </div>
                  <div>
                    <el-tooltip :key="buttonKey" :disabled="!validName || invalidReceiver === false">
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
                          @click="sendMessage()">
                          Enviar mensagem
                        </el-button>
                      </span>
                      <el-button
                        v-else
                        type="primary"
                        size="medium"
                        @click="$router.push('/profile')">
                        Configurações
                      </el-button>
                    </el-tooltip>
                  </div>
                </div>
              </el-card>
            </el-tab-pane>
            <el-tab-pane v-loading="loadingTextarea" label="Notas" name="2">
              <el-card shadow="always" class="dispute-view__send-message-box">
                <el-tooltip v-if="expandedMessageBox" content="Recolher caixa de mensagem">
                  <i class="el-icon-arrow-down dispute-view__collapse-message-box" @click="collapseTextarea()" />
                </el-tooltip>
                <div :class="{ 'dispute-view__send-message-expanded': expandedMessageBox }">
                  <quill-editor
                    ref="noteEditor"
                    :options="editorOptions"
                    data-testid="input-note"
                    @focus="expandTextarea()"
                    @blur="collapseTextarea() "/>
                </div>
                <div class="dispute-view__send-message-actions note">
                  <el-button
                    size="medium"
                    type="primary"
                    data-testid="submit-note"
                    @click="sendNote()">
                    Salvar nota
                  </el-button>
                </div>
              </el-card>
            </el-tab-pane>
            <el-tab-pane label="Ocorrências" name="3" style="padding: 10px;" />
          </el-tabs>
        </div>
      </div>
    </template>
    <!-- DADOS DO CASO -->
    <template slot="right-card">
      <div class="dispute-view__section-title">
        <h2 data-testid="dispute-id">Disputa #{{ dispute.id }}</h2>
        <el-tooltip content="Excluir disputa">
          <el-button
            plain
            class="right"
            data-testid="remove"
            icon="el-icon-delete"
            @click="removeDispute()" />
        </el-tooltip>
      </div>
      <dispute-overview
        v-if="dispute"
        :loading.sync="loadingDispute"
        :active-role-id.sync="activeRoleId"
        data-testid="dispute-overview"
        @fetch-data="fetchData"
        @updateActiveRole="updateActiveRole" />
    </template>
  </JusViewMain>
</template>

<script>
import { checkMessage } from '@/utils/levenshtein'
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
    DisputeOverview: () => import('./partials/DisputeOverview'),
    JusDisputeActions: () => import('@/components/buttons/JusDisputeActions'),
    DisputeTips: () => import('./partials/DisputeTips'),
    quillEditor
  },
  data () {
    return {
      id: 0,
      messageType: 'email',
      newChatMessage: '',
      componentKey: 0,
      buttonKey: 0,
      typingTab: '1',
      loadingTextarea: false,
      loadingDispute: false,
      activeRoleId: 0,
      loadingKey: 0,
      activeRole: {},
      isCollapsed: false,
      expandedMessageBox: false,
      directContactAddress: '',
      editorOptions: {
        placeholder: 'Escreva alguma coisa',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['blockquote'],
            ['clean']
          ]
        }
      }
    }
  },
  computed: {
    validName () {
      if (this.$store.getters.loggedPersonName && this.$store.getters.loggedPersonName !== this.$store.state.accountModule.email) {
        return true
      } else {
        if (!this.$store.getters.loggedPersonName || (this.$store.getters.loggedPersonName === this.$store.state.accountModule.email)) {
          return false
        }
      }
    },
    dispute () {
      return this.$store.getters.dispute
    },
    isPaused () {
      return this.dispute ? this.dispute.paused : false
    },
    isFavorite () {
      return this.dispute ? this.dispute.favorite : false
    },
    socketHeaders () {
      return {
        Authorization: this.$store.getters.accountToken,
        Workspace: this.$store.getters.workspaceSubdomain
      }
    },
    recentMessages () {
      return this.$store.getters.messageRecentMessages
    },
    selectedContacts () {
      if (this.directContactAddress) {
        return [{ id: 0, address: this.directContactAddress }]
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
    invalidReceiver () {
      switch (this.messageType) {
        case 'email':
          return this.activeRole.invalidEmail
        case 'whatsapp':
          return this.activeRole.invalidPhone
      }
    },
    quillMessage () {
      if (this.messageType === 'email') {
        return this.$refs.messageEditor.quill.container.firstChild.innerHTML
      } else {
        return this.$refs.messageEditor.quill.getText()
      }
    }
  },
  watch: {
    '$route.params.id': function (id, oldId) {
      this.id = id.toString()
      this.$socket.emit('unsubscribe', {
        headers: this.socketHeaders,
        channel: '/topic/' + this.$store.getters.workspaceSubdomain + '/' + this.$store.getters.loggedPersonId + '/dispute/' + oldId + '/occurrence'
      })
      this.unsubscribeOccurrences(oldId)
      this.fetchData()
      this.$refs.disputeOccurrences.fetchData()
    },
    activeRoleId (activeRoleId) {
      if (activeRoleId !== -1) {
        this.updateActiveRole(activeRoleId)
      }
    }
  },
  created () {
    this.id = this.$route.params.id.toString()
    this.fetchData()
    if (this.$store.getters.disputeStatuses.unsettled) {
      this.unsettledTypes = this.$store.getters.disputeStatuses.unsettled
    } else {
      this.$store.dispatch('getDisputeStatuses', 'unsettled').then(response => {
        this.unsettledTypes = response
      })
    }
    this.$store.dispatch('disputeSetVisualized', { visualized: true, disputeId: this.id })
  },
  beforeDestroy () {
    this.unsubscribeOccurrences(this.id)
  },
  methods: {
    startReply (params) {
      let messageType = params.type.toLowerCase()
      this.setMessageType(messageType)
      if (messageType === 'email') {
        this.$refs.messageEditor.quill.insertText(9999999999, '\n\n___________________\n' + params.resume)
      }
      this.expandTextarea()
      this.activeRoleId = 0
      this.directContactAddress = params.sender
    },
    setMessageType (type) {
      this.removeReply()
      this.messageType = ''
      this.messageType = type
      this.$nextTick(() => this.$refs.messageEditor.quill.focus())
    },
    updateActiveRole (params) {
      if (typeof params === 'number') {
        let disputeId = params
        params = {}
        params.activeRole = this.dispute.disputeRoles.find(role => {
          return role.id === disputeId
        })
      }
      if (params.activeRole) {
        this.activeRole = Object.assign(params.activeRole, {
          invalidEmail: !params.activeRole.emails.length || !params.activeRole.emails.filter(e => e.selected === true).length,
          invalidPhone: !params.activeRole.phones.length || !params.activeRole.phones.filter(e => e.selected === true).length,
          invalidOab: !params.activeRole.oabs.length || !params.activeRole.oabs.filter(e => e.selected === true).length })
      } else {
        this.activeRole = {}
      }
      if (this.typingTab !== '1' && params.activeRole) this.typingTab = '1'
      if (params.messageType) this.setMessageType(params.messageType)
    },
    removeReply () {
      this.directContactAddress = ''
      let message = this.$refs.messageEditor.quill.getText()
      let messageIndex = message.indexOf('\n\n___________________')
      if (messageIndex !== -1) {
        this.$refs.messageEditor.quill.setText(message.substring(messageIndex, 0))
      }
    },
    unsubscribeOccurrences (id) {
      this.$store.commit('clearDisputeOccurrences')
      this.$socket.emit('unsubscribe', {
        headers: this.socketHeaders,
        channel: '/topic/' + this.$store.getters.workspaceSubdomain + '/' + this.$store.getters.loggedPersonId + '/dispute/' + id + '/occurrence'
      })
    },
    removeDispute () {
      this.$confirm('Tem certeza que deseja excluir esta disputa? Esta ação é irreversível.', 'Atenção!', {
        confirmButtonClass: 'confirm-remove-btn',
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'warning',
        cancelButtonClass: 'is-plain'
      }).then(() => {
        const loading = this.$loading({ lock: true })
        this.$store.dispatch('removeDispute', this.dispute.id).then(() => {
          this.$router.push('/management')
        }).finally(() => {
          loading.close()
        })
      })
    },
    fetchData () {
      this.loadingDispute = true
      this.$socket.emit('subscribe', {
        headers: this.socketHeaders,
        channel: '/topic/' + this.$store.getters.workspaceSubdomain + '/' + this.$store.getters.loggedPersonId + '/dispute/' + this.id + '/occurrence'
      })
      this.$store.dispatch('getDispute', this.id)
        .then(dispute => {
          if (!dispute || dispute.archived) this.$router.push('/management')
        })
        .catch(error => {
          if (error.response.status === 403) {
            this.$jusNotification({ type: '403' })
          } else {
            this.$jusNotification({ type: 'error' })
          }
          this.$router.push('/management')
        }).finally(() => {
          setTimeout(() => {
            this.loadingDispute = false
          }, 500)
        })
    },
    handleTabClick (tab) {
      if (!['1', '3'].includes(tab.name)) this.activeRoleId = 0
      this.typingTab = tab.name
    },
    handleBeforeLeaveTabs () {
      this.$store.commit('clearOccurrencesSize')
    },
    sendMessage () {
      if (!this.$refs.messageEditor.quill.getText().trim()) {
        return false
      }
      if (this.selectedContacts.map(c => c.id).length) {
        if (this.messageType === 'whatsapp') {
          if (checkMessage(this.quillMessage, this.recentMessages)) {
            this.$jusNotification({
              title: 'Ops!',
              message: 'Parece que você enviou uma mensagem parecida recentemente. Devido às políticas de SPAM do WhatsApp, a mensagem não pôde ser enviada.',
              type: 'warning'
            })
            return false
          } else {
            this.$store.state.messageModule.recentMessages.push({
              messageBody: this.quillMessage,
              selfDestroy: () => (setTimeout(() => {
                for (var i = 0; i < this.recentMessages.length; i++) {
                  if (this.quillMessage === this.recentMessages[i].messageBody) {
                    this.recentMessages.splice(i, 1)
                  }
                }
              }, 30000))
            })
            let lastMessage = this.recentMessages.length - 1
            this.$store.state.messageModule.recentMessages[lastMessage].selfDestroy()
          }
        }
        this.loadingTextarea = true
        let to = []
        if (this.directContactAddress) {
          to.push({
            address: this.directContactAddress
          })
        } else {
          to.push({
            roleId: this.activeRole.id,
            contactsId: this.selectedContacts.map(c => c.id)
          })
        }
        let externalIdentification = +new Date()
        for (var contact of this.selectedContacts) {
          this.addLoadingOccurrence({
            message: this.$refs.messageEditor.quill.getText(),
            type: this.messageType,
            receiver: this.messageType === 'email' ? contact.address : contact.phone,
            externalIdentification
          })
        }
        this.$store.dispatch('send' + this.messageType, {
          to,
          message: this.quillMessage,
          disputeId: this.dispute.id,
          externalIdentification
        }).then(() => {
          // SEGMENT TRACK
          if (this.directContactAddress) {
            this.$jusSegment(`Envio de ${this.messageType} via resposta rápida`)
          } else {
            this.$jusSegment(`Envio de ${this.messageType} manual`)
          }
          this.$jusNotification({
            title: 'Yay!',
            message: this.messageType + ' enviado com sucesso.',
            type: 'success'
          })
          setTimeout(function () {
            this.$refs.messageEditor.quill.deleteText(0, 9999999999)
          }.bind(this), 200)
        }).catch(e => {
          console.error(e)
          this.$jusNotification({ type: 'error' })
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
    addLoadingOccurrence (params) {
      this.$store.commit('addLoadingOccurrence', Object.assign({
        sender: this.$store.getters.loggedPersonName,
        createAt: { dateTime: this.$moment() }
      }, params))
    },
    sendNote () {
      let note = this.$refs.noteEditor.quill.getText()
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
        }).catch(() => {
          this.$jusNotification({ type: 'error' })
        }).finally(() => {
          this.loadingTextarea = false
        })
      }
    },
    expandTextarea () {
      this.expandedMessageBox = true
    },
    collapseTextarea () {
      this.expandedMessageBox = false
    }
  }
}
</script>

<style lang="scss">
.dispute-view {
  &__list {
    margin: 20 0px;
    padding-left: 2px;
    li {
      margin-top: 12px;
      list-style: none;
      :first-child {
        margin-right: 10px;
      }
      :last-child {
        vertical-align: text-top;
        float: right;
      }
    }
  }
  &__section-messages {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  &__content {
    margin-left: 20px;
    position: relative;
    &:before {
      content: '';
      position: absolute;
      left: 10px;
      top: 20px;
      width: 0;
      height: 0;
      border: 17px solid transparent;
      border-right-color: #ffffff;
      border-left: 0;
      margin-top: -17px;
      margin-left: -17px;
    }
    span {
      margin-top: 10px;
    }
  }
  &__content-info {
    margin-top: 10px;
    img {
      width: 16px;
    }
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
      position: relative;
      padding: 10px 10px 10px 20px;
    }
  }
  &__send-message-expanded {
    &.show-toolbar {
      .ql-toolbar {
        display: inherit;
      }
    }
    .ql-container {
      height: 208px;
      margin-bottom: 10px;
    }
  }
  &__send-message-actions {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-left: -2px;
    img {
      margin-right: 10px;
      height: 20px;
      vertical-align: middle;
      &:nth-child(2) {
        height: 19px;
        margin-right: 11px;
      }
    }
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
  &__section-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    margin: -20px -20px 0;
    border-bottom: 1px solid #eeeeee;
    h2 {
      padding: 15px 0;
      font-weight: 500;
      display: block;
      margin: 0;
    }
    .el-button {
      border-radius: 5px;
      padding: 10px;
    }
    img {
      width: 16px;
      height: 16px;
    }
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
  &__send-to {
    position: absolute;
    right: 0;
    padding: 15px 14px;
  }
  &__collapse-message-box {
    position: absolute;
    right: 20px;
    top: 20px;
    font-size: 22px;
    cursor:pointer;
    z-index: 1;
  }
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
}
</style>
