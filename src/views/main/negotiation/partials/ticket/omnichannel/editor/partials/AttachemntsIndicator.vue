<template>
  <el-popover
    title="Anexar"
    trigger="click"
    popper-class="attachments-container"
    class="attachments-container"
  >
    <el-checkbox-group
      v-if="attachments.length"
      v-model="selected"
    >
      <el-checkbox
        v-for="attachment in attachments"
        :key="attachment.id"
        :label="attachment.id"
        class="attachments-container__attach-checkbox"
        border
      >
        <span class="attachments-container__indicator">
          <i class="el-icon-document" />
          {{ attachment.name }}
        </span>
      </el-checkbox>
    </el-checkbox-group>
    <span v-else>Não há nenhum anexo nessa disputa</span>
    <span slot="reference">
      <i class="el-icon-paperclip" />
      <b class="attachments-container__attach-counter">{{ selected.length }}x</b>
    </span>
  </el-popover>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      attachments: 'getTicketOverviewAttachments',
      attachmentsSelected: 'getSelectedAttachments'
    }),

    selected: {
      get() {
        return this.attachmentsSelected
      },
      set(attachments) {
        this.setMessageAttachments(attachments)
      }
    }
  },
  mounted() {
    this.getTicketOverviewAttachments(Number(this.$route?.params?.id || 0))
  },
  methods: {
    ...mapActions([
      'setMessageAttachments',
      'getTicketOverviewAttachments'
    ])
  }
}
</script>

<style lang="scss">
.attachments-container {
  cursor: pointer;
  max-width: 500px;
  width: auto;
  max-height: calc(100vh - 32px);
  margin-bottom: 12px;
  overflow-y: auto;
  overflow-x: hidden;

  .el-popover__reference {
    display: flex;
    align-items: center;

    position: absolute;
    top: 20px;
    left: 140px;

    .el-icon-paperclip {
      font-size: 18px;
      align-self: flex-start;
    }

    .attachments-container__attach-counter {
      font-size: 12px;
      align-self: flex-end;
    }
  }

  .el-checkbox-group {
    display: flex;
    flex-direction: column;
  }

  .attachments-container__attach-checkbox {
    align-items: center;
    margin: 0 0 10px 0 !important;
    padding: 8px 12px 8px 10px;
    max-width: 100%;
    height: auto;
    &:last-child { margin-bottom: 0 !important }

    .el-checkbox__label {
      white-space: normal;
      text-align: start;
      word-break: break-word !important;
      max-width: calc(100% - 14px);
    }
  }
}
</style>
