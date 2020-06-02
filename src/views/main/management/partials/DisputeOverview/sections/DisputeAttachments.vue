<template>
  <ul
    v-if="attachments.length"
    class="link-list"
  >
    <li
      v-for="attachment in attachments"
      :key="attachment.url"
      class="link-item">
      <el-link
        :underline="false"
        :href="attachment.url"
        target="_blank"
        class="dispute-overview-view__attachment-link">
        <i class="el-icon-document"/>
        {{ attachment.name }}
      </el-link>
      <i
        class="el-icon-delete"
        @click="deleteAttachment(attachment)"
      />
    </li>
  </ul>
  <div
    v-else
    class="center">
    <br>
    Sem anexos
  </div>
</template>

<script>
export default {
  name: 'DisputeAttachments',
  props: {
    attachments: {
      type: Array,
      required: true,
    },
  },
  methods: {
    deleteAttachment(attachment) {
      this.$emit('deleteAttachment', attachment)
    },
  },
}
</script>

<style>

</style>
