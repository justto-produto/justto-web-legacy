<template>
  <JusViewMain left-card-width="350" right-card-width="350" class="ticket-view">
    <template slot="title">
      <h1 class="ticket-view__title">
        <router-link to="/management">
          <jus-icon icon="back" class="ticket-view__back"/>
        </router-link>
        Caso #{{ dispute.id }}
      </h1>
    </template>
    <!-- RESUMO DO CASO -->
    <template slot="left-card">
      <div class="ticket-view__section-title">
        <h2>Resumo do caso</h2>
      </div>
      <case-summary :loading="loadingDisputeSummary" :occurencies="disputeSummary.occurencies"/>
    </template>
    <!-- CHAT -->
    <template slot="main">
      <div class="ticket-view__actions">
        <el-tooltip content="Buscar">
          <el-button plain @click="showSearch = !showSearch">
            <jus-icon icon="search2" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="move-case">
          <el-button plain @click="doAction('move')">
            <jus-icon icon="move-case" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="delegate">
          <el-button plain @click="doAction('move')">
            <jus-icon icon="delegate" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="lose">
          <el-button plain @click="doAction('move')">
            <jus-icon icon="lose" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="win">
          <el-button plain @click="doAction('move')">
            <jus-icon icon="win" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="pause">
          <el-button plain @click="doAction('move')">
            <jus-icon icon="pause" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="start-again">
          <el-button plain @click="doAction('move')">
            <jus-icon icon="start-again" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="snooze">
          <el-button plain @click="doAction('move')">
            <jus-icon icon="snooze" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="star">
          <el-button plain @click="doAction('move')">
            <jus-icon icon="star" />
          </el-button>
        </el-tooltip>
        <div :class="{isVisible: showSearch}" class="ticket-view__search">
          <el-input v-model="searchTerm" autofocus>
            <i slot="suffix" class="el-icon-close el-input__icon" @click="showSearch = false"/>
          </el-input>
        </div>
      </div>
      <div v-loading="loadingDisputeOccurrences" class="ticket-view__chat">
        <ul v-chat-scroll="{always: false, smooth: true}" class="ticket-view__messages">
          <li
            v-for="(message, index) in filteredDisputeOccurrences"
            :key="message + index"
            :class="[messageClass(message.type), clientMessageClass(message.source.personId)]"
            class="ticket-view__message">
            <div class="ticket-view__photo">
              <jus-avatar-user
                size="sm"
                class="el-menu__avatar" />
            </div>
            <div class="ticket-view__content">
              <el-card>
                {{ message.description }}. {{ message.source.executionDateTime | moment('DD/MM/YYYY') }}
              </el-card>
              <div class="ticket-view__content-info">
                {{ message.source.executionDateTime | moment('HH:mm') }} •
                <jus-icon icon="email" /> •
                Visualizado •
                Nome do Sujeito
              </div>
            </div>
          </li>
        </ul>
        <div class="ticket-view__send-message">
          <el-tabs value="1">
            <el-tab-pane label="Mensagem" name="1">
              <el-card shadow="always" class="ticket-view__send-message-box">
                <el-input
                  :rows="2"
                  v-model="newMessage"
                  type="textarea"
                  placeholder="Escreva alguma coisa" />
                <div class="ticket-view__send-message-actions">
                  <div class="">
                    <el-tooltip content="Enviar mensagem">
                      <a href="#" @click="setMessageType('message')">
                        <jus-icon :is-active="messageType === 'message'" icon="message"/>
                      </a>
                    </el-tooltip>
                    <el-tooltip content="Enviar email">
                      <a href="#" @click="setMessageType('email')">
                        <jus-icon :is-active="messageType === 'email'" icon="email"/>
                      </a>
                    </el-tooltip>
                    <el-tooltip content="Enviar whatsapp">
                      <a href="#" @click="setMessageType('whatsapp')">
                        <jus-icon :is-active="messageType === 'whatsapp'" icon="whatsapp"/>
                      </a>
                    </el-tooltip>
                    <el-tooltip content="Enviar CNA">
                      <a href="#" @click="setMessageType('cna')">
                        <jus-icon :is-active="messageType === 'cna'" icon="cna"/>
                      </a>
                    </el-tooltip>
                  <!-- <jus-icon icon="sms" /> -->
                  <!-- <jus-icon icon="attachment" /> -->
                  <!-- <jus-icon icon="emoji" /> -->
                  </div>
                  <el-button type="primary" @click="sendMessage()">
                    Enviar
                  </el-button>
                </div>
              </el-card>
            </el-tab-pane>
            <el-tab-pane label="Nota" name="2">
              <el-card shadow="always" class="ticket-view__send-message-box">
                <el-input
                  :rows="2"
                  type="textarea"
                  placeholder="Escreva alguma coisa" />
                <div class="ticket-view__send-message-actions">
                  <el-button type="primary">
                    Enviar
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
      <div class="ticket-view__section-title">
        <h2>Dados do caso</h2>
        <el-button plain>Exportar caso</el-button>
      </div>
      <case-data
        :loading="loadingDisputeSummary"
        :dispute="dispute"
        :dispute-summary="disputeSummary"
        :dispute-roles="disputeRoles" />
    </template>
  </JusViewMain>
</template>

<script>
import CaseSummary from './partials/CaseSummary'
import CaseData from './partials/CaseData'

export default {
  name: 'Ticket',
  components: {
    CaseSummary, CaseData
  },
  data () {
    return {
      dispute: {},
      disputeSummary: {},
      disputeOccurrences: [],
      filteredDisputeOccurrences: [],
      disputeRoles: {},
      loadingDispute: false,
      loadingDisputeSummary: false,
      loadingDisputeOccurrences: false,
      showSearch: false,
      searchTerm: '',
      messageType: 'message',
      newMessage: ''
    }
  },
  watch: {
    '$route.params.id': function (id) {
      this.fetchData()
    },
    showSearch (value) {
      if (!value) {
        this.searchTerm = ''
      }
    },
    searchTerm (term) {
      this.filterDisputeOccurrences(term)
    }
  },
  created () {
    this.fetchData()
  },
  beforeDestroy () {
    this.$store.commit('changeMenuIndex', null)
  },
  methods: {
    fetchData () {
      this.$store.commit('changeMenuIndex', '2')
      this.loadingDispute = true
      this.loadingDisputeSummary = true
      this.loadingDisputeOccurrences = true
      this.$store.dispatch('getDispute', this.$route.params.id).then((responses) => {
        this.dispute = responses
        this.loadingDispute = false
      }).catch(error => this.showError(error))
      this.$store.dispatch('getDisputeSummary', this.$route.params.id).then((responses) => {
        this.disputeSummary = responses
        this.loadingDisputeSummary = false
      }).catch(error => this.showError(error))
      this.$store.dispatch('getDisputeOccurrences', this.$route.params.id).then((responses) => {
        this.disputeOccurrences = responses
        this.filteredDisputeOccurrences = this.disputeOccurrences.slice(0)
        this.loadingDisputeOccurrences = false
      }).catch(error => this.showError(error))
      this.$store.dispatch('getDisputeRoles', this.$route.params.id).then((responses) => {
        this.disputeRoles = responses
      }).catch(error => this.showError(error))
    },
    showError (error) {
      console.error(error)
      this.$jusNotification({
        title: 'Ops!',
        message: 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.',
        type: 'error'
      })
    },
    messageClass (type) {
      return 'ticket-view__message--' + type.toLowerCase()
    },
    clientMessageClass (personId) {
      if (personId) {
        if (this.$store.getters.negotiatorIds.includes(personId)) {
          return 'ticket-view__message--negotiator'
        } else return 'ticket-view__message--client'
      } else return ''
    },
    filterDisputeOccurrences (term) {
      var occurrences = this.disputeOccurrences.slice(0)
      if (term) {
        var results = occurrences.filter(this.createDisputeFilter(term))
        this.filteredDisputeOccurrences = results
      } else {
        this.filteredDisputeOccurrences = occurrences
      }
    },
    createDisputeFilter (term) {
      return (occurrence) => {
        return (occurrence.description.toLowerCase().indexOf(term.toLowerCase()) === 0)
      }
    },
    setMessageType (type) {
      this.messageType = type
    },
    doAction (action) {
      this.$confirm('Tem certeza que deseja realizar essa ação?', 'Atenção', {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }).then(() => {
        this.$jusNotification({
          title: 'Pronto!',
          message: 'Ação realizada com sucesso.',
          type: 'success'
        })
      })
    },
    sendMessage () {
      if (this.newMessage) {
        if (this.messageType === 'message') {
          alert()
        } else {
          this.$store.dispatch('send' + this.messageType, {
            to: [1, 2, 3],
            message: this.newMessage,
            subject: 'Teste whatsapp',
            disputeId: this.dispute.id
          })
        }
      }
    }
  }
}
</script>

<style lang="scss">
.ticket-view {
  &__chat {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  &__messages {
    overflow-x: auto;
    height: 100%;
    padding: 10px 20px 0;
    margin: 0;
  }
  &__message {
    display: flex;
    list-style: none;
    margin: 30px 0;
    &.ticket-view__message--enrichment, &.ticket-view__message--log, &.ticket-view__message--interaction {
      text-align: center;
      .ticket-view__content {
        width: 100%;
      }
      .el-card {
        color: #adadad;
        box-shadow: none !important;
        border: none !important;
        background-color: transparent;
        &__body {
          padding: 10px 0;
        }
      }
      .ticket-view__content-info {
        display: none;
      }
    }
    &--communication {
      .ticket-view__photo {
        display: block;
      }
      &.ticket-view__message--negotiator {
        flex-direction: row-reverse;
        .ticket-view__content {
          margin-left: 0;
          margin-right: 20px;
          &:after {
            content: '';
            position: absolute;
            right: 10px;
            top: 20px;
            width: 0;
            height: 0;
            border: 17px solid transparent;
            border-left-color: #e4e8ea;
            border-right: 0;
            margin-top: -17px;
            margin-right: -17px;
          }
          &:before {
            content: none;
          }
        }
        .el-card {
          background-color: #e4e8ea;
        }
        .ticket-view__content-info {
          text-align: right;
        }
      }
    }
    &:first-child {
      margin-top: 20px;
    }
    &:last-child {
      margin-bottom: 20px;
    }
  }
  &__photo {
    display: none;
    margin-top: 1px;
  }
  &__info-line {
    margin-bottom: 10px;
    span:last-child {
      font-weight: 500;
      float: right;
      max-width: 185px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
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
      }
    }
  }
  &__send-message-actions {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
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
  }
  &__side-content {
    margin: 20px 0 0;
    .el-step__title {
      text-transform: capitalize;
    }
    .el-step__description {
      min-width: 270px;
    }
    .el-step__head {
      overflow: hidden;
    }
  }
  &__actions {
    text-align: center;
    padding: 11px 20px;
    box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.06);
    z-index: 1;
    button {
      border-radius: 5px;
      padding: 11px;
    }
    img {
      width: 16px;
      height: 16px;
    }
  }
  &__steps {
    padding-top: 10px;
    .el-button--text {
      padding-top: 0;
    }
  }
  .jus-main-view__main-card {
    height: 100%;
    > .el-card__body {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 0
    }
  }
  hr {
    margin: 1px -20px 20px;
  }
  .el-collapse--bordered {
    .el-collapse-item {
      box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.06);
      &.is-active {
        border: 2px solid #9461f7;
      }
    }

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
