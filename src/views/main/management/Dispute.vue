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
        <dispute-actions
          :dispute.sync="dispute"
          :is-paused.sync="isPaused"
          :is-favorite.sync="isFavorite"
          :is-collapsed.sync="isCollapsed"
          @fetch-data="fetchData" />
        <!-- MESSAGES -->
        <dispute-occurrences v-if="typingTab === '1'" ref="disputeOccurrences" :dispute-id="id" data-testid="dispute-messages" />
        <dispute-notes v-else :dispute-id="id" />
        <div
          :key="loadingKey"
          class="dispute-view__send-message">
          <el-tabs ref="messageTab" v-model="typingTab" :before-leave="handleBeforeLeaveTabs" @tab-click="handleTabClick">
            <el-tab-pane v-loading="loadingTextarea" label="Ocorrências" name="1">
              <el-card
                v-loading="isPaused"
                element-loading-text="Disputa pausada, retome a disputa para enviar novas mensagens."
                element-loading-spinner="el-icon-video-pause"
                class="dispute-view__send-message-box"
                shadow="always">
                <el-collapse-transition>
                  <textarea
                    v-if="validName"
                    v-model="newMessage"
                    rows="2"
                    data-testid="input-message"
                    placeholder="Escreva alguma coisa"
                    class="el-textarea__inner"
                    @keydown.enter.alt.prevent
                    @keydown.enter.shift.prevent
                    @keydown.enter.exact.prevent
                    @keydown.enter.alt="newLineMessage()"
                    @keydown.enter.shift="newLineMessage()"
                    @keyup.enter.exact="sendMessage(true)"/>
                </el-collapse-transition>
                <div class="dispute-view__send-message-actions">
                  <el-tooltip
                    v-if="!validName"
                    content="Atualize sue nome em suas configurações de perfil para enviar mensagens">
                    <div class="dispute-view__disabled-text">
                      Configure um nome em seu perfil
                    </div>
                  </el-tooltip>
                  <div v-else>
                    <el-tooltip content="Enviar e-mail">
                      <a href="#" data-testid="select-email" @click.prevent="setMessageType('email')">
                        <jus-icon :is-active="messageType === 'email'" icon="email"/>
                      </a>
                    </el-tooltip>
                    <el-tooltip content="Enviar Whatsapp">
                      <a href="#" data-testid="select-whatsapp" @click.prevent="setMessageType('whatsapp')">
                        <jus-icon :is-active="messageType === 'whatsapp'" icon="whatsapp"/>
                      </a>
                    </el-tooltip>
                    <el-tooltip content="Enviar CNA">
                      <a href="#" data-testid="select-cna" @click.prevent="setMessageType('cna')">
                        <jus-icon :is-active="messageType === 'cna'" icon="email-cna"/>
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
                          <span v-if="messageType === 'cna'">OAB(s) do destinatário selecionado não selecionado/configurado</span>
                        </span>
                      </div>
                      <span v-if="validName">
                        <el-button
                          :disabled="invalidReceiver || !activeRole.personId"
                          type="primary"
                          class="dispute-view__send"
                          data-testid="submit-message"
                          @click="sendMessage()">
                          Enviar
                        </el-button>
                      </span>
                      <el-button
                        v-else
                        class="dispute-view__send"
                        type="primary"
                        @click="$router.push('/profile')">
                        Configurações
                      </el-button>
                    </el-tooltip>
                    <el-popover trigger="click">
                      <el-radio-group v-model="enterToSend" class="dispute-view__send-radio" @change="changeEnterToSend">
                        <el-radio :label="0">
                          Envia com Click
                          <span>Clicar em <strong>Enviar</strong> enviará a mensagem</span>
                        </el-radio>
                        <el-radio :label="1">
                          Envia com Enter
                          <span>Pressionar <strong>Enter</strong> enviará a mensagem</span>
                        </el-radio>
                      </el-radio-group>
                      <el-button
                        slot="reference"
                        class="dispute-view__more"
                        type="text"
                        icon="el-icon-more" />
                    </el-popover>
                  </div>
                </div>
              </el-card>
            </el-tab-pane>
            <!-- <el-tab-pane v-loading="loadingTextarea" label="Chat" name="2">
              <el-card shadow="always" class="dispute-view__send-message-box">
                <textarea
                  v-model="newChatMessage"
                  rows="3"
                  data-testid="input-chat"
                  placeholder="Escreva alguma coisa"
                  class="el-textarea__inner"
                  @input="sendTypeEvent()"
                  @keydown.enter.alt="newLineChat()"
                  @keydown.enter.shift="newLineChat()"
                  @keydown.enter.exact.prevent
                  @keydown.enter.shift.prevent
                  @keydown.enter.exact="sendChatMessage()" />
                <div class="dispute-view__send-message-actions note">
                  <el-button type="primary" @click="sendChatMessage()">
                    Enviar
                  </el-button>
                </div>
              </el-card>
            </el-tab-pane> -->
            <el-tab-pane v-loading="loadingTextarea" label="Notas" name="3">
              <el-card shadow="always" class="dispute-view__send-message-box">
                <textarea
                  v-model="newNote"
                  rows="2"
                  data-testid="input-note"
                  placeholder="Escreva alguma coisa"
                  class="el-textarea__inner"/>
                <div class="dispute-view__send-message-actions note">
                  <el-button type="primary" data-testid="submit-note" @click="sendNote()">
                    Salvar nota
                  </el-button>
                </div>
              </el-card>
            </el-tab-pane>
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
        @updateActiveRole="updateActiveRole" />
    </template>
  </JusViewMain>
</template>

<script>
export default {
  name: 'Dispute',
  components: {
    DisputeOccurrences: () => import('./partials/DisputeOccurrences'),
    DisputeNotes: () => import('./partials/DisputeNotes'),
    DisputeOverview: () => import('./partials/DisputeOverview'),
    DisputeActions: () => import('./partials/DisputeActions')
  },
  data () {
    return {
      id: 0,
      messageType: 'email',
      newMessage: '',
      newNote: '',
      newChatMessage: '',
      componentKey: 0,
      buttonKey: 0,
      typingTab: '1',
      loadingTextarea: false,
      loadingDispute: false,
      activeRoleId: 0,
      loadingKey: 0,
      activeRole: {},
      invalidReceiver: undefined,
      isCollapsed: false,
      enterToSend: 0
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
      this.updateActiveRole(activeRoleId)
    },
    isPaused () {
      this.loadingKey = this.loadingKey + 1
      this.typingTab = this.isPaused ? '3' : '1'
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
  beforeMount () {
    const entertosend = parseInt(localStorage.getItem('jusentertosend'))
    if (entertosend) this.enterToSend = entertosend
  },
  beforeDestroy () {
    this.unsubscribeOccurrences(this.id)
  },
  methods: {
    updateActiveRole (activeRole) {
      if (typeof activeRole === 'number') {
        activeRole = this.$store.getters.disputeRoles.find(role => {
          return role.id === activeRole
        })
      }
      if (activeRole) {
        this.activeRole = Object.assign(activeRole, {
          invalidEmail: !activeRole.emails.length || !activeRole.emails.filter(e => e.selected === true).length,
          invalidPhone: !activeRole.phones.length || !activeRole.phones.filter(e => e.selected === true).length,
          invalidOab: !activeRole.oabs.length || !activeRole.oabs.filter(e => e.selected === true).length })
      } else {
        this.activeRole = {}
      }
      this.updateInvalidReceiver()
      this.$forceUpdate()
    },
    updateInvalidReceiver () {
      switch (this.messageType) {
        case 'email':
          this.invalidReceiver = this.activeRole.invalidEmail
          break
        case 'whatsapp':
          this.invalidReceiver = this.activeRole.invalidPhone
          break
        case 'cna':
          this.invalidReceiver = this.activeRole.invalidOab
          break
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
      if (tab.name === '2' || tab.name === '3') {
        this.activeRoleId = 0
      }
    },
    handleBeforeLeaveTabs () {
      this.$store.commit('clearOccurrencesSize')
    },
    setMessageType (type) {
      this.messageType = type
      this.updateInvalidReceiver()
    },
    newLineMessage () {
      this.newMessage = `${this.newMessage}\n`
    },
    newLineChat () {
      this.newChatMessage = `${this.newChatMessage}\n`
    },
    newLineNote () {
      this.newNote = `${this.newNote}\n`
    },
    sendChatMessage () {
      this.loadingTextarea = true
      if (this.newChatMessage.trim().replace('\n', '')) {
        this.$store.dispatch('sendMessageEvent', {
          id: this.dispute.id,
          data: {
            value: this.newChatMessage,
            sender: {
              personId: this.$store.getters.personId,
              name: this.$store.getters.personName
            }
          }
        }).then(() => {
          this.newChatMessage = ''
        }).catch(() => {
          this.$jusNotification({ type: 'error' })
        }).finally(() => {
          this.loadingTextarea = false
        })
      }
    },
    getSelectedContacts (params) {
      switch (params.type) {
        case 'email':
          return params.role.emails.filter(e => e.selected).map(e => e.id)
        case 'cna':
          return params.role.oabs.filter(e => e.selected).map(e => e.id)
        case 'whatsapp':
          return params.role.phones.filter(e => e.selected).map(e => e.id)
        default:
          return []
      }
    },
    sendMessage (enterByKeyboard) {
      if (enterByKeyboard) {
        if (!this.enterToSend) {
          this.newLineMessage()
          return false
        } else {
          if (this.invalidReceiver === undefined) {
            this.$jusNotification({
              title: 'Atenção!',
              message: 'Escolha um destinatário ao lado para receber sua mensagem.',
              type: 'info'
            })
            return false
          }
        }
      }
      if (this.newMessage.trim().replace('\n', '') && this.activeRole.personId && !this.invalidReceiver) {
        this.loadingTextarea = true
        this.$store.dispatch('send' + this.messageType, {
          to: [{
            roleId: this.activeRole.id,
            contactsId: this.getSelectedContacts({ type: this.messageType, role: this.activeRole })
          }],
          message: this.newMessage,
          disputeId: this.dispute.id
        }).then(() => {
          window.analytics.track('Enviou mensagem via ' + this.messageType)
          this.newMessage = ''
          this.$jusNotification({
            title: 'Yay!',
            message: this.messageType + ' enviado com sucesso.',
            type: 'success'
          })
          setTimeout(function () {
            this.newMessage = ''
          }.bind(this), 500)
        }).catch(() => {
          this.$jusNotification({ type: 'error' })
        }).finally(() => {
          this.loadingTextarea = false
        })
      }
    },
    sendNote () {
      if (this.newNote.trim().replace('\n', '')) {
        this.loadingTextarea = true
        this.$store.dispatch('sendDisputeNote', {
          note: this.newNote,
          disputeId: this.dispute.id
        }).then(() => {
          window.analytics.track('Nova nota gravada')
          this.newNote = ''
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
    sendTypeEvent () {
      if (this.newChatMessage.trim().replace('\n', '')) {
        this.$socket.emit('send', {
          channel: '/disputes/' + this.dispute.id,
          event: 'type',
          data: {
            value: this.newChatMessage,
            sender: {
              personId: this.$store.getters.personId,
              name: this.$store.getters.personName
            }
          }
        })
      }
    },
    changeEnterToSend (value) {
      localStorage.setItem('jusentertosend', value)
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
      margin-bottom: 0;
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
    border: 0;
    .el-textarea {
      padding-top: 10px;
      margin: -20px -20px 0;
      display: block;
      width: auto;
      &__inner {
        resize: none;
        border: 0;
        padding: 5px 0;
      }
    }
  }
  &__send-message-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      margin-right: 10px;
      height: 20px;
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
  &__more {
    color: #343c4b;
    transform: rotate(90deg);
    margin-left: 12px;
    margin-right: -6px;
  }
  &__send {
    padding: 8px 20px;
  }
  &__send-radio {
    .el-radio {
      display: block;
      margin-right: 0px;
      & + .el-radio {
        margin-top: 10px;
      }
      .el-radio__label span {
        display: block;
        margin-left: 28px;
        font-size: 12px;
      }
    }
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
