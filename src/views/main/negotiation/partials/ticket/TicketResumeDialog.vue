<template>
  <el-dialog
    :visible="visible"
    title="Exportar disputa"
    custom-class="export-ticket-modal"
    append-to-body
    fullscreen
    @update:visible="toggleExportTicketModalVisible"
  >
    <vue-html2pdf
      ref="html2Pdf"
      show-layout
      :paginate-elements-by-height="1400"
      :filename="filename"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="landscape"
      pdf-content-width="100%"
      @hasDownloaded="handleClose"
    >
      <section
        v-if="visible"
        slot="pdf-content"
      >
        <OverviewResume />
        <Omnichannel hide-editor />
      </section>
    </vue-html2pdf>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    Omnichannel: () => import('./omnichannel/Omnichannel'),
    OverviewResume: () => import('./overview/OverviewResume')
  },

  computed: {
    ...mapGetters({
      visible: 'getExportTicketModalVisible',
      activeTab: 'getActiveTab'
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
    }
  },

  watch: {
    visible(isVisible) {
      if (isVisible) {
        if (this.tabHaveMessages) {
          this.$message('Carregando dados.')
          Promise.all([
            this.resetOccurrences()
          ]).then(() => {
            this.getAllOccurrences(this.$route.params.id).then(({ content: occurrences }) => {
              Promise.all(
                occurrences.filter(
                  ({ id, interaction }) => id && interaction?.message?.messageId
                ).map(
                  ({ interaction }) => this.getFullMessage(interaction?.message?.messageId)
                )
              )
            }).finally(() => this.startPrint())
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
      this.$message('Gerando PDF.')
      this.$nextTick().then(() => {
        setTimeout(this.print, 250)
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
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors';

.export-ticket-modal {
  .el-dialog__body {
    .vue-html2pdf {
      .layout-container {
        background-color: $--color-white;

        .content-wrapper {
          width: 100% !important;
        }
      }
    }
  }
}
</style>
