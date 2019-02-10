<template>
  <JusViewMain left-card-width="350" right-card-width="350" class="ticket-view">
    <template slot="title">
      <h1 class="ticket-view__title">
        <jus-icon icon="back" class="ticket-view__back"/>
        Caso #128774
      </h1>
    </template>
    <!-- RESUMO DO CASO -->
    <template slot="left-card">
      <div class="ticket-view__section-title">
        <h2>Resumo do caso</h2>
      </div>
      <div class="ticket-view__side-content">
        <el-steps
          :active="disputeOccurrences.length"
          direction="vertical"
          process-status="wait"
          class="ticket-view__steps el-steps--dots">
          <el-step v-for="ocurrence in disputeOccurrences" :key="ocurrence.id">
            <template slot="title">{{ ocurrence.type }}</template>
            <template slot="description">{{ ocurrence.description }}</template>
          </el-step>
          <el-step>
            <template slot="title">Acordo</template>
          </el-step>
        </el-steps>
      </div>
    </template>
    <!-- CHAT -->
    <template slot="main">
      <div class="ticket-view__actions">
        <el-tooltip content="search" placement="top">
          <el-button plain>
            <jus-icon icon="search2" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="move-case" placement="top">
          <el-button plain>
            <jus-icon icon="move-case" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="delegate" placement="top">
          <el-button plain>
            <jus-icon icon="delegate" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="lose" placement="top">
          <el-button plain>
            <jus-icon icon="lose" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="win" placement="top">
          <el-button plain>
            <jus-icon icon="win" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="pause" placement="top">
          <el-button plain>
            <jus-icon icon="pause" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="start-again" placement="top">
          <el-button plain>
            <jus-icon icon="start-again" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="snooze" placement="top">
          <el-button plain>
            <jus-icon icon="snooze" />
          </el-button>
        </el-tooltip>
        <el-tooltip content="star" placement="top">
          <el-button plain>
            <jus-icon icon="star" />
          </el-button>
        </el-tooltip>
      </div>
      <div class="ticket-view__chat">
        <ul v-chat-scroll="{always: false, smooth: true}" class="ticket-view__messages">
          <li v-for="(message, index) in messages" :key="message+index" :class="{'ticket-view__user' : message.sender === 'user'}">
            <div class="ticket-view__photo">
              <img v-if="message.sender === 'company'" src="https://i.ytimg.com/vi/7s6YIIZjfrQ/maxresdefault.jpg" alt="">
              <img v-else src="https://vignette.wikia.nocookie.net/parody/images/8/8c/Kermit-2011.png/revision/latest?cb=20150530035135" alt="">
              <div class="ticket-view__time">
                {{ message.time | moment('HH:mm') }}
              </div>
            </div>
            <div class="ticket-view__content">
              <el-card>
                {{ message.message }}
              </el-card>
            </div>
          </li>
        </ul>
        <div class="ticket-view__message">
          <el-tabs value="1">
            <el-tab-pane label="Mensagem" name="1">
              <el-card shadow="always" class="ticket-view__message-box">
                <el-input
                  :rows="2"
                  type="textarea"
                  placeholder="Escreva alguma coisa" />
                <div class="ticket-view__message-actions">
                  <div class="">
                    <jus-icon icon="email" is-active/>
                    <jus-icon icon="whatsapp" />
                    <jus-icon icon="sms" />
                    <jus-icon icon="message" />
                    <jus-icon icon="attachment" />
                    <jus-icon icon="emoji" />
                  </div>
                  <el-button type="primary">
                    Enviar
                  </el-button>
                </div>
              </el-card>
            </el-tab-pane>
            <el-tab-pane label="Nota" name="2">
              opa
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
        <el-collapse-item title="Informações gerais" name="1">
          <div class="ticket-view__info-line">
            <span>Nº do Processo:</span>
            <span>-</span>
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
            <span>R$ 7.000</span>
          </div>
          <div class="ticket-view__info-line">
            <span>Contraproposta:</span>
            <span>R$ 6.000</span>
          </div>
          <div class="ticket-view__info-line">
            <span>Valor do acordo:</span>
            <span>R$ 6.000</span>
          </div>
          <div class="ticket-view__info-line">
            <span>Fim da negociação:</span>
            <span>28/10/2020</span>
          </div>
        </el-collapse-item>
      </el-collapse>
      <hr>
      <el-collapse accordion class="el-collapse--bordered">
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
      disputeSumarry: {},
      disputeOccurrences: {},
      messages: [{
        message: 'Jo what’s a nice chilled movie I can go watch with my mom?',
        sender: 'company',
        time: new Date()
      }, {
        message: 'Well there’s a few showing at the moment. Do you mind a science fiction drama?',
        sender: 'user',
        time: new Date()
      }],
      newMessage: ''
    }
  },
  beforeMount () {
    Promise.all([
      this.$store.dispatch('getDispute', this.$route.params.id),
      this.$store.dispatch('getDisputeSummary', this.$route.params.id),
      this.$store.dispatch('getDisputeOccurrences', this.$route.params.id)
    ]).then(responses => {
      this.dispute = responses[0]
      this.disputeSumarry = responses[1]
      this.disputeOccurrences = responses[2]
    }).catch(error => {
      console.error(error)
      this.$notify(this.$notificationMessage('connectionError'))
    })
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
    li {
      display: flex;
      list-style: none;
      margin: 10px 0;
      &.ticket-view__user {
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
      }
    }
  }
  &__info-line {
    margin-bottom: 10px;
    span:last-child {
      font-weight: 500;
      float: right;
      max-width: 175px;
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
  &__photo {
    img {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
      box-shadow: 0 3px 26px 0 rgba(37, 38, 94, 0.15);
    }
  }
  &__time {
    margin-top: 4px;
    font-size: 12px;
    text-align: center;
  }
  &__message {
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
  &__message-box {
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
  &__message-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      margin-right: 10px;
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
    margin-top: 20px;
  }
  &__actions {
    text-align: center;
    padding: 11px 20px;
    box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.06);
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
    margin: 0 -20px 20px;;
  }
  .el-collapse--bordered {
    .el-collapse-item {
      box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.06);
      &.is-active {
        border: 2px solid #9461f7;
      }
    }

  }
}
</style>
