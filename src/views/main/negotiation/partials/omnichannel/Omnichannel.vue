<template>
  <section class="omnichannel-container">
    <Occurrences class="omnichannel-container__occurrences" />
    <Editor class="omnichannel-container__editor" />
  </section>
</template>

<script>
export default {
  name: 'Omnichannel',
  components: {
    Occurrences: () => import('./occurrences/Occurrences'),
    Editor: () => import('./editor/Editor')
  }
}
</script>

<style lang="scss" scoped>
.omnichannel-container {
  display: flex;
  flex-direction: column;

  .omnichannel-container__occurrences {
    padding: 6px 0px;
    flex: 1;
    display: block;
  }
}
</style>
