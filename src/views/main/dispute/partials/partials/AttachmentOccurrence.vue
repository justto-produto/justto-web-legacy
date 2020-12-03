<template>
  <el-card
    style="padding-bottom: 8px;"
  >
    <div>
      <span style="text-transform: capitalize;">
        {{ occurrence.properties.SENDER_NAME.toLowerCase() }}
      </span>
      enviou
      {{ $t(`dispute.occurrence.attachment.type.${occurrence.properties.FILE_TYPE}`) }}
      <span
        style="cursor: pointer; text-decoration: underline;"
        @click="downloadAttachment(occurrence.properties.FILE_URL)">
        ({{ occurrence.properties.FILE_NAME }})
      </span>
      como anexo
      <el-button
        round
        plain
        size="mini"
        type="primary"
        icon="el-icon-download"
        @click="downloadAttachment(occurrence.properties.FILE_URL)"
      />
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

<style>

</style>
