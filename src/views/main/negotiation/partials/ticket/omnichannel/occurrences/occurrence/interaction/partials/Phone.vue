<template>
  <article class="phone-container">
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
      <AudioPlayer
        ref="AudioPlayer"
        class="phone-container__audio-component"
        :audio-list="[mediaLink]"
        theme-color="#9461f7"
        :show-volume-button="false"
        :show-prev-button="false"
        :show-next-button="false"
        :show-playback-rate="false"
        :is-loop="false"
      />

      <el-button
        class="phone-container__audio-share"
        icon="el-icon-share"
        size="mini"
        circle
        @click="shareAudio"
      />
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
      v-if="mediaLink && !badStatus"
      class="phone-container__editor jus-ckeditor__parent"
    >
      <label class="phone-container__editor-label">
        {{ hasActiveCall ? 'Transcreva e anote o que precisar desta ligação em andamento:' : 'Transcreva sua conversa abaixo:' }}
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
        v-else
        v-html="editorText"
      />

      <div
        class="phone-container__editor-switch"
        :class="{'right': enabledEditor}"
      >
        <el-button
          v-if="!enabledEditor"
          type="text"
          icon="el-icon-edit"
          @click="enabledEditor = !enabledEditor"
        >
          Editar transcrição da conversa
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
      v-if="badStatus"
      class="phone-container__bad-status"
    >
      <label class="phone-container__bad-status-label">
        {{ $tc(`call.interaction.status.${badStatus}`) }}:
      </label>

      <em class="phone-container__bad-status-note">
        {{ badNote }}
      </em>
    </div>

    <span
      v-if="!hideInfo"
      class="phone-container__about negotiation-occurrence-about"
    >
      <span class="phone-container__about__time">
        {{ sendDate | moment('HH:mm') }}
      </span>
    </span>
  </article>
</template>

<script>
import ckeditor from '@/utils/mixins/ckeditor'
import { mapActions, mapGetters } from 'vuex'

import AudioPlayer from '@liripeng/vue-audio-player'

export default {
  components: {
    AudioPlayer
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
      showEditor: false
    }
  },

  computed: {
    ...mapGetters({
      currentCall: 'getCurrentCall'
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
  },

  methods: {
    ...mapActions(['setInteractionMessageContent']),

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
        // navigator.share({
        //   title: 'Ligação',
        //   text: `Ligação para ${this.contact}`,
        //   url: this.mediaLink
        // })
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

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
    margin: 16px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    .audio-player {
      width: 80%;
      padding-left: 16px;
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
