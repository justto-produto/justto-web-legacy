<template>
  <div ref='viewer' />
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
      path: process.env.BASE_URL + 'lib',
      initialDoc: this.url
    }, this.$refs.viewer).then((instance) => {
      // call apis here
    })
  }
}
</script>

<style scoped>
div {
  width: 100%;
  height: 100vh;
}
</style>
