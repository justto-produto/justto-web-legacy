<template>
  <article class="nps-container">
    <div class="nps-container__contact">
      <jus-icon icon="nps" />
      <span>De</span>
      <span v-if="person">
        {{ person | resumedName }}
      </span>
      <span
        v-if="senderEmail"
        class="nps-container__contact-email"
        @click="copyToClipboard"
      >
        &lt;{{ senderEmail }}&gt;
      </span>
    </div>

    <div class="nps-container__evaluation">
      <span class="nps-container__evaluation-stars">
        <jus-icon
          v-for="index in [1, 2, 3, 4, 5]"
          :key="`star-${index}`"
          icon="nps-star"
          :is-active="index <= npsStars"
        />
      </span>
      <span class="nps-container__evaluation-status">
        <el-tag
          :class="npsEvaluationText"
          effect="dark"
          size="mini"
          v-text="npsEvaluationText"
        />
      </span>
    </div>

    <div class="nps-container__reasons">
      <el-tag
        v-for="reason in npsReasons"
        :key="`reason-${reason}`"
        :class="reason"
        class="nps-container__reasons-item"
        effect="plain"
        size="mini"
      >
        {{ reason.trim() | capitalize }}
      </el-tag>
    </div>

    <div
      v-if="person"
      class="nps-container__person-name"
    >
      {{ person | resumedName }} avaliou seu atendimento com {{ npsStars }} estrela(s)
    </div>

    <div class="nps-container__comment">
      <span class="nps-container__comment-date">
        {{ npsEvaluateDate | moment('[Comentário em] DD/MM/YYYY [às] HH:MM') }}
      </span>

      <span class="nps-container__comment-text">
        "{{ npsResume }}"
      </span>
    </div>

    <div
      v-if="false"
      class="nps-container__reply"
    >
      <div class="nps-container__reply-about">
        <jus-icon
          icon="reply"
          class="nps-container__reply-about-icon"
        />

        <span
          v-if="npsReplyDate"
          class="nps-container__reply-about-date"
        >
          {{ npsReplyDate | moment('[Resposta em] DD/MM/YYYY [às] HH:MM') }}
        </span>
        <span
          v-else
          class="nps-container__reply-about-date"
        >
          Responda esta avaliação.
        </span>
      </div>

      <el-input
        v-model="npsReply"
        type="textarea"
        :rows="3"
        :readonly="npsReplyHasText"
        class="nps-container__reply-input"
        placeholder="Sua resposta aqui."
        resize="none"
        @focus="toggleSendButton(true)"
        @blur="toggleSendButton(false)"
      />

      <el-button
        v-if="showSendBtn && !npsReplyHasText"
        class="nps-container__reply-btn"
        type="primary"
        size="mini"
        circle
        plain
        @click="sendReplyNps()"
      >
        <jus-icon icon="send" />
      </el-button>
      <el-button
        v-else-if="loadingSendBtn"
        class="nps-container__reply-btn"
        icon="el-icon-loading"
        type="primary"
        size="mini"
        circle
        plain
      />
    </div>
  </article>
</template>

<script>
import communicationSendStatus from '@/utils/mixins/communicationSendStatus'

export default {
  mixins: [communicationSendStatus],

  props: {
    value: {
      type: Object,
      required: true
    },
    occurrence: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    npsReplyText: '',
    loadingSendBtn: false,
    showSendBtn: false
  }),

  computed: {
    interaction() {
      return this.value
    },

    npsStars() {
      return Number(this.interaction?.properties?.NPS_STARS || 0)
    },

    npsEvaluationText() {
      return this.npsStars <= 2 ? 'detrator' : this.npsStars < 4 ? 'neutro' : 'promotor'
    },

    npsEvaluateDate() {
      return this.interaction?.updateAt?.dateTime || this.interaction?.createAt?.dateTime
    },

    npsResume() {
      return this.interaction?.properties?.NPS_COMMENT || ''
    },

    senderEmail() {
      return this.interaction?.properties?.PERSON_EMAIL || ''
    },

    npsReasons() {
      return this.interaction?.properties?.NPS_REASONS.split(',') || []
    },

    npsReply: {
      get() {
        return this.interaction?.properties?.NPS_REPLY || this.npsReplyText
      },
      set(text) {
        this.npsReplyText = text
      }
    },

    npsReplyHasText() {
      return Boolean(this.interaction?.properties?.NPS_REPLY)
    },

    npsReplyDate() {
      return this.interaction?.properties?.NPS_REPLY_DATE
    }
  },

  methods: {
    copyToClipboard(_event) {
      navigator.clipboard.writeText(this.senderEmail).then(() => {
        this.$message('Copiado com sucesso.')
      })
    },

    toggleSendButton(visible) {
      setTimeout(() => {
        this.showSendBtn = visible
      }, 250)
    },

    sendReplyNps() {
      this.loadingSendBtn = true

      // TODO: Salvar chamar a mutation que setta do dado no Store.
      // TODO: Salvar a data em que foi enviado também.
      const req = new Promise(resolve => {
        setTimeout(() => {
          this.loadingSendBtn = false
          resolve()
        }, 5000)
      })

      req.then(() => {
        this.$jusNotification({
          type: 'success',
          title: 'Yay!',
          message: 'Resposta enviada.'
        })
      })
    }
  }
}
</script>

<style lang="scss">
.nps-container__reply {
  .nps-container__reply-input {
    border: none;

    .el-textarea__inner {
      border: none;
    }
  }
}
</style>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.nps-container {
  background-color: transparent;
  overflow: hidden;
  margin: 6px;
  padding: 0px;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;

  .nps-container__contact {
    display: flex;
    align-items: center;
    gap: 4px;

    font-weight: 600;

    .nps-container__contact-email {
      cursor: copy;
    }
  }

  .nps-container__evaluation {
    display: flex;
    align-items: center;
    gap: 8px;

    .nps-container__evaluation-stars {
      img {
        width: 16px;
      }
    }

    .nps-container__evaluation-status {
      .el-tag {
        border: none;
        text-transform: capitalize;
        font-weight: 500;
        color: $--color-white;

        &.promotor {
          background-color: $--color-nps-promoter;
        }

        &.neutro {
          background-color: $--color-nps-neutral;
        }

        &.detrator {
          background-color: $--color-nps-detractor;
        }
      }
    }
  }

  .nps-container__reasons {
    display: inline;

    .nps-container__reasons-item {
      margin: 0px 2px 4px;
      font-weight: 500;
      color: $--color-nps-neutral;
      border-color: $--color-nps-neutral;
    }
  }

  .nps-container__person-name {
    font-size: 12px;
  }

  .nps-container__comment {
    display: flex;
    flex-direction: column;

    .nps-container__comment-date {
      font-size: 12px;
    }

    .nps-container__comment-text {
      font-style: italic;
      margin: 2px 0;
    }
  }

  .nps-container__reply {
    padding: 4px;
    background: $--color-white;
    border: solid 1px $--color-light-gray;
    border-radius: 10px;
    width: 100%;
    position: relative;

    .nps-container__reply-about {
      display: flex;
      gap: 8px;

      .nps-container__reply-about-icon {
        width: 16px;
        height: 16px;
        transform: rotate(180deg);
      }

      .nps-container__reply-about-date {
        color: $--color-text-secondary;
        font-size: 12px;
      }
    }

    .nps-container__reply-btn {
      position: absolute;
      bottom: 0;
      right: 0;
      margin: 0 4px 4px 0;

      color: #9461f7;
      background: #f4effe;
      border-color: #d4c0fc;

      span > img {
        width: 12px;
        height: 12px;
      }

      &:hover {
        color: #9461f7;
        background: #f4effe;
        border-color: #d4c0fc;
      }
    }
  }
}
</style>
