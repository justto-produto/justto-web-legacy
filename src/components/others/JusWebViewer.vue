<template>
  <div ref="viewer" />
</template>

<script>
/* eslint-disable */
export default {
  name: 'JusWebViewer',
  props: {
    url: String
  },
  mounted: function () {
    WebViewer({
      path: process.env.BASE_URL + 'lib'
    }, this.$refs.viewer).then((instance) => {
      instance.disableElements([
        'searchButton',
        'menuButton',
        'toolsButton',
        'eraserToolButton',
        'outlinesPanel',
        'outlinesPanelButton',
        'viewControlsButton'
      ])
      instance.setMaxZoomLevel('150%')
      instance.setMinZoomLevel('50%')
      instance.disableAnnotations()
      instance.disableNotesPanel()
      instance.disableRedaction()
      instance.disableTextSelection()
      instance.loadDocument(this.url, {
        customHeaders: {
          Authorization: this.$store.getters.accountToken,
          Workspace: this.$store.getters.workspaceSubdomain
        }
      })
    })
  }
}
</script>

<style scoped>
div {
  width: 100%;
  height: calc(100vh - 340px);
}
</style>
