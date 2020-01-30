<template lang="html">
  <ul v-loading="loading" v-chat-scroll="{always: false, smooth: true, scrollonremoved: true }" class="dispute-view-occurrences">
    <infinite-loading :distance="1" spinner="spiral" direction="top" @infinite="loadOccurrences">
      <div slot="no-more" data-testid="occurences-start">Início das ocorrências</div>
      <div slot="no-results" data-testid="occurences-start">Início das ocorrências</div>
    </infinite-loading>
    <div v-for="(datedOccurrence, date, index) in datedOccurrences" :key="date + index">
      <el-card class="dispute-view-occurrences__date el-card--bg-info" shadow="never">
        {{ date }}
      </el-card>
      <li
        v-for="(occurrence, index) in datedOccurrence"
        :key="index + new Date().getTime()"
        class="dispute-view-occurrences__occurrence">
        <el-card
          v-if="occurrence.type === 'LOG' ||
            (occurrence.interaction && ['VISUALIZATION', 'CLICK'].includes(occurrence.interaction.type)) ||
          (occurrence.interaction && occurrence.interaction.type === 'NEGOTIATOR_ACCESS')"
          shadow="never"
          class="dispute-view-occurrences__log el-card--bg-warning">
          <el-tooltip :disabled="!buildTooltip(occurrence)" :content="buildTooltip(occurrence)">
            <span :class="{ 'dispute-view-occurrences__log-canceled': occurrence.interaction && occurrence.interaction.message && occurrence.interaction.message.status === 'CANCELED'}" class="dispute-view-occurrences__log-icon">
              <jus-icon :icon="buildIcon(occurrence)" :class="buildIcon(occurrence)"/>
            </span>
          </el-tooltip>
          <span v-html="buildLogContent(occurrence)" />
          <span class="dispute-view-occurrences__log-hour" v-html="buildHour(occurrence)" />
        </el-card>
        <div v-else-if="occurrence.type !== 'NOTE'" :class="occurrence.interaction ? occurrence.interaction.direction : ''" class="dispute-view-occurrences__interaction">
          <div class="dispute-view-occurrences__avatar">
            <el-tooltip :disabled="!buildName(occurrence)" :content="buildName(occurrence)">
              <jus-avatar-user :name="buildName(occurrence)" shape="circle" size="sm" />
            </el-tooltip>
            <!-- <span v-html="buildHour(occurrence)" /> -->
          </div>
          <div class="dispute-view-occurrences__card-box">
            <el-card :class="(occurrence.interaction ? occurrence.interaction.type : '') + ' ' + buildCommunicationType(occurrence)" shadow="never" class="dispute-view-occurrences__card" data-testid="message-box">
              <!-- <div v-if="!!buildName(occurrence)" slot="header">
                <jus-icon v-if="occurrence.interaction && occurrence.interaction.message && occurrence.interaction.message.communicationType !== 'UNKNOWN'" :icon="buildIcon(occurrence)" :class="{'NEGOTIATOR': occurrence.interaction && occurrence.interaction.type.startsWith('NEGOTIATOR')}"/>
                <span>{{ buildName(occurrence) }}</span>
              </div> -->
              <div>
                <span :ref="getMessageRef(occurrence)">
                  <span v-html="buildContent(occurrence)" />
                  <span v-if="showResume(occurrence)">
                    <a href="#" data-testid="show-email" @click.prevent="showFullMessage(occurrence.id)"> ver mais</a>
                  </span>
                </span>
                <br>
                <i v-if="occurrence.interaction && occurrence.interaction.message && occurrence.interaction.message.status === 'CANCELED'">
                  <br>
                  <i class="el-icon-close" style="width: 14px;margin-bottom: -1.2px;" />
                  Mensagem agendada para {{ occurrence.interaction.message.scheduledTime.dateTime | moment('DD/MM[ às ]HH:mm') }}
                  <strong>CANCELADA</strong>.
                </i>
                <i v-else-if="occurrence.interaction && occurrence.interaction.message && occurrence.interaction.type === 'SCHEDULER'">
                  <br>
                  <jus-icon icon="clock" style="width: 14px;margin-bottom: -1.2px;"/>
                  Mensagem agendada para
                  {{ occurrence.interaction.message.scheduledTime.dateTime | moment('DD/MM[ às ]HH:mm') }}
                  que ainda não foi entregue.
                </i>
              </div>
            </el-card>
            <div :class="(occurrence.interaction ? occurrence.interaction.direction : '')" class="dispute-view-occurrences__card-info">
              <span v-html="buildHour(occurrence)" />
              <div v-if="!!buildIcon(occurrence)">•</div>
              <jus-icon v-if="!!buildIcon(occurrence)" :icon="buildIcon(occurrence)" :class="{'NEGOTIATOR': occurrence.interaction && occurrence.interaction.type.startsWith('NEGOTIATOR')}"/>
              <div v-if="(occurrence.interaction && occurrence.interaction.message) && (occurrence.interaction.message.receiver || occurrence.interaction.message.parameters)">•</div>
              <span
                v-if="occurrence.interaction && occurrence.interaction.message && occurrence.interaction.message.receiver && occurrence.interaction.direction === 'OUTBOUND'"
                class="dispute-view-occurrences__for-to">
                Para: {{ occurrence.interaction.message.receiver | phoneMask }}
              </span>
              <!-- <el-tooltip :content="occurrence.interaction.message.parameters.SENDER" placement="bottom">
                <span
                  v-if="occurrence.interaction && occurrence.interaction.message && occurrence.interaction.message.parameters && occurrence.interaction.direction === 'INBOUND'"
                  class="dispute-view-occurrences__for-to">
                  Por: {{ occurrence.interaction.message.parameters.SENDER_NAME }}
                </span>
              </el-tooltip> -->
              <span
                v-if="occurrence.interaction && occurrence.interaction.message && occurrence.interaction.message.parameters && occurrence.interaction.direction === 'INBOUND'"
                class="dispute-view-occurrences__for-to">
                Por: {{ occurrence.interaction.message.parameters.SENDER_NAME }} ({{ occurrence.interaction.message.parameters.SENDER || occurrence.interaction.message.sender | phoneMask }})
              </span>
            </div>
          </div>
          <div v-if="showReply(occurrence)" class="dispute-view-occurrences__reply-email">
            <el-tooltip content="Responder">
              <a href="#" @click.prevent="startReply(occurrence)">
                <jus-icon icon="reply" />
              </a>
            </el-tooltip>
          </div>
        </div>
      </li>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="messageDialogVisible"
      data-testid="email-dialog"
      width="70%">
      <span slot="title">
        <h2>Mensagem</h2>
      </span>
      <div v-loading="loadingMessage">
        <span v-if="messageError && !loadingMessage">
          <el-alert :closable="false" type="error">
            <strong>Não foi possível buscar o conteúdo da mensagem neste momento.</strong>
            <br><br>
            Tente novamente ou entre em contato com o administrador do sistema.
          </el-alert>
        </span>
        <span v-else-if="!message && !loadingMessage">
          <el-alert :closable="false" type="warning">
            <strong>Não foi possível exibir o conteúdo da mensagem.</strong>
            <br><br>
            Mídias de áudio ou vídeo ainda não estão disponíveis para visualização na plataforma Justto.
          </el-alert>
        </span>
        <span v-else v-html="message"/>
      </div>
      <span slot="footer">
        <el-button plain data-testid="close-button" @click="messageDialogVisible = false">Fechar</el-button>
      </span>
    </el-dialog>
    <div style="margin-top: 20px">
      <slot />
    </div>
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
      loadingMessage: 'false',
      message: '',
      messageError: false,
      messageDialogVisible: false,
      showFullMessageList: [],
      fullMessageBank: {}
    }
  },
  computed: {
    datedOccurrences () {
      let datedOccurrences = {}
      this.$store.getters.occurrences.map(o => {
        let currentDay = this.$moment(o.createAt.dateTime).format('DD/MM/YYYY')
        if (o.type !== 'NOTE') {
          if (!datedOccurrences.hasOwnProperty(currentDay)) {
            datedOccurrences[currentDay] = []
          }
          datedOccurrences[currentDay].push(o)
        }
      })
      return datedOccurrences
    }
  },
  mounted () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.$store.commit('clearOccurrencesSize')
      this.$store.commit('clearDisputeOccurrences')
      setTimeout(() => {
        this.$store.dispatch('getDisputeOccurrences', this.disputeId).then(() => {
          this.loading = false
        })
      }, 200)
    },
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
    showFullMessage (occurrenceId) {
      this.showFullMessageList.push(occurrenceId)
    },
    showMessageDialog (messageId) {
      this.messageDialogVisible = true
      this.message = ''
      this.loadingMessage = true
      this.messageError = false
      this.$store.dispatch('getOccurrenceMessage', messageId)
        .then(message => {
          this.message = message.content
        }).catch(error => {
          this.messageError = true
          console.error(error)
        }).finally(() => {
          this.loadingMessage = false
        })
    },
    getMessageRef (occurrence) {
      if (occurrence.interaction &&
        occurrence.interaction.message &&
        occurrence.interaction.message.messageId) {
        return occurrence.id
      }
    },
    buildTooltip (occurrence) {
      let text = ''
      if (occurrence.interaction && occurrence.interaction.properties && occurrence.interaction.properties.DEVICE) {
        text = text + 'Dispositivo: ' + occurrence.interaction.properties.DEVICE
      }
      return text
    },
    buildIcon (occurrence) {
      if (occurrence.interaction && occurrence.interaction.type === 'CLICK') {
        return 'click'
      }
      if (occurrence.interaction && occurrence.interaction.type === 'VISUALIZATION') {
        return 'eye'
      }
      if (occurrence.interaction && occurrence.interaction.message && occurrence.interaction.message.communicationType) {
        return occurrence.interaction.message.communicationType.toLowerCase().replace('_', '-')
      }
      if (occurrence.interaction && ['NEGOTIATOR_PROPOSAL', 'NEGOTIATOR_REJECTED', 'NEGOTIATOR_ACCEPTED', 'NEGOTIATOR_CHECKOUT', 'NEGOTIATOR_ACCESS'].includes(occurrence.interaction.type + '')) {
        return 'justto'
      }
      if (occurrence.type === 'LOG') {
        if (occurrence.description.toLowerCase().includes('disputa dada como ganha')) return 'win'
        if (occurrence.description.toLowerCase().includes('disputa pausada')) return 'pause'
        if (occurrence.description.toLowerCase().includes('disputa alterada para perdido')) return 'lose'
        if (occurrence.description.toLowerCase().includes('reiniciou o engajamento')) return 'refresh'
        if (occurrence.description.toLowerCase().includes('disputa retomada')) return 'start-again'
        if (occurrence.description.toLowerCase().includes('disputa marcada como favorita')) return 'star'
        if (occurrence.description.toLowerCase().includes('disputa expirou')) return 'calendar-clock'
        if (occurrence.description.toLowerCase().includes('disputa expirada')) return 'calendar-clock'
      }
      return ''
    },
    buildName (occurrence) {
      if (occurrence.interaction &&
        occurrence.interaction.type &&
        occurrence.interaction.message &&
        occurrence.interaction.message.parameters &&
        occurrence.interaction.message.parameters.RECEIVER_NAME &&
        ['VISUALIZATION', 'CLICK'].includes(occurrence.interaction.type)) {
        return occurrence.interaction.message.parameters.RECEIVER_NAME.toUpperCase()
      }
      if (occurrence.interaction &&
        occurrence.interaction.message &&
        occurrence.interaction.message.parameters &&
        occurrence.interaction.message.parameters.SENDER_NAME) {
        return occurrence.interaction.message.parameters.SENDER_NAME.toUpperCase()
      }
      if (occurrence.interaction &&
        occurrence.interaction.properties &&
        occurrence.interaction.properties.PERSON_NAME) {
        return occurrence.interaction.properties.PERSON_NAME.toUpperCase()
      }
    },
    getOccurrenceMessage (messageId, occurrenceId) {
      this.$store.dispatch('getOccurrenceMessage', messageId).then(message => {
        let ref = this.$refs[occurrenceId]
        ref[0].innerHTML = message.content
        this.fullMessageBank[occurrenceId] = message.content
      })
    },
    buildLogContent (occurrence) {
      if (occurrence.interaction && occurrence.interaction.type === 'NEGOTIATOR_ACCESS') {
        return 'Disputa visualizada'
      }
      return occurrence.description
    },
    buildContent (occurrence) {
      if (occurrence.interaction && Object.keys(occurrence.interaction.properties).length) {
        if (occurrence.interaction.type === 'NEGOTIATOR_CHECKOUT' && occurrence.interaction.properties.BANK_INFO) {
          return '<strong>Dados bancários:</strong> <br>' + occurrence.interaction.properties.BANK_INFO.replace(/,/g, '<br>')
        }
        return occurrence.description
        // if (occurrence.interaction.properties.VALUE) {
        //   let content = occurrence.interaction.type === 'NEGOTIATOR_PROPOSAL' ? 'Contraproposta ' : 'Proposta '
        //   content = content + this.$t(occurrence.interaction.type) + ' R$ ' + occurrence.interaction.properties.VALUE.toUpperCase() + '.'
        //   if (occurrence.interaction.properties.NOTE) {
        //     content = content + '<br>Nota: ' + occurrence.interaction.properties.NOTE
        //   }
        //   return content
        // }
      }
      if (Object.keys(this.fullMessageBank).includes(occurrence.id.toString())) {
        return this.fullMessageBank[occurrence.id]
      }
      if (this.showFullMessageList.includes(occurrence.id)) {
        this.getOccurrenceMessage(occurrence.interaction.message.messageId, occurrence.id)
        return ''
      }
      if (occurrence.interaction &&
        occurrence.interaction.message &&
        occurrence.interaction.message.resume) {
        if (this.showResume(occurrence)) {
          return occurrence.interaction.message.resume + '...'
        }
        return occurrence.interaction.message.resume
      }
      return occurrence.description
    },
    showResume (occurrence) {
      if (!this.showFullMessageList.includes(occurrence.id) &&
        occurrence.interaction &&
        occurrence.interaction.message &&
        occurrence.interaction.message.resume &&
        occurrence.interaction.message.resume.length >= 140) {
        return true
      }
      return false
    },
    buildHour (occurrence) {
      if (occurrence.executionDateTime) {
        return this.$moment(occurrence.executionDateTime.dateTime).format('HH:mm')
      }
      return this.$moment(occurrence.createAt.dateTime).format('HH:mm')
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
    },
    showReply (occurrence) {
      if (occurrence.interaction &&
        occurrence.interaction.message &&
        occurrence.interaction.message.communicationType &&
        occurrence.interaction.message.communicationType === 'EMAIL' &&
        occurrence.interaction.direction === 'INBOUND') {
        return true
      }
      return false
    },
    startReply (occurrence) {
      let sender = occurrence.interaction.message.sender
      let resume = occurrence.interaction.message.resume
      this.$emit('dispute:reply', { sender, resume })
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
  &__occurrence {
    display: flex;
    justify-content: center;
  }
  &__interaction {
    margin-top: 20px;
    display: flex;
    width: 100%;
    &.OUTBOUND {
      flex-direction: row-reverse;
      .dispute-view-occurrences__card {
        margin-left: 8px;
      }
      .dispute-view-occurrences__avatar {
        margin: 0 20px 0 12px;
      }
    }
    &.INBOUND {
      .dispute-view-occurrences__card {
        margin-right: 8px;
      }
    }
  }
  &__card {
    border-radius: 8px;
    height: fit-content;
    &--note {
      border-radius: 0px;
      border: none;
      position: relative;
      .el-card__header {
        padding: 8px 20px !important;
      }
      .el-card__body {
        padding: 12px 20px !important;
      }
    }
    &--note-header {
      display: flex;
      justify-content: flex-end;
      i {
        margin-left: 8px;
        cursor: pointer;
      }
    }
    &.SCHEDULER {
      border: 2px dashed #343c4b;
    }
    &.COMMUNICATION, &.SCHEDULER {
      .el-card__header {
        padding: 10px 20px 0;
      }
      &.WHATSAPP {
        background-color: $--color-success-light-5;
      }
      &.EMAIL, &.UNKNOWN {
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
        margin-left: 8px;
      }
      img {
        width: 15px;
      }
    }
    .el-card__body {
      padding: 10px 20px;
      word-break: break-word;
      strong {
        margin-bottom: 8px;
        display: inline-block;
      }
    }
  }
  &__card-box {
    max-width: 70%;
  }
  &__card-info {
    display: flex;
    margin: 4px 22px 0 22px;
    white-space: nowrap;
    div {
      margin: 0 4px;
    }
    img {
      width: 16px;
    }
    span {
      font-weight: 300;
    }
    &.OUTBOUND {
      flex-direction: row-reverse;
    }
  }
  &__show-dialog {
    margin-top: 8px;
    display: block;
  }
  &__log {
    border-radius: 8px;
    margin: 20px 20px 0;
    border: none;
    .el-card__body {
      padding: 8px 20px;
      word-break: break-word;
      text-align: center;
      br:first-child {
        content: " ";
        display: block;
        margin: -7px 0;
      }
    }
    img {
      width: 15px;
      margin-right: 5px;
      &.justto {
        height: 11px;
      }
    }
  }
  &__log-hour {
    font-weight: 300;
    float: right;
    font-size: 11px;
    margin-top: 3px;
    margin-left: 10px;
  }
  &__note {
    border-radius: 8px;
    margin: 20px 20px 0;
    border: none;
    display: flex;
    width: 100%;
    flex-direction: row-reverse;
    .el-card__body {
      padding: 8px 20px;
      word-break: break-word;
      background-color: #f6f1ff;
    }
    .el-card__header {
      background-color: #efe7ff;
    }
  }
  &__avatar {
    margin: 0 12px 0 20px;
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
  &__date {
    + .dispute-view-occurrences__occurrence {
      margin-top: -16px;
    }
    position: sticky;
    top: 12px;
    margin: auto;
    margin-top: 20px;
    margin-bottom: 24px;
    width: fit-content;
    border: 1px solid $--color-info-light;
    .el-card__body {
      padding: 10px;
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
  .el-alert__description {
    font-size: 14px;
  }
  &__log-canceled {
    position: relative;
    &:before {
      content: "x";
      color: #fff4cc;
      position: absolute;
      bottom: 2px;
      right: 4px;
      height: 9px;
      width: 10px;
      font-size: 9px;
      background-color: #5a5646;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 1px;
    }
  }
  &__textarea .el-textarea__inner {
    height: 40vh;
    resize: none;
  }
  &__reply-email {
    align-self: center;
    margin-bottom: 22px;
    img {
      width: 20px;
    }
  }
}
</style>
