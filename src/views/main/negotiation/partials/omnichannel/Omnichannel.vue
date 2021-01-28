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
    Editor: () => import('./Editor')
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.omnichannel-container {
  background-color: transparent;
  display: flex;
  flex-direction: column;

  .omnichannel-container__occurrences {
    height: auto;
    padding: 6px 0px;
  }

  .omnichannel-container__editor {
    border-top: 2px solid $--light-gray;
    height: auto;
  }
}
</style>
