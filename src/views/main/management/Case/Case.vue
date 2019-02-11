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
      <div class="ticket-view__side-content">
        <el-steps
          v-if="!loadingdisputeSummary"
          :active="disputeSummary.occurencies.length - 1"
          direction="vertical"
          process-status="wait"
          class="ticket-view__steps el-steps--dots">
          <el-step v-for="occurrence in disputeSummary.occurencies" :key="occurrence.id">
            <template slot="title">{{ $t('occurrence.type.' + occurrence.name) }}</template>
            <template slot="description">
              <el-popover
                placement="bottom"
                width="200"
                trigger="hover">
                <ul>
                  <li v-for="(occurrences, item) in occurrence.items" :key="occurrences + item">
                    {{ item }}: {{ occurrences }}
                  </li>
                </ul>
                <el-button slot="reference" type="text">Ver detalhes</el-button>
              </el-popover>
            </template>
          </el-step>
        </el-steps>
        <el-steps
          v-loading="true"
          v-else
          :active="4"
          direction="vertical"
          process-status="wait"
          class="ticket-view__steps el-steps--dots">
          <el-step v-for="occurrence in 4" :key="occurrence">
            <template slot="title">Ocorrência</template>
            <template slot="description">Ver detalhes</template>
          </el-step>
        </el-steps>
      </div>
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
          <el-button plain>
            <jus-icon icon="move-case" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="delegate">
          <el-button plain>
            <jus-icon icon="delegate" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="lose">
          <el-button plain>
            <jus-icon icon="lose" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="win">
          <el-button plain>
            <jus-icon icon="win" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="pause">
          <el-button plain>
            <jus-icon icon="pause" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="start-again">
          <el-button plain>
            <jus-icon icon="start-again" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="snooze">
          <el-button plain>
            <jus-icon icon="snooze" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="star">
          <el-button plain>
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
                  type="textarea"
                  placeholder="Escreva alguma coisa" />
                <div class="ticket-view__send-message-actions">
                  <div class="">
                    <el-tooltip content="Enviar mensagem">
                      <jus-icon icon="message" is-active />
                    </el-tooltip>
                    <el-tooltip content="Enviar email">
                      <jus-icon icon="email" />
                    </el-tooltip>
                    <el-tooltip content="Enviar Whatsapp">
                      <jus-icon icon="whatsapp" />
                    </el-tooltip>
                    <!-- <jus-icon icon="sms" /> -->
                    <!-- <jus-icon icon="attachment" /> -->
                    <!-- <jus-icon icon="emoji" /> -->
                  </div>
                  <el-button type="primary">
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
      <el-collapse value="1">
        <el-collapse-item v-loading="loadingdisputeSummary" title="Informações gerais" name="1">
          <div class="ticket-view__info-line">
            <span>Nº do Processo:</span>
            <span>{{ dispute.code }}</span>
          </div>
          <div class="ticket-view__info-line">
            <span>Campanha:</span>
            <span>NESTLÉ - NATAL2018</span>
          </div>
          <div class="ticket-view__info-line">
            <span>Estratégia:</span>
            <span>Indenizatório</span>
          </div>
          <div class="ticket-view__info-line">
            <span>Alçada máxima:</span>
            <span>R$ {{ disputeSummary.boundary }}</span>
          </div>
          <div class="ticket-view__info-line">
            <span>Contraproposta:</span>
            <span>R$ {{ disputeSummary.lastProposal }}</span>
          </div>
          <div class="ticket-view__info-line">
            <span>Valor do acordo:</span>
            <span>R$ {{ disputeSummary.dealValue }}</span>
          </div>
          <div class="ticket-view__info-line">
            <span>Fim da negociação:</span>
            <span>28/10/2020</span>
          </div>
        </el-collapse-item>
      </el-collapse>
      <hr>
      <el-collapse v-loading="true" accordion class="el-collapse--bordered">
        <el-collapse-item title="Contraparte 1" name="1">
          <div class="ticket-view__info-line">
            <span>Status:</span>
            <span>Online</span>
          </div>
          <div class="ticket-view__info-line">
            <span>Nome:</span>
            <span>Edineide Pereira da Silva</span>
          </div>
          <div class="ticket-view__info-line">
            <span>E-mail:</span>
            <span>edineide.htinha@aol.com</span>
          </div>
          <div class="ticket-view__info-line">
            <span>Telefone:</span>
            <span>(12) 91234-5678</span>
          </div>
          <div class="ticket-view__info-line">
            <span>CPF:</span>
            <span>123.456.789-0</span>
          </div>
        </el-collapse-item>
        <el-collapse-item title="Advogado 1 da contraparte" name="2">
          opa
        </el-collapse-item>
      </el-collapse>
    </template>
  </JusViewMain>
</template>

<script>
export default {
  name: 'Ticket',
  data () {
    return {
      dispute: {},
      disputeSummary: {},
      disputeOccurrences: [],
      filteredDisputeOccurrences: [],
      loadingDispute: false,
      loadingdisputeSummary: false,
      loadingDisputeOccurrences: false,
      showSearch: false,
      searchTerm: ''
    }
  },
  watch: {
    '$route.params.id': function (id) {
      this.fetch()
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
    this.fetch()
  },
  beforeDestroy () {
    this.$store.commit('changeMenuIndex', null)
  },
  methods: {
    fetch () {
      this.$store.commit('changeMenuIndex', '2')
      this.loadingDispute = true
      this.loadingdisputeSummary = true
      this.loadingDisputeOccurrences = true
      Promise.all([
        this.$store.dispatch('getDispute', this.$route.params.id),
        this.$store.dispatch('getDisputeSummary', this.$route.params.id),
        this.$store.dispatch('getDisputeOccurrences', this.$route.params.id)
      ]).then(responses => {
        this.dispute = responses[0]
        this.disputeSummary = responses[1]
        this.disputeOccurrences = responses[2]
        this.filteredDisputeOccurrences = this.disputeOccurrences.slice(0)
        this.filteredMessages =
        this.loadingDispute = false
        this.loadingdisputeSummary = false
        this.loadingDisputeOccurrences = false
      }).catch(error => {
        console.error(error)
        this.$notify(this.$notificationMessage('connectionError'))
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
    margin: 0 5px;
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
