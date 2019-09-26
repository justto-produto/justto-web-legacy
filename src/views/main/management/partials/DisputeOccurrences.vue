<template lang="html">
  <ul v-loading="loading" v-chat-scroll="{always: false, smooth: true, scrollonremoved: true }" class="dispute-view-occurrences">
    <infinite-loading :distance="1" spinner="spiral" direction="top" @infinite="loadOccurrences">
      <div slot="no-more">Início das ocorrências</div>
      <div slot="no-results">Início das ocorrências</div>
    </infinite-loading>
    <li
      v-for="(occurrence, index) in occurrences"
      :key="index + new Date().getTime()"
      class="dispute-view-occurrences__occurrence">
      <el-card v-if="occurrence.type === 'LOG' || (occurrence.interaction && occurrence.interaction.type) === 'VISUALIZATION'" shadow="never" class="dispute-view-occurrences__log el-card--bg-warning">
        {{ occurrence.description }}
      </el-card>
      <el-card v-else-if="occurrence.interaction && occurrence.interaction.type === 'NEGOTIATOR_ACCESS'" shadow="never" class="dispute-view-occurrences__log el-card--bg-warning">
        {{ occurrence.description }}
      </el-card>
      <div v-else-if="occurrence.type !== 'NOTE'" :class="occurrence.interaction ? occurrence.interaction.direction : ''" class="dispute-view-occurrences__interaction">
        <div class="dispute-view-occurrences__avatar">
          <jus-avatar-user :name="buildName(occurrence)" shape="circle" size="sm" />
          <span v-html="buildHour(occurrence)" />
        </div>
        <el-card :class="(occurrence.interaction ? occurrence.interaction.type : '') + ' ' + buildCommunicationType(occurrence)" shadow="never" class="dispute-view-occurrences__card">
          <div v-if="!!buildName(occurrence)" slot="header">
            <span>{{ buildName(occurrence) }}</span>
            <jus-icon :icon="buildIcon(occurrence)" :class="{'NEGOTIATOR': occurrence.interaction && occurrence.interaction.type.startsWith('NEGOTIATOR')}"/>
          </div>
          <div>
            <span v-html="buildContent(occurrence)" />
            <div v-if="occurrence.interaction && occurrence.interaction.type === 'COMMUNICATION'">
              <a href="#" @click.prevent="showMessageDialog(occurrence.interaction.message.messageId)">Ver mensagem</a>
            </div>
            <i v-if="occurrence.interaction && occurrence.interaction.message && occurrence.interaction.message.status === 'WAITING'">
              <br>
              <jus-icon icon="clock" style="width: 14px;margin-bottom: -1.2px;"/>
              Esta é uma mensagem agendada para
              {{ occurrence.interaction.message.scheduledTime.dateTime | moment('DD/MM[ às ]HH:mm') }}
              que ainda não foi entregue.
            </i>
          </div>
        </el-card>
      </div>
    </li>
    <li v-if="!loading && !occurrences.length" class="dispute-view-occurrences__empty">
      <jus-icon icon="empty-screen-filter" />
      Não foram encontradas ocorrências.
    </li>
    <el-dialog
      :visible.sync="messageDialogVisible"
      data-testid="email-dialog"
      width="70%">
      <span slot="title">
        <h2>Mensagem</h2>
      </span>
      <div v-loading="loadingMessage">
        <span v-if="!message && !loadingMessage">
          <el-alert
            :closable="false"
            type="error">
           Não foi possível buscar o conteúdo na mensagem neste momento. Tente novamente ou entre em contato com o administrador do sistema.
         </el-alert>
        </span>
        <span v-else v-html="message"/>
      </div>
      <span slot="footer">
        <el-button plain data-testid="close-button" @click="messageDialogVisible = false">Fechar</el-button>
      </span>
    </el-dialog>
  </ul>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'

export default {
  name: 'DisputeOccurrences',
  components: { InfiniteLoading },
  props: {
    disputeId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      loading: true,
      messageDialogVisible: false,
      loadingMessage: 'false',
      message: ''
    }
  },
  computed: {
    occurrences () {
      return this.$store.getters.occurrences.reverse()
    }
  },
  mounted () {
    this.$store.commit('clearOccurrencesSize')
    this.$store.commit('clearDisputeOccurrences')
    setTimeout(() => {
      this.$store.dispatch('getDisputeOccurrences', this.disputeId).then(() => {
        this.loading = false
      })
    }, 200)
  },
  methods: {
    loadOccurrences ($state) {
      this.$store.commit('incrementOccurrencesSize')
      this.$store.dispatch('getDisputeOccurrences', this.disputeId).then(response => {
        if (response.numberOfElements >= response.totalElements) {
          $state.complete()
        } else {
          $state.loaded()
        }
      })
    },
    showMessageDialog (messageId) {
      this.messageDialogVisible = true
      this.message = ''
      this.loadingMessage = true
      this.$store.dispatch('getOccurrenceMessage', messageId)
        .then(message => {
          this.message = message.content
        }).catch(error => {
          console.error(error)
        }).finally (() => {
          this.loadingMessage = false
        })
    },
    buildIcon (occurrence) {
      if (occurrence.interaction && occurrence.interaction.message && occurrence.interaction.message.communicationType) {
        return occurrence.interaction.message.communicationType.toLowerCase().replace('_', '-')
      }
      if (occurrence.interaction && ['NEGOTIATOR_PROPOSAL', 'NEGOTIATOR_REJECTED', 'NEGOTIATOR_ACCEPTED', 'NEGOTIATOR_CHECKOUT'].includes(occurrence.interaction.type)) {
        return 'justto'
      }
      return ''
    },
    buildName (occurrence) {
      if (occurrence.interaction &&
        occurrence.interaction.message &&
        occurrence.interaction.message.parameters &&
        occurrence.interaction.message.parameters.SENDER_NAME) {
        return occurrence.interaction.message.parameters.SENDER_NAME.toLowerCase()
      }
      if (occurrence.interaction &&
        occurrence.interaction.properties &&
        occurrence.interaction.properties.PERSON_NAME) {
        return occurrence.interaction.properties.PERSON_NAME.toLowerCase()
      }
    },
    buildContent (occurrence) {
      if (occurrence.interaction && Object.keys(occurrence.interaction.properties).length) {
        if (occurrence.interaction.type === 'NEGOTIATOR_CHECKOUT' && occurrence.interaction.properties.BANK_INFO) {
          return '<strong>Dados bancários:</strong> <br>' + occurrence.interaction.properties.BANK_INFO.replace(/,/g, '<br>')
        }
        if (occurrence.interaction.properties.VALUE) {
          let word = occurrence.interaction.type === 'NEGOTIATOR_PROPOSAL' ? 'Contraproposta ' : 'Proposta '
          return word + this.$t(occurrence.interaction.type) + ' R$ ' + occurrence.interaction.properties.VALUE.toUpperCase()
        }
      }
      return occurrence.description
    },
    buildHour (occurrence) {
      if (occurrence.executionDateTime) {
        return this.$moment(occurrence.executionDateTime.dateTime).format('DD-MM[<br>]HH:mm')
      }
      return this.$moment(occurrence.createAt.dateTime).format('DD-MM[<br>]HH:mm')
    },
    buildCommunicationType (occurrence) {
      let typeClass = ''
      if (occurrence.interaction && occurrence.interaction.message) {
        if (occurrence.interaction.message.communicationType) {
          typeClass = occurrence.interaction.message.communicationType
        }
        if (occurrence.interaction.message.status) {
          typeClass = typeClass + ' ' + occurrence.interaction.message.status
        }
      }
      return typeClass
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';

.dispute-view-occurrences {
  list-style: none;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  height: 100%;
  padding-bottom: 20px;
  &__occurrence {
    display: flex;
    justify-content: center;
  }
  &__interaction {
    margin: 20px 20px 0;
    display: flex;
    width: 100%;
    &.OUTBOUND {
      flex-direction: row-reverse;
      .dispute-view-occurrences__avatar {
        margin: 0 0 0 12px;
      }
    }
  }
  &__card {
    border-radius: 8px;
    height: fit-content;
    &.WAITING {
      border: 2px dashed #343c4b;
    }
    &.COMMUNICATION {
      .el-card__header {
        padding: 10px 20px 0;
      }
      &.WHATSAPP {
        background-color: $--color-success-light-5;
      }
      &.EMAIL {
        background-color: $--color-cloudy-blue;
      }
      &.EMAIL_CNA {
        background-color: #B6FFFB;
      }
    }
    &.NEGOTIATOR_REJECTED, &.NEGOTIATOR_PROPOSAL, &.NEGOTIATOR_ACCEPTED {
      border: 1px solid #FFC5A5;
      .el-card__header {
        background-color: #FFC5A5;
      }
      .el-card__body {
      }
      .note {
        font-weight: lighter;
        font-style: italic;
        color: #000;
      }
    }
    &.NEGOTIATOR_CHECKOUT {
      border: 1px solid #B691FB;
      .el-card__header {
        background-color: #B691FB;
      }
    }
    .el-card__header {
      padding: 10px 20px;
      font-weight: bold;
      border: 0;
      text-transform: capitalize;
      > div {
        display: flex;
        align-items: center;
      }
      span {
        margin-right: 8px;
      }
      img {
        width: 15px;
        &.NEGOTIATOR {
          width: 18px;
        }
      }
    }
    .el-card__body {
      padding: 10px 20px;
      strong {
        margin-bottom: 8px;
        display: inline-block;
      }
      a {
        margin-top: 8px;
        display: block;
      }
    }
  }
  &__log {
    border-radius: 8px;
    margin: 20px 20px 0;
    border: none;
    .el-card__body {
      padding: 8px 20px;
      word-break: break-all;
      text-align: center;
    }
  }
  &__avatar {
    margin: 0 12px 0 0;
    display: flex;
    flex-direction: column;
    width: max-content;
    text-align: center;
    span {
      font-size: 12px;
      margin-top: 4px;
    }
  }
  &__empty {
    width: 100%;
    height: 100%;
    font-weight: 400;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: $--color-text-secondary;
    img {
      margin-bottom: 20px;
      width: 60px;
    }
  }
  .el-dialog__body {
    min-height: 128px;
    .el-loading-parent--relative {
      height: 100%;
    }
  }
  .infinite-status-prompt {

    padding-top: 30px !important;
    color: $--color-text-secondary !important;
    font-style: italic;
  }
  .loading-spiral {
    border: 2px solid #9461f7 !important;
    border-right-color: transparent !important;
  }
}
</style>
