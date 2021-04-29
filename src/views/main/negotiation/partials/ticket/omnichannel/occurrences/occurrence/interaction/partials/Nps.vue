<template>
  <article class="nps-container">
    <div class="nps-container__contact">
      <jus-icon icon="nps" />
      <span>De</span>
      <span>
        {{ person | resumedName }}
      </span>
      <span>
        &lt;{{ interaction.message.sender }}&gt;
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

    <div class="nps-container__comment">
      <span class="nps-container__comment-date">
        Comentário em
        {{ npsCommentDate | moment('DD/MM/YYYY [às] HH:MM') }}
      </span>
      <span class="nps-container__comment-text">
        "<span v-html="npsResume" />"
      </span>
    </div>
    <div class="nps-container__reply">
      <el-input
        type="textarea"
        placeholder="Please input"
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

  computed: {
    interaction() {
      return this.value
    },

    npsStars() {
      return Number(this.interaction?.message?.parameters?.NPS_STARS)
    },

    npsEvaluationText() {
      return this.npsStars <= 2 ? 'detrator' : this.npsStars < 4 ? 'neutro' : 'promotor'
    },

    npsCommentDate() {
      return this.interaction?.updateAt?.dateTime || this.interaction?.createAt?.dateTime
    },

    npsResume() {
      return this.interaction?.message?.resume || ''
    }
  }
}
</script>

<style lang="scss" scoped>
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
        color: white;

        &.promotor {
          background-color: #14CC30;
        }

        &.neutro {
          background-color: #979797;
        }

        &.detrator {
          background-color: #FF4B54;
        }
      }
    }
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

  }
}
</style>
