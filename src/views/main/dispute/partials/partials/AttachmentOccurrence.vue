<template>
  <el-card
    class="attachment__card"
  >
    <div
      v-if="occurrence.properties"
      class="attachment__container"
    >
      <span class="attachment__sender-name">
        {{ occurrence.properties.SENDER_NAME.toLowerCase() }}
      </span>
      enviou
      {{ $t(`dispute.occurrence.attachment.type.${occurrence.properties.FILE_TYPE}`) }}
      (<span
        class="attachment__file-name"
        @click="downloadAttachment(occurrence.properties.FILE_URL)">
        {{ occurrence.properties.FILE_NAME }}
      </span>)
      como anexo.
      <span
        class="attachment__file-download"
        @click="downloadAttachment(occurrence.properties.FILE_URL)">
        Baixar
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
  padding-bottom: 8px;

  .attachment__container {
    .attachment__sender-name {
      text-transform: capitalize;
    }

    .attachment__file-name {
      cursor: pointer;
      font-weight: bold;
      color: $--color-primary;

      &:hover {
        text-decoration: underline;
      }
    }

    .attachment__file-download {
      cursor: pointer;
      font-weight: 500;
      color: $--color-primary;
      text-decoration: underline;
    }
  }
}
</style>
