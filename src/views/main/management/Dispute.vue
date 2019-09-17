<template>
  <JusViewMain
    :loading-container="dispute && !dispute.id"
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
        <!-- BUTTONS -->
        <div class="dispute-view__actions">
          <el-tooltip content="Ganhar">
            <el-button
              :disabled="!canSettled()"
              plain
              data-testid="settled"
              @click="disputeAction('settled')">
              <jus-icon icon="win"/>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Perder">
            <el-button
              :disabled="!canUnsettled()"
              plain
              data-testid="unsettled"
              @click="disputeAction('unsettled')">
              <jus-icon icon="lose"/>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Reiniciar engajamento">
            <el-button
              plain
              data-testid="restart-engagement"
              @click="disputeAction('restart-engagement')">
              <jus-icon icon="refresh"/>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Retomar">
            <el-button plain data-testid="resume" @click="disputeAction('resume')">
              <jus-icon icon="start-again"/>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Pausar">
            <el-button plain data-testid="paused" @click="disputeAction('paused')">
              <jus-icon icon="pause"/>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Alterar Negociador">
            <el-button plain @click="editNegotiator()">
              <jus-icon icon="delegate"/>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Enriquecer disputa">
            <el-button plain @click="disputeAction('enrich')">
              <jus-icon icon="enrich"/>
            </el-button>
          </el-tooltip>
          <el-tooltip :content="isFavorite ? 'Desmarcar como favorito' : 'Marcar como favorito'">
            <el-button
              plain
              data-testid="favorite"
              @click="disputeAction(isFavorite ? 'disfavor' : 'favorite')">
              <jus-icon :icon="isFavorite ? 'golden-star' : 'star'"/>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Buscar">
            <el-button plain @click="showSearch = !showSearch">
              <jus-icon icon="search2"/>
            </el-button>
          </el-tooltip>
          <el-tooltip content="Exibir/ocultar mensagens agendadas">
            <el-button :plain="!showScheduled" :type="showScheduled ? 'primary' : null" @click="toggleShowSchedule(!showScheduled)">
              <!-- el-icon-chat-dot-square -->
              <jus-icon v-show="!showScheduled" icon="eye" />
              <jus-icon v-show="showScheduled" icon="eye-white" />
            </el-button>
          </el-tooltip>
          <div :class="{isVisible: showSearch}" class="dispute-view__search">
            <el-input v-model="searchTerm" autofocus>
              <i slot="suffix" class="el-icon-close el-input__icon" @click="showSearch = false"/>
            </el-input>
          </div>
        </div>
        <el-dialog
          :visible.sync="chooseUnsettledDialogVisible"
          title="Atenção!"
          class="dispute-view__choose-unsettled-dialog"
          width="460px"
          data-testid="choose-unsettled-dialog">
          <div class="el-message-box__content">
            <div class="el-message-box__status el-icon-warning"/>
            <div class="el-message-box__message"><p>
              Tem certeza que deseja realizar esta ação?
            </p></div>
          </div>
          <el-select
            v-loading="$store.state.loading"
            v-model="unsettledType"
            data-testid="select-unsettled"
            placeholder="Escolha o motivo da perda">
            <el-option
              v-for="(type, index) in unsettledTypes"
              :key="index"
              :label="type"
              :value="index"/>
          </el-select>
          <span slot="footer" class="dialog-footer">
            <el-button @click="chooseUnsettledDialogVisible = false">Cancelar</el-button>
            <el-button
              :disabled="!unsettledType"
              type="primary"
              class="confirm-action-unsettled"
              @click.prevent="doAction('unsettled')">
              Continuar
            </el-button>
          </span>
        </el-dialog>
        <el-dialog
          :visible.sync="editNegotiatorDialogVisible"
          title="Editar negociadores da disputa"
          width="600px">
          <el-form
            ref="negotiatorsForm"
            :model="negotiatorsForm"
            :rules="negotiatorsRules"
            label-position="top"
            @submit.native.prevent="editNegotiator">
            <el-transfer
              :titles="['Workspace', 'Disputa']"
              :button-texts="['Remover', 'Adcionar']"
              :data="workspaceNegotiators"
              v-model="disputeNegotiators"
              filter-placeholder="Buscar"
              filterable/>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editNegotiatorDialogVisible = false">Cancelar</el-button>
            <el-button type="primary" @click.prevent="editNegotiators()">Editar dados</el-button>
          </span>
        </el-dialog>
        <!-- MESSAGES -->
        <dispute-occurrences
          :dispute-id="dispute ? dispute.id : 0"
          :occurrences="filteredOccurrences"
          :show-scheduled="showScheduled"
          :current-tab="typingTab"
          :loading.sync="loadingOccurrences"
          data-testid="dispute-messages" />
        <div class="dispute-view__send-message">
          <el-tabs ref="messageTab" v-model="typingTab" @tab-click="handleTabClick">
            <el-tab-pane v-loading="loadingTextarea" label="Ocorrências" name="1">
              <el-card shadow="always" class="dispute-view__send-message-box">
                <el-collapse-transition>
                  <textarea
                    v-model="newMessage"
                    rows="2"
                    data-testid="input-message"
                    placeholder="Escreva alguma coisa"
                    class="el-textarea__inner"
                    @keydown.enter.exact.prevent
                    @keydown.enter.shift.prevent
                    @keydown.enter.alt="newLineMessage()"
                    @keydown.enter.shift="newLineMessage()"
                    @keyup.enter.exact="sendMessage()"/>
                </el-collapse-transition>
                <div class="dispute-view__send-message-actions">
                  <el-tooltip
                    v-if="!validName"
                    content="Atualize o nome no seu perfil para enviar mensagens">
                    <div class="dispute-view__disabled-text">
                      Configure um nome em seu perfil
                    </div>
                  </el-tooltip>
                  <div>
                    <div>
                      <el-tooltip content="Enviar e-mail">
                        <a href="#" data-testid="select-email" @click.prevent="setMessageType('email')">
                          <jus-icon :is-active="messageType === 'email'" icon="email"/>
                        </a>
                      </el-tooltip>
                      <el-tooltip content="Enviar Whatsapp">
                        <a href="#" data-testid="select-whatsapp" @click.prevent="setMessageType('whatsapp')">
                          <jus-icon
                            :is-active="messageType === 'whatsapp'"
                            icon="whatsapp"/>
                        </a>
                      </el-tooltip>
                      <el-tooltip content="Enviar CNA">
                        <a href="#" data-testid="select-cna" @click.prevent="setMessageType('cna')">
                          <jus-icon :is-active="messageType === 'cna'" icon="cna"/>
                        </a>
                      </el-tooltip>
                    </div>
                  </div>
                  <el-tooltip
                    v-if="messageType === 'whatsapp' && whatsappStatus !== 'CONNECTED'"
                    content="Whatsapp desconectado">
                    <div>
                      <el-button
                        :disabled="true"
                        type="primary"
                        data-testid="submit-whats-disable"
                        @click="sendMessage()">
                        Enviar
                      </el-button>
                    </div>
                  </el-tooltip>
                  <el-tooltip
                    v-else-if="
                      (activeRole.invalidEmail && messageType === 'email') ||
                        (activeRole.invalidPhone && messageType === 'whatsapp') ||
                        (activeRole.invalidOab && messageType === 'cna')
                    ">
                    <div slot="content">
                      <span v-if="messageType === 'email'">Email(s) do destinatário selecionado não selecionado/configurado</span>
                      <span v-if="messageType === 'whatsapp'">Telefone(s) do destinatário selecionado não selecionado/configurado</span>
                      <span v-if="messageType === 'cna'">OAB(s) do destinatário selecionado não selecionado/configurado</span>
                    </div>
                    <div>
                      <el-button
                        :disabled="true"
                        type="primary"
                        data-testid="submit-whats-disable"
                        @click="sendMessage()">
                        Enviar
                      </el-button>
                    </div>
                  </el-tooltip>
                  <div v-else-if="!validName">
                    <el-button type="primary" @click="$router.push('/profile')">
                      Configurações
                    </el-button>
                  </div>
                  <div v-else>
                    <el-tooltip>
                      <div slot="content">
                        <span v-if="!activeRole.personId">
                          Escolha um destinatário ao lado para receber sua mensagem
                        </span>
                        <span v-else>Enviar mensagem</span>
                      </div>
                      <div>
                        <el-button
                          :disabled="!activeRole.personId"
                          type="primary"
                          data-testid="submit-email"
                          @click="sendMessage()">
                          Enviar
                        </el-button>
                      </div>
                    </el-tooltip>
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
                  data-testid="input-nota"
                  placeholder="Escreva alguma coisa"
                  class="el-textarea__inner"
                  @keydown.enter.exact.prevent
                  @keydown.enter.shift.prevent
                  @keydown.enter.alt="newLineNote()"
                  @keydown.enter.shift="newLineNote()"
                  @keydown.enter.exact="sendNote()"/>
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
        <h2>Dados da disputa</h2>
        <!-- <el-button plain>Exportar disputa</el-button> -->
        <el-tooltip content="Excluir disputa">
          <el-button
            plain
            class="right"
            data-testid="remove"
            @click="removeDispute()">
            <jus-icon icon="trash"/>
          </el-button>
        </el-tooltip>
      </div>
      <dispute-overview
        v-if="dispute"
        :loading.sync="loadingDispute"
        :dispute.sync="dispute"
        :active-role-id.sync="activeRoleId"
        data-testid="dispute-overview" />
    </template>
  </JusViewMain>
</template>

<script>
import { fuseSearchOccurrences } from '@/plugins/jusUtils'

export default {
  name: 'Dispute',
  components: {
    DisputeOccurrences: () => import('./partials/DisputeOccurrences'),
    DisputeOverview: () => import('./partials/DisputeOverview')
  },
  data () {
    return {
      id: 0,
      editNegotiatorDialogVisible: false,
      chooseUnsettledDialogVisible: false,
      showSearch: false,
      searchTerm: '',
      messageType: 'email',
      newMessage: '',
      newNote: '',
      showScheduled: false,
      newChatMessage: '',
      componentKey: 0,
      disputeNegotiators: [],
      negotiatorsForm: {},
      negotiatorsRules: {},
      unsettledTypes: {},
      unsettledType: null,
      typingTab: '1',
      loadingTextarea: false,
      loadingDispute: false,
      loadingOccurrences: false,
      activeRoleId: 0
    }
  },
  computed: {
    activeRole () {
      if (this.dispute && this.dispute.disputeRoles) {
        const role = this.dispute.disputeRoles.find(d => d.id === this.activeRoleId)
        if (role) {
          return Object.assign(
            role, {
              invalidEmail: !role.emails.length || !role.emails.filter(e => e.selected).length,
              invalidPhone: !role.phones.length || !role.phones.filter(e => e.selected).length,
              invalidOab: !role.oabs.length || !role.oabs.filter(e => e.selected).length })
        }
      }
      return {}
    },
    occurrences () {
      let sortedOccurrences = this.$store.getters.occurrences
      sortedOccurrences.sort(function (o1, o2) {
        return (o1.id < o2.id) ? -1 : 1
      })
      return sortedOccurrences
    },
    whatsappStatus () {
      return this.$store.getters.whatsappStatus
    },
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
    filteredOccurrences () {
      if (this.searchTerm.trim()) {
        return fuseSearchOccurrences(this.occurrences, this.searchTerm.trim())
      }
      return this.occurrences
    },
    isFavorite () {
      return this.dispute ? this.dispute.favorite : false
    },
    workspaceNegotiators () {
      return this.$store.state.workspaceModule.members.map(member => {
        let newMember = {}
        newMember.key = member.person.id
        newMember.label = member.person.name
        newMember.value = member
        return newMember
      })
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
      this.id = id
      this.$socket.emit('unsubscribe', {
        headers: this.socketHeaders,
        channel: '/topic/' + this.$store.getters.workspaceSubdomain + '/' + this.$store.getters.loggedPersonId + '/dispute/' + oldId + '/occurrence'
      })
      this.unsubscribeOccurrences(oldId)
      this.fetchData()
    },
    showSearch (value) {
      if (!value) {
        this.searchTerm = ''
      }
    }
  },
  created () {
    this.id = this.$route.params.id
    this.fetchData()
    if (this.$store.getters.disputeStatuses.unsettled) {
      this.unsettledTypes = this.$store.getters.disputeStatuses.unsettled
    } else {
      this.$store.dispatch('getDisputeStatuses', 'unsettled').then(response => {
        this.unsettledTypes = response
      })
    }
    this.$store.dispatch('disputeVisualized', this.id)
  },
  beforeDestroy () {
    this.unsubscribeOccurrences(this.id)
  },
  methods: {
    unsubscribeOccurrences (id) {
      this.$store.commit('clearDisputeOccurrence')
      this.$socket.emit('unsubscribe', {
        headers: this.socketHeaders,
        channel: '/topic/' + this.$store.getters.workspaceSubdomain + '/' + this.$store.getters.loggedPersonId + '/dispute/' + id + '/occurrence'
      })
    },
    canSettled () {
      return this.dispute && this.dispute.status && this.dispute.status !== 'SETTLED'
    },
    canUnsettled () {
      return this.dispute && this.dispute.status && this.dispute.status !== 'UNSETTLED'
    },
    editNegotiators () {
      this.$store.dispatch('editNegotiators', {
        negotiators: this.disputeNegotiators,
        disputeId: this.dispute.id
      }).then(() => {
        window.analytics.track('Negociadores alterados')
        this.$jusNotification({
          title: 'Yay!',
          message: 'Negociadores editados com sucesso.',
          type: 'success'
        })
        this.editNegotiatorDialogVisible = false
      }).catch(() => this.$jusNotification({ type: 'error' }))
    },
    editNegotiator () {
      this.disputeNegotiators = this.dispute.disputeRoles.filter((negotiator) => {
        return negotiator.roles.includes('NEGOTIATOR') === true
      }).map(member => {
        return member.personId
      })
      this.editNegotiatorDialogVisible = true
    },
    removeDispute () {
      this.$confirm('Tem certeza que deseja excluir esta disputa? Esta ação é irreversível.', 'Atenção!', {
        confirmButtonClass: 'confirm-remove-btn',
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar'
      }).then(() => {
        const loading = this.$loading({ lock: true })
        this.$store.dispatch('removeDispute', this.dispute.id).then(() => {
          this.$router.push('/management')
        }).finally(() => {
          loading.close()
        })
      })
    },
    toggleShowSchedule (value) {
      this.showScheduled = value
    },
    fetchData () {
      this.loadingDispute = true
      this.loadingOccurrences = true
      this.$socket.emit('subscribe', {
        headers: this.socketHeaders,
        channel: '/topic/' + this.$store.getters.workspaceSubdomain + '/' + this.$store.getters.loggedPersonId + '/dispute/' + this.id + '/occurrence'
      })
      Promise.all([
        this.$store.dispatch('getDispute', this.id),
        this.$store.dispatch('getDisputeOccurrences', this.id)
      ]).catch(() => {
        this.$jusNotification({ type: 'error' })
      }).finally(() => {
        setTimeout(() => {
          this.loadingDispute = false
          this.loadingOccurrences = false
        }, 500)
      })
    },
    handleTabClick (tab) {
      if (tab.name === '2' || tab.name === '3') {
        this.activeRoleId = 0
      }
    },
    setMessageType (type) {
      this.messageType = type
    },
    disputeAction (action) {
      if (action === 'unsettled') {
        this.chooseUnsettledDialogVisible = true
        this.unsettledType = null
      } else {
        this.$confirm('Tem certeza que deseja realizar esta ação?', 'Atenção!', {
          confirmButtonClass: 'confirm-action-btn',
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar'
        }).then(() => {
          this.doAction(action)
        })
      }
    },
    doAction (action) {
      let params = {
        action: action,
        disputeId: this.dispute.id
      }
      if (this.unsettledType) {
        params['body'] = { 'reason': this.unsettledTypes[this.unsettledType] }
      }
      this.$store.dispatch('sendDisputeAction', params).then(() => {
        let trackTitle
        if (action === 'unsettled') {
          trackTitle = 'Disputa ganha'
        } else if (action === 'settled') {
          trackTitle = 'Disputa perdida'
        } else if (action === 'paused') {
          trackTitle = 'Disputa pausada'
        } else if (action === 'resume') {
          trackTitle = 'Disputa despausada'
        } else if (action === 'favorite') {
          trackTitle = 'Disputa favoritada'
        } else if (action === 'disfavor') {
          trackTitle = 'Disputa desfavoritada'
        } else {
          trackTitle = 'Status Modificado'
        }
        window.analytics.track(trackTitle, {
          action: action
        })
        this.$jusNotification({
          title: 'Yay!',
          message: 'Ação realizada com sucesso.',
          type: 'success'
        })
      }).catch(() => {
        this.$jusNotification({ type: 'error' })
      }).finally(() => {
        this.chooseUnsettledDialogVisible = false
      })
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
    /*
    * @params Object {type, role}
    */
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
    sendMessage () {
      if (this.messageType === 'whatsapp' && this.whatsappStatus !== 'CONNECTED') {
        this.$jusNotification({
          title: 'Ops!',
          message: 'Seu Whatsapp não está conectado, por favor conecte-se para enviar esta mensagem',
          type: 'warning'
        })
      } else {
        if (this.newMessage.trim().replace('\n', '')) {
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
    .el-button {
      padding: 8px 20px;
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
      padding: 20px 0;
      font-weight: 500;
      display: block;
      margin: 0;
    }
    .el-button {
      border-radius: 5px;
      padding: 11px;
    }
    img {
      width: 16px;
      height: 16px;
    }
  }
  &__actions {
    padding: 11px 20px;
    box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.06);
    z-index: 1;
    .el-button {
      border-radius: 5px;
      padding: 11px;
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
  &__choose-unsettled-dialog {
    .el-message-box__content {
      padding: 10px 0;
    }
    .el-select {
      margin: 10px 0;
      width: 100%;
    }
  }
  .el-input-group__append {
    border-color: #9462f7;
    background-color: #9462f7;
    img {
      margin-top: 1px;
    }
  }
}
</style>
