<template>
  <el-dialog
    :visible="visible"
    title="Exportar disputa"
    custom-class="export-ticket-modal"
    append-to-body
    fullscreen
    @update:visible="toggleExportTicketModalVisible"
  >
    <el-progress
      v-if="progress < 100"
      :percentage="progress"
      color="#9461f7"
      type="dashboard"
    />
    <vue-html2pdf
      ref="html2Pdf"
      show-layout
      :paginate-elements-by-height="1400"
      :filename="filename"
      :pdf-quality="2"
      :html-to-pdf-options="htmlOptions"
      :margin="0"
      manual-pagination
      pdf-content-width="100%"
      pdf-format="a4"
      pdf-orientation="portrait"
      @progress="setProgress"
      @hasDownloaded="handleClose"
    >
      <section
        v-if="visible"
        slot="pdf-content"
      >
        <div style="display: flex; flex-direction: column; padding: 0px 16px;">
          <OverviewResume />
          <OmnichannelResume />
        </div>
      </section>
    </vue-html2pdf>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    OmnichannelResume: () => import('./omnichannel/OmnichannelResume'),
    OverviewResume: () => import('./overview/OverviewResume')
  },

  data: () => ({
    progress: 0
  }),

  computed: {
    ...mapGetters({
      visible: 'getExportTicketModalVisible',
      activeTab: 'getActiveTab',
      width: 'getWindowWidth'
    }),

    tabHaveMessages() {
      return ['MESSAGES', 'OCCURRENCES'].includes(this.activeTab)
    },

    tab() {
      switch (this.activeTab) {
        case 'MESSAGES':
          return this.$tc('negotiation.ticket.omnichannel.editor.tab.message', 1)
        case 'NOTES':
          return this.$tc('negotiation.ticket.omnichannel.editor.tab.note', 1)
        case 'OCCURRENCES':
          return this.$tc('negotiation.ticket.omnichannel.editor.tab.occurrence', 1)
      }
      return ''
    },

    filename() {
      return `JUSTTO - Negociação - #${this.$route.params.id} - ${this.tab}`
    },

    htmlOptions() {
      return {
        filename: this.filename,
        jsPDF: { format: 'a4', orientation: 'portrait' }
      }
    }
  },

  watch: {
    visible(isVisible) {
      if (isVisible) {
        this.progress = 0
        if (this.tabHaveMessages) {
          Promise.all([
            this.resetOccurrences()
          ]).then(() => {
            this.setProgress(10)
            this.getAllOccurrences(this.$route.params.id).then(({ content: occurrences }) => {
              Promise.all(
                occurrences.filter(
                  ({ id, interaction }) => id && interaction?.message?.messageId
                ).map(
                  ({ interaction }) => this.getFullMessage(interaction?.message?.messageId)
                )
              )
            }).then(() => this.setProgress(50)).finally(() => this.startPrint())
          })
        } else {
          this.startPrint()
        }
      }
    }
  },

  methods: {
    ...mapActions([
      'toggleExportTicketModalVisible',
      'getAllOccurrences',
      'resetOccurrences',
      'getFullMessage',
      'getOccurrences'
    ]),

    startPrint() {
      this.$nextTick().then(() => {
        setTimeout(this.print, 2500)
      })
    },

    print() {
      if (this.visible) {
        this.$refs.html2Pdf.generatePdf()
      }
    },

    handleClose() {
      if (this.tabHaveMessages) {
        this.resetOccurrences()
        this.getOccurrences(this.$route.params.id).finally(() => this.toggleExportTicketModalVisible(false))
      } else {
        this.toggleExportTicketModalVisible(false)
      }
    },

    setProgress(progress) {
      this.progress = progress
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors';

.export-ticket-modal {
  position: relative;

  .el-dialog__body {
    .el-progress {
      position: absolute;
      z-index: 99999;
      bottom: 0;
      right: 0;
    }

    .vue-html2pdf {
      .layout-container {
        background-color: $--color-white;

        .content-wrapper {
          width: 100% !important;

          section {
            max-width: 80vw;
            margin: 0px auto;
          }
        }
      }
    }
  }
}
</style>
