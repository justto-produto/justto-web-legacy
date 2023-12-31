<template>
  <article
    v-loading="localLoading"
    element-loading-text="Aguarde..."
    element-loading-spinner="el-icon-info"
    class="phone-container"
  >
    <div
      v-if="!hideInfo"
      class="phone-container__contact"
      @click="copyContact"
    >
      <JusIcon
        class="phone-container__email-icon"
        icon="tts"
      />
      <span
        v-if="contact.length"
        class="phone-container__email-prefix"
      >
        {{ prefix }}
      </span>

      {{ contact }}
    </div>

    <div
      v-else
      class="phone-container__editor"
    >
      <div class="phone-container__editor-label">
        {{ occurrence.description }}
      </div>
    </div>

    <div
      v-if="mediaLink && !badStatus && !hasActiveCall"
      class="phone-container__audio"
    >
      <audio
        v-if="hasValidAudio"
        controls
        class="phone-container__audio-component"
      >
        <source
          :src="mediaLink"
          type="audio/wav"
        >
        <em>Seu navegador não suporta o elemento audio.</em>
      </audio>

      <div
        v-else
        class="phone-container__audio-component fallback"
      >
        <el-tooltip content="Gravação não disponível">
          <JusIcon icon="missed-call" />
        </el-tooltip>
      </div>

      <div
        v-if="hasValidAudio"
        class="phone-container__audio-buttons"
      >
        <el-tooltip content="Copiar link">
          <el-button
            class="phone-container__audio-buttons-share"
            icon="el-icon-share"
            size="mini"
            circle
            @click="shareAudio"
          />
        </el-tooltip>
      </div>
    </div>

    <div
      v-if="hasActiveCall"
      class="phone-container__audio_current_call"
    >
      <i class="el-icon-microphone el-icon-pulse" />

      <div>
        <span>Chamada em andamento…</span>

        <i class="el-icon-loading" />
      </div>
    </div>

    <div
      v-else-if="('INDISPONIVEL' === audio.situacao || ('SEM_ARQUIVO' === audio.situacao && callWasRecently)) && hasValidAudio"
      class="phone-container__bad-status"
    >
      <el-button
        type="secondary"
        size="mini"
        @click="() => { localLoading = true; handleRequestTranscription(closeLoading)}"
      >
        Transcrever áudio
      </el-button>
    </div>

    <CallTextContent
      v-else-if="mediaLink && hasValidAudio && useCallTrancription"
      class="phone-container__editor"
      :note.sync="editorText"
      :resume="audio.resumo"
      :transcription="audio.correcao"
    >
      <div class="phone-container__editor jus-ckeditor__parent">
        <ckeditor
          v-if="enabledEditor"
          ref="callTextEditor"
          v-model="editorText"
          :editor="editor"
          :config="editorConfig"
          class="phone-container__editor-editor"
          type="classic"
        />

        <div
          v-else-if="hasValidAudio"
          class="phone-container__editor-preview"
          v-html="editorText"
        />

        <div
          v-if="hasValidAudio"
          class="phone-container__editor-switch"
          :class="{'right': enabledEditor}"
        >
          <el-button
            v-if="!enabledEditor"
            type="text"
            icon="el-icon-edit"
            @click="enabledEditor = !enabledEditor"
          >
            Editar anotações da conversa
          </el-button>

          <el-button
            v-if="enabledEditor"
            size="mini"
            @click="enabledEditor = !enabledEditor"
          >
            Cancelar
          </el-button>

          <el-button
            v-if="enabledEditor"
            type="primary"
            size="mini"
            @click="saveMassageContent()"
          >
            Salvar
          </el-button>
        </div>
      </div>
    </CallTextContent>

    <div
      v-if="mediaLink && !badStatus && !useCallTrancription"
      class="phone-container__editor jus-ckeditor__parent"
    >
      <label
        class="phone-container__editor-label"
        :class="{'invalid-audio': !hasValidAudio}"
      >
        {{ hasActiveCall ? 'Anote o que precisar desta ligação em andamento:' : hasValidAudio ? 'Anote sobre sua conversa abaixo:' : 'Chamada não foi atendida.' }}
      </label>

      <ckeditor
        v-if="enabledEditor"
        ref="callTextEditor"
        v-model="editorText"
        :editor="editor"
        :config="editorConfig"
        class="phone-container__editor-editor"
        type="classic"
      />

      <em
        v-else-if="hasValidAudio"
        class="phone-container__editor-notes"
        v-html="editorText"
      />

      <div
        v-if="hasValidAudio"
        class="phone-container__editor-switch"
        :class="{'right': enabledEditor}"
      >
        <el-button
          v-if="!enabledEditor"
          type="text"
          icon="el-icon-edit"
          @click="enabledEditor = !enabledEditor"
        >
          Editar anotações da conversa
        </el-button>

        <el-button
          v-if="enabledEditor"
          size="mini"
          @click="enabledEditor = !enabledEditor"
        >
          Cancelar
        </el-button>

        <el-button
          v-if="enabledEditor"
          type="primary"
          size="mini"
          @click="saveMassageContent()"
        >
          Salvar
        </el-button>
      </div>
    </div>

    <div
      v-else-if="(audio.situacao === 'SEM_ARQUIVO' || !hasValidAudio) && !hasActiveCall"
      class="phone-container__bad-status"
    >
      <label class="phone-container__bad-status-label">
        Chamada não foi atendida.
      </label>
    </div>

    <div
      v-else-if="badStatus"
      class="phone-container__bad-status"
    >
      <label class="phone-container__bad-status-label">
        {{ $tc(`call.interaction.status.${badStatus}`) }}:
      </label>

      <em class="phone-container__bad-status-note">
        {{ badNote }}
      </em>
    </div>
  </article>
</template>

<script>
import ckeditor from '@/utils/mixins/ckeditor'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    CallTextContent: () => import('./partials/CallTextContent')
  },

  mixins: [ckeditor],

  props: {
    value: {
      type: Object,
      required: true
    },

    occurrence: {
      type: Object,
      required: true
    },

    hideInfo: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      editorText: '',
      dontUseTablePlugin: true,
      useMentionPlugin: true,
      showEditor: false,
      localLoading: false,
      audioCodeResult: '',
      audio: {
        situacao: '',
        transcricao: '',
        correcao: '',
        resumo: ''
      },
      transcriptionWatcher: null
    }
  },

  computed: {
    ...mapGetters({
      currentCall: 'getCurrentCall',
      useCallTrancription: 'useCallTrancription'
    }),

    contact() {
      const personName = this.$options.filters.resumedName(this.value?.properties?.TO_PERSON_NAME || '')
      const number = this.value?.message?.receiver ? '<' + this.$options.filters.phoneNumber(this.value?.message?.receiver) + '>' : ''

      return `${personName} ${number}`
    },

    prefix() {
      return 'para'
    },

    sendDate() {
      const dateAt = this.value.updateAt || this.value.createAt

      return dateAt?.dateTime
    },

    mediaLink() {
      return this.value?.properties?.LINK
    },

    badStatus() {
      return this.value?.properties?.STATUS
    },

    badNote() {
      return this.value?.properties?.NOTE
    },

    hasActiveCall() {
      return this.value?.properties?.VALUE === String(this.currentCall?.id)
    },

    enabledEditor: {
      get() {
        return this.showEditor || (this.hasActiveCall && !this.editorText)
      },

      set(value) {
        this.showEditor = value
      }
    },

    callWasRecently() {
      const createdDiff = this.$moment().diff(this.$moment(this.occurrence?.createAt?.dateTime), 'minutes')

      return createdDiff < 5
    },

    isLinkOk() {
      const voiceStatus = this.value?.message?.parameters?.VOICE_STATUS

      return ['16'].includes(String(this.audioCodeResult)) || voiceStatus === 'Answered' || (voiceStatus === 'SetUp' && this.callWasRecently) || this.hasActiveCall
    },

    hasValidAudio() {
      return this.isLinkOk || this.hasActiveCall
    }
  },

  watch: {
    hasActiveCall(have, had) {
      this.enabledEditor = have

      if (had && !have) {
        this.localLoading = true

        setTimeout(() => {
          this.handleInitCall()
        }, (90 * 1000))
      }
    }
  },

  updated() {
    this.$set(this.value, 'renderCompleted', true)
    this.$set(this.occurrence, 'renderCompleted', true)
  },

  mounted() {
    this.editorText = this.value?.message?.resume || this.value?.message?.content || ''

    this.$set(this.value, 'renderCompleted', true)
    this.$set(this.occurrence, 'renderCompleted', true)

    this.showEditor = this.enabledEditor

    this.handleInitCall()
  },

  beforeDestroy() {
    clearTimeout(this.transcriptionWatcher)
  },

  methods: {
    ...mapActions([
      'getCallMedia',
      'getCallStatus',
      'updateCallStatus',
      'getCallGenerateMedia',
      'setInteractionMessageContent'
    ]),

    copyContact(_event) {
      if (this.value?.message?.receiver) {
        navigator.clipboard.writeText(this.value?.message?.receiver)

        this.$message({
          message: 'Copiado para a área de transferência.',
          type: 'info',
          center: true,
          showClose: true
        })
      }
    },

    shareAudio(_event) {
      if (this.mediaLink) {
        navigator.clipboard.writeText(this.mediaLink)

        this.$message({
          message: 'Link copiado para a área de transferência.',
          type: 'info',
          center: true,
          showClose: true
        })
      }
    },

    saveMassageContent() {
      this.setInteractionMessageContent({
        disputeId: Number(this.$route.params.id),
        content: this.editorText,
        communicationMessageId: this.value?.message?.messageId
      }).then(() => {
        this.$set(this.value.message, 'content', this.editorText)
        this.showEditor = false
      })
    },

    async handleInitCall() {
      if (this.value?.message?.parameters?.PHONE_CALL_ID) {
        this.localLoading = true

        this.requestCallInfos().then(voiceCodeResult => {
          this.audioCodeResult = voiceCodeResult

          this.$nextTick().then(() => {
            if (this.$refs.AudioPlayer) {
              this.$refs.AudioPlayer.$forceUpdate()
            }
          })
        }).finally(() => {
          if (this.useCallTrancription) {
            this.handleGetCallInfos(this.closeLoading)
          } else {
            this.closeLoading()
          }
        })
      }

      return Promise.resolve()
    },

    handleGetCallInfos(callback) {
      this.getCallMedia({
        disputeId: this.$route.params.id,
        url: this.mediaLink
      }).then(callInfo => {
        this.audio = callInfo

        switch (callInfo.situacao) {
          case 'SEM_ARQUIVO':
          case 'ERRO':
            this.audioCodeResult = 0
            callback()
            break
          case 'CORRIGIDO':
            this.audioCodeResult = 16
            callback()
            break
          case 'INDISPONIVEL':
            callback()
            break
          case 'RECEBIDO':
          case 'TRANSCRITO':
          default:
            this.transcriptionWatcher = setTimeout(() => {
              this.handleGetCallInfos(callback)
            }, 30 * 1000)
            break
        }
      }).catch(error => {
        this.$jusNotification({ error })
        callback()
      }).finally(this.handleUpdateCallStatus)
    },

    handleRequestTranscription(callback) {
      this.getCallGenerateMedia({
        disputeId: this.$route.params.id,
        url: this.mediaLink
      }).then(() => {
        setTimeout(() => {
          this.handleGetCallInfos(callback)
        }, 5 * 1000)
      }).catch(error => {
        this.$jusNotification({ error })
        callback()
      })
    },

    requestCallInfos() {
      return new Promise((resolve) => {
        if (this.value?.message?.parameters?.VOICE_CODE_RESULT) {
          resolve(this.value?.message?.parameters?.VOICE_CODE_RESULT)
        } else if (this.value?.disputeMessageId) {
          this.handleUpdateCallStatus().then(({ voiceCodeResult }) => resolve(voiceCodeResult))
        } else { resolve('') }
      })
    },

    closeLoading() {
      this.localLoading = false
    },

    handleUpdateCallStatus() {
      return this.updateCallStatus(this.value.disputeMessageId)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~projuris-acordos-theme/src/common/colors.scss';

.phone-container {
  background-color: transparent;
  overflow: hidden;
  margin: 6px;
  padding: 0px;

  display: flex;
  flex-direction: column;
  gap: 8px;

  .phone-container__contact {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 6px;
    font-weight: 600;
    color: $--color-text-primary;
    cursor: copy;

    .phone-container__email-icon {
      width: 16px;
      margin-bottom: -3px;
    }
  }

  .phone-container__audio {
    margin: 8px 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    .audio-player {
      width: 80%;
      padding-left: 16px;
    }

    .phone-container__audio-buttons {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;

      .phone-container__audio-buttons-share {
        margin: 0;
      }
    }

    .phone-container__audio-component {
      &.fallback {
        display: flex;
        flex-direction: column;
        gap: 8px;
        align-items: center;

        .phone-container__audio-component-icon::before {
          font-size: 28px;
          // color: $--color-primary;
        }

        .phone-container__audio-component-label {
          font-weight: 600;
          font-size: 16px;
          margin: 0;
          color: $--color-primary;
        }
      }
    }
  }

  .phone-container__audio_current_call {
    margin: 16px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    .el-icon-microphone {
      font-size: 24px;
    }

    div {
      span {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .phone-container__audio_current_call {
    margin: 16px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;

    .el-icon-microphone {
      font-size: 24px;
    }

    div {
      span {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .phone-container__editor {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .phone-container__editor-label {
      font-weight: 600;

      &.invalid-audio {
        text-align: center;
      }
    }

    .phone-container__editor-preview {
      font-size: 1em;
      padding: 8px;
      border-radius: 8px;
      color: $--color-text-primary;
      background-color: $--color-email-bg;
      max-height: 300px;
      overflow-y: auto;
    }

    .phone-container__editor-switch.right {
      text-align: right;
    }
  }

  .phone-container__bad-status {
    padding: 8px;
    display: flex;
    flex-direction: column;

    .phone-container__bad-status-label {
      font-weight: 600;
    }
  }

  .phone-container__about {
    color: #3C3B3B;

    .phone-container__about__time {
      word-break: keep-all;
    }

    .phone-container__about__icon {
      width: 14px;
    }
  }
}
</style>
