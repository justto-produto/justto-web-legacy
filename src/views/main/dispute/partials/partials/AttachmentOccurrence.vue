<template>
  <el-card
    v-if="isLengthValid"
    shadow="never"
    class="attachment__card red"
  >
    <div
      v-if="occurrence.properties && available"
      class="attachment__container"
    >
      <jus-icon
        class="attachment__icon"
        :icon="`attachment-${occurrence.properties.FILE_TYPE.toLowerCase()}`"
      />

      <span
        class="attachment__file"
        @click="downloadAttachment(interaction.properties.DOCUMENT_ID)"
      >
        <span class="attachment__file-name">
          {{ occurrence.properties.FILE_NAME }}
        </span>
        <span
          v-if="occurrence.properties.FILE_SIZE"
          class="attachment__file-size"
        >
          {{ occurrence.properties.FILE_SIZE | sizeFormat }}
        </span>
        <span v-else>
          -
        </span>
      </span>

      <span
        class="attachment__file-download"
      >
        <i
          class="el-icon-download"
          @click="downloadAttachment(interaction.properties.DOCUMENT_ID)"
        />

        <SignAttachmentDialog
          :attachment-id="interaction.properties.DOCUMENT_ID"
          :attachment-name="occurrence.properties.FILE_NAME"
        />
      </span>
    </div>

    <div
      v-else
      class="attachment__deleted"
    >
      <i class="el-icon-warning" />
      Anexo removido.
    </div>

    <SignAttachmentDialog
      :attachment-id="interaction.properties.DOCUMENT_ID"
      :attachment-name="occurrence.properties.FILE_NAME"
      show-type="timeline"
    />
  </el-card>
</template>

<script>
export default {
  name: 'AttachmentOccurrence',

  components: {
    SignAttachmentDialog: () => import('@/components/dialogs/SignAttachmentDialog')
  },

  filters: {
    sizeFormat: (size) => {
      const kb = size / 1024
      const mb = kb / 1024

      if (mb >= 1) return `${mb.toFixed(2)} Mb`
      else if (kb >= 1) return `${kb.toFixed(2)} Kb`
      else return `${size} bytes`
    }
  },

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

    available() {
      return !this.interaction.archived
    },

    isLengthValid() {
      return !this.occurrence?.properties?.FILE_SIZE || Number(this.occurrence?.properties?.FILE_SIZE) >= 1024
    }
  },

  methods: {
    downloadAttachment(id) {
      window.open(`https://backend.justto.app/api/office/documents/${id}/sign`, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.attachment__card {
  padding-bottom: 0px;

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
        word-break: break-word;
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
      align-self: center;
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }
  .attachment__deleted {
    color: $--color-primary;
    font-weight: 500;

    .el-icon-warning {
      color: $--color-secondary;
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
