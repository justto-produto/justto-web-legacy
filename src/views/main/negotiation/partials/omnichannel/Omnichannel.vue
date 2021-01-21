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
    Occurrences: () => import('./Occurrences'),
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

  .omnichannel-container__editor {
    border-top: 2px solid $--light-gray;
    height: auto;
  }
}
</style>
