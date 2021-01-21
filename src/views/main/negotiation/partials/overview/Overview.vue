<template>
  <section
    id="overviewOmnichanelNegotiatorContainer"
    class="overview-container"
  >
    <span
      class="overview-container__button"
      @click="$emit('toggle-show-overview')"
    >
      aaa
    </span>
    OVERVIEW VAI SER AQUI
  </section>
</template>

<script>
export default {
  name: 'Overview'
}
</script>

<style lang="scss" scoped>
.overview-container {
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

  .overview-container__button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -10px;
  }
}
</style>
