<template>
  <JusViewMain left-card-width="350" right-card-width="350" class="case-view">
    <template slot="title">
      <h1 class="case-view__title">
        <router-link to="/management">
          <jus-icon icon="back" />
        </router-link>
        Caso #{{ dispute.id }}
      </h1>
    </template>
    <!-- RESUMO DO CASO -->
    <template slot="left-card">
      <div class="case-view__section-title">
        <h2>Resumo do caso</h2>
      </div>
      <case-summary
        v-if="dispute.strategy"
        :id="dispute.id"
        :show-scheduled.sync="showScheduled"
        :strategy-id="dispute.strategy.id"/>
    </template>
    <!-- CHAT -->
    <template slot="main">
      <div class="case-view__section-messages">
        <div class="case-view__actions">
          <!-- <el-tooltip content="move-case">
            <el-button plain @click="doAction('move')">
              <jus-icon icon="move-case" />
            </el-button>
          </el-tooltip>
          <el-tooltip content="delegate">
            <el-button plain @click="doAction('move')">
              <jus-icon icon="delegate" />
            </el-button>
          </el-tooltip> -->
          <el-tooltip content="Ganhar">
            <el-button plain @click="doAction('accepted')">
              <jus-icon icon="win" />
            </el-button>
          </el-tooltip>
          <el-tooltip content="Perder">
            <el-button plain @click="doAction('refused')">
              <jus-icon icon="lose" />
            </el-button>
          </el-tooltip>
          <el-tooltip content="Retomar">
            <el-button plain @click="doAction('resume')">
              <jus-icon icon="start-again" />
            </el-button>
          </el-tooltip>
          <el-tooltip content="Pausar">
            <el-button plain @click="doAction('paused')">
              <jus-icon icon="pause" />
            </el-button>
          </el-tooltip>
          <!-- <el-tooltip content="snooze">
            <el-button plain @click="doAction('move')">
              <jus-icon icon="snooze" />
            </el-button>
          </el-tooltip> -->
          <el-tooltip :content="isFavorite ? 'Desmarcar como favorito' : 'Marcar como favorito'">
            <el-button plain class="right" @click="doAction(isFavorite ? 'disfavor' : 'favorite')">
              <jus-icon :icon="isFavorite ? 'golden-star' : 'star'" />
            </el-button>
          </el-tooltip>
          <el-tooltip content="Buscar">
            <el-button plain class="right" @click="showSearch = !showSearch">
              <jus-icon icon="search2" />
            </el-button>
          </el-tooltip>
          <div :class="{isVisible: showSearch}" class="case-view__search">
            <el-input v-model="searchTerm" autofocus>
              <i slot="suffix" class="el-icon-close el-input__icon" @click="showSearch = false"/>
            </el-input>
          </div>
        </div>
        <case-messages
          :messages-prop="filteredDisputeMessages"
          :loading="loadingDisputeMessages"
          :show-scheduled="showScheduled" />
        <div class="case-view__send-message">
          <el-tabs value="1">
            <el-tab-pane label="Mensagem" name="1">
              <el-tooltip :disabled="!!activePersonId" content="Escolha um destinatário ao lado para receber sua mensagem">
                <el-card shadow="always" class="case-view__send-message-box">
                  <el-collapse-transition>
                    <el-input
                      v-show="activePersonId"
                      :rows="3"
                      v-model="newMessage"
                      type="textarea"
                      placeholder="Escreva alguma coisa" />
                  </el-collapse-transition>
                  <div class="case-view__send-message-actions">
                    <div v-if="activePersonId">
                      <!-- <el-tooltip content="Enviar mensagem">
                        <a href="#" @click="setMessageType('message')">
                          <jus-icon :is-active="messageType === 'message'" icon="message"/>
                        </a>
                      </el-tooltip> -->
                      <el-tooltip content="Enviar e-mail">
                        <a href="" @click.prevent="setMessageType('email')">
                          <jus-icon :is-active="messageType === 'email'" icon="email"/>
                        </a>
                      </el-tooltip>
                      <el-tooltip content="Enviar Whatsapp">
                        <a href="#" @click.prevent="setMessageType('whatsapp')">
                          <jus-icon :is-active="messageType === 'whatsapp'" icon="whatsapp"/>
                        </a>
                      </el-tooltip>
                      <el-tooltip content="Enviar CNA">
                        <a href="#" @click.prevent="setMessageType('cna')">
                          <jus-icon :is-active="messageType === 'cna'" icon="cna"/>
                        </a>
                      </el-tooltip>
                    </div>
                    <div v-else class="case-view__disabled-text">
                      Escreva alguma coisa
                    </div>
                    <div>
                      <el-button :disabled="!activePersonId" type="primary" @click="sendMessage()">
                        Enviar
                      </el-button>
                    </div>
                  </div>
                </el-card>
              </el-tooltip>
            </el-tab-pane>
            <el-tab-pane label="Nota" name="2">
              <el-card shadow="always" class="case-view__send-message-box">
                <el-input
                  :rows="3"
                  v-model="newNote"
                  type="textarea"
                  placeholder="Escreva alguma coisa" />
                <div class="case-view__send-message-actions note">
                  <el-button type="primary" @click="sendNote()">
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
    <template slot="right-card" class="teste">
      <div class="case-view__section-title">
        <h2>Dados do caso</h2>
        <!-- <el-button plain>Exportar caso</el-button> -->
        <el-tooltip content="Excluir caso">
          <el-button plain class="right" @click="removeCase()">
            <jus-icon icon="trash" />
          </el-button>
        </el-tooltip>
      </div>
      <case-overview
        :loading="loadingDispute"
        :dispute="dispute"
        :active-person-id.sync="activePersonId"
        @case:refresh="fetchData({ fetchDispute: true })" />
    </template>
  </JusViewMain>
</template>

<script>
import CaseSummary from './partials/CaseSummary'
import CaseMessages from './partials/CaseMessages'
import CaseOverview from './partials/CaseOverview'

export default {
  name: 'Case',
  components: {
    CaseSummary, CaseMessages, CaseOverview
  },
  data () {
    return {
      dispute: {},
      loadingDispute: false,
      disputeMessages: [],
      filteredDisputeMessages: [],
      loadingDisputeMessages: false,
      showSearch: false,
      searchTerm: '',
      messageType: 'email',
      newMessage: '',
      newNote: '',
      showScheduled: false,
      activePersonId: null
    }
  },
  computed: {
    isFavorite () {
      return this.dispute.favorite
    }
  },
  watch: {
    '$route.params.id': function (id) {
      this.fetchData({ fetchDispute: true, fetchMessages: true })
    },
    showSearch (value) {
      if (!value) {
        this.searchTerm = ''
      }
    },
    searchTerm (term) {
      this.filterDisputeMessages(term)
    }
  },
  created () {
    this.fetchData({ fetchDispute: true, fetchMessages: true })
    // this.$jusSocket.subscribeChat(this.$route.params.id)
  },
  methods: {
    removeCase() {
      this.$confirm('Tem certeza que deseja excluir este caso? Esta ação é irreversível.', 'Atenção!', {
        confirmButtonText: 'Excluir',
        cancelButtonText: 'Cancelar',
        type: 'error'
      }).then(() => {
        this.$store.dispatch('removeCase', this.dispute.id).then(() => {
          this.$router.push('/management')
        })
      })
    },
    fetchData (options) {
      if (options.fetchDispute) {
        this.loadingDispute = true
        this.$store.dispatch('getDispute', this.$route.params.id).then((responses) => {
          this.dispute = responses
          this.loadingDispute = false
        }).catch(error => {
          if (error.response.status === 404) {
            this.$router.push('/management')
          } else this.showError(error)
        })
      }
      if (options.fetchMessages) {
        this.$store.dispatch('getDisputeMessages', this.$route.params.id).then((responses) => {
          if (!this.disputeMessages.length) {
            this.disputeMessages = responses
            this.filteredDisputeMessages = this.disputeMessages.slice(0)
          } else {
            let newMessages = responses.filter((i) => {
              return this.disputeMessages.map((e) => {
                return JSON.stringify(e)
              }).indexOf(JSON.stringify(i)) < 0
            })
            this.disputeMessages.push(...newMessages)
            this.filteredDisputeMessages.push(...newMessages)
          }
        }).catch(error => this.showError(error))
      }
    },
    showError (error) {
      console.error(error)
      this.$notify.closeAll()
      this.$jusNotification({
        title: 'Ops!',
        message: 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.',
        type: 'error'
      })
    },
    filterDisputeMessages (term) {
      var messages = this.disputeMessages.slice(0)
      if (term) {
        var results = messages.filter(this.createDisputeFilter(term))
        this.filteredDisputeMessages = results
      } else {
        this.filteredDisputeMessages = messages
      }
    },
    createDisputeFilter (term) {
      return (occurrence) => {
        return (occurrence.description.toLowerCase().includes(term.toLowerCase()))
      }
    },
    setMessageType (type) {
      this.messageType = type
    },
    doAction (action) {
      this.$confirm('Tem certeza que deseja realizar esta ação?', 'Atenção!', {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }).then(() => {
        if (action === 'refused') {
          window.analytics.track('PERDA (Status modificado)', {
            action: action
          })
        } else if (action === 'accepted') {
          window.analytics.track('GANHO (Status modificado)', {
            action: action
          })
        } else {
          window.analytics.track('Status Modificado', {
            action: action
          })
        }

        this.$store.dispatch('sendDisputeAction', {
          action: action,
          disputeId: this.dispute.id
        })
        this.$jusNotification({
          title: 'Yay!',
          message: 'Ação realizada com sucesso.',
          type: 'success'
        })
        var self = this
        setTimeout(function () {
          self.fetchData({ fetchDispute: true })
        }, 1000)
      })
    },
    sendMessage () {
      if (this.newMessage) {
        this.$store.dispatch('send' + this.messageType, {
          to: [this.activePersonId],
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
          var self = this
          setTimeout(function () {
            self.fetchData({ fetchMessages: true })
          }, 1000)
        }).catch(error => this.showError(error))
      }
    },
    sendNote () {
      if (this.newNote) {
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
          this.fetchData({ fetchMessages: true })
        }).catch(error => this.showError(error))
      }
    }
  }
}
</script>

<style lang="scss">
.case-view {
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
      padding: 10px 20px 0;
      margin-bottom: 0px;
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
    margin: 20px;
    border: 0;
    .el-textarea {
      padding-top: 10px;
      margin: -20px -20px 0;
      display: block;
      width: auto;
      &__inner {
        resize: none;
        border: 0;
        padding: 5px 20px;
      }
    }
  }
  &__send-message-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: -10px 0;
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
  }
  &__side-content {
    margin: 20px 0 0;
    .el-step__title {
      text-transform: capitalize;
    }
    .el-step__head {
      // overflow: hidden;
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
    .right {
      float: right;
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
    min-width: 485px;
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
}
</style>
