<template>
  <section class="whatsapp-container">
    <el-skeleton v-if="!occurrence.renderCompleted" />

    <div
      v-if="toPrint"
      class="date-to-print"
    >
      {{ sendDate | moment('[Em] DD/MM [-] HH:mm') }}
    </div>

    <div
      v-if="!hideInfo"
      class="communication-container__email INBOUND"
    >
      <JusIcon
        class="communication-container__email-icon"
        :icon="messageType"
      />
      <span
        v-if="contact"
        class="communication-container__email-prefix"
      >
        {{ prefix }}
      </span>
      <span
        v-if="contact"
        class="communication-container__email-contact"
        @click="copyContact"
      >
        {{ contact }}
      </span>
    </div>

    <div
      v-if="contentType === 'VIDEO'"
      class="whatsapp-container__video"
    >
      <video controls>
        <source
          :src="url"
          :type="type"
        >
      </video>
    </div>

    <div
      v-if="contentType === 'AUDIO'"
      class="whatsapp-container__audio"
    >
      <audio controls>
        <source
          :src="url"
          :type="type"
        >
      </audio>
    </div>

    <div
      v-if="contentType === 'IMAGE'"
      class="whatsapp-container__image"
    >
      <img :src="url">
    </div>

    <div
      v-if="contentType === 'FILE'"
      class="whatsapp-container__file"
    >
      <a
        :href="url"
        target="_blank"
      >
        Arquivo &#10077;{{ fileName }}&#10078; recebido.
        <i class="el-icon-download" />
      </a>
    </div>

    <div
      v-if="!toPrint && !hideInfo"
      class="whatsapp-container__about"
    >
      {{ sendDate | moment('HH:mm') }}
      <span v-if="sendStatus !== 'default' && !directionIn">
        •
      </span>
      <el-tooltip
        :disabled="!sendStatusDate"
      >
        <span slot="content">
          {{ {'readed': 'Lida', 'recived': 'Recebida', 'sent': 'Enviada'}[sendStatus] }}
          {{ sendStatusDate | moment('[ em ] DD/MM/YYYY [ às ] HH:mm') }}
        </span>

        <JusIcon
          v-if="sendStatus !== 'default' && !directionIn"
          class="whatsapp-container__about-icon"
          :icon="`status-${sendStatus}`"
        />
      </el-tooltip>
      <GroupedOccurrences
        :have="haveGroupedOccurrences"
        :occurrences="groupedOccurrences"
      />
    </div>
  </section>
</template>

<script>
import communicationSendStatus from '@/utils/mixins/communicationSendStatus'

export default {
  components: {
    GroupedOccurrences: () => import('./partials/groupedOccurrence')
  },

  mixins: [communicationSendStatus],

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

  computed: {
    contentType() {
      return this.value?.message?.contentType
    },

    prefix() {
      return 'de'
    },

    url() {
      return !this.fileName.length ? `${this.urlContent}.${this.parsedType}` : this.value?.message?.content
    },

    urlContent() {
      return this.fileName.length ? this.value?.message?.content : (this.value?.message?.content || '').split('?fileName=')[0]
    },

    type() {
      return this.value?.message?.parameters.CONTENT_TYPE || '/'
    },

    parsedType() {
      return this.type.split('/')[1].split(';')[0]
    },

    fileName() {
      return (this.value?.message?.content || '?fileName=').split('?fileName=')[1]
    },

    messageType() {
      /**
       *  AUDIO,
       * IMAGE,
       * VIDEO,
       * FILE
       */
      return 'whatsapp'
    },

    contact() {
      return this.value?.message?.sender
    }
  },

  updated() {
    if (!this.occurrence.renderCompleted) {
      this.$set(this.occurrence, 'renderCompleted', true)
    }
  },

  mounted() {
    this.$set(this.value, 'renderCompleted', true)
  },

  methods: {
    copyContact() {
      if (this.contact) {
        navigator.clipboard.writeText(this.contact)
        this.$message({
          message: 'Copiado para a área de transferência.',
          type: 'info',
          center: true,
          showClose: true
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.whatsapp-container {
  background-color: transparent;
  overflow: hidden;
  margin: 6px;
  padding: 0px;

  .communication-container__email {
    display: flex;
    align-items: center;
    gap: 6px;

    color: #9A9797;
    font-weight: 600;

    margin-bottom: 6px;
    width: max-content;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    &.INBOUND {
      color: $--color-text-primary;
    }

    &.OUTBOUND {
      color: $--color-secondary;
    }

    .communication-container__email-contact {
      display: inherit;
      cursor: copy;
    }

    .communication-container__email-icon {
      width: 16px;
    }
  }

  .whatsapp-container__video {
    video {
      max-width: 100%;
    }
  }

  .whatsapp-container__image {
    img {
      max-width: 100%;
    }
  }

  .whatsapp-container__file {
    a {
      color: $--color-text-primary;
    }
  }

  .whatsapp-container__about {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 6px;

    font-size: 12px;
    color: #9A9797;

    .whatsapp-container__about-icon {
      width: 18px;
    }
  }

  &.dispute-whatsapp {
    background-color: #8ae698;
    border: none;
  }
}
</style>