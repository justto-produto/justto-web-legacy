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
      filename="hee hee"
      :pdf-quality="2"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="landscape"
      pdf-content-width="800px"
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
      visible: 'getExportTicketModalVisible'
    })
  },
  watch: {
    visible(isVisible) {
      if (isVisible) {
        this.getAllOccurrences(this.$route.params.id)
      }
    }
  },
  methods: {
    ...mapActions([
      'toggleExportTicketModalVisible',
      'getAllOccurrences'
    ])
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
