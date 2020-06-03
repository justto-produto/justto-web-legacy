<template>
  <section class="dispute-attachments">
    <jus-drag-area class="dispute-attachments__drag-area">
      <ul
        v-if="attachments.length"
        class="dispute-attachments__attachment-list"
      >
        <li
          v-for="attachment in attachments"
          :key="attachment.url"
          class="dispute-attachments__attachment">
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

      <div class="dispute-attachments__action-container">
        <el-button
          type="primary"
          size="medium"
        >
          Adicionar anexos
        </el-button>
      </div>
    </jus-drag-area>
  </section>
</template>

<script>
import { JusDragArea } from '@/components/JusDragArea'

export default {
  name: 'DisputeAttachments',
  components: {
    JusDragArea,
  },
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

<style lang="scss" scoped>
.dispute-attachments {
  height: calc(100% - 54px);
  position: relative;

  .dispute-attachments__drag-area {
    height: 100%;
  }

  .dispute-attachments__attachment-list {
      list-style: none;
      max-height: calc(100% - 70px);
      overflow-y: auto;
      padding: 0;

      .dispute-attachments__attachment {
        padding: 8px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:hover .el-icon-delete {
          display: block;
        }
      }
    }

  .dispute-attachments__action-container {
    align-items: center;
    bottom: 20px;
    left: 0;
    display: flex;
    justify-content: center;
    position: absolute;
    width: 100%;
  }
}
</style>
