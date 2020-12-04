<template>
  <el-card
    class="attachment__card red"
    :class="`${occurrence.properties.FILE_TYPE || ''}`"
  >
    <div
      v-if="occurrence.properties"
      class="attachment__container"
    >
      <jus-icon
        class="attachment__icon"
        :icon="`attachment-${occurrence.properties.FILE_TYPE.toLowerCase()}`"
      />
      <span
        class="attachment__file"
        @click="downloadAttachment(occurrence.properties.FILE_URL)">
        <span class="attachment__file-name">
          {{ occurrence.properties.FILE_NAME }}
        </span>
        <span class="attachment__file-sender-name">
          {{ occurrence.properties.SENDER_NAME }}
        </span>
      </span>
      <span
        class="attachment__file-download"
        @click="downloadAttachment(occurrence.properties.FILE_URL)">
        <i class="el-icon-download" />
      </span>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },
  computed: {
    occurrence() {
      return this.value
    }
  },
  methods: {
    downloadAttachment(url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.attachment__card {
  .attachment__container {
    display: flex;
    flex-direction: row;
    gap: 8px;

    .attachment__icon {
      height: 40px;
    }

    .attachment__file {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-self: flex-end;

      .attachment__file-name {
        font-weight: 500;
        font-size: 16px;
      }

      .attachment__file-sender-name {
        text-transform: capitalize;
        font-size: 12px;
      }
    }

    .attachment__file-download {
      cursor: pointer;
      // font-weight: 500;
      // color: $--color-primary;
      // text-decoration: underline;
      align-self: center;
    }
  }

  &.PDF {
    background-color: mix(white, #ff2e2e, 75%);
  }
  &.IMAGE {
    background-color: mix(white, #2e5eff, 75%);
  }
  &.ZIP {
    background-color: mix(white, #2e5eff, 75%);
  }
  &.DOC {
    background-color: mix(white, #ff2e2e, 75%);
  }
  &.XLS {
    background-color: mix(white, #026e17, 75%);
  }
  &.OTHER {
    background-color: mix(white, #8652ff, 75%);
  }
}
</style>
