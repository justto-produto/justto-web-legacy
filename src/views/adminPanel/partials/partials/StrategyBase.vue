<template>
  <article class="strategy-conrainer">
    <div class="strategy-conrainer__triggers" />
  </article>
</template>

<script>
export default {
  name: 'StrategyBase'
}
</script>

<style lang="scss" scoped>
.strategy-conrainer {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;

  .strategy-conrainer__triggers {
    flex: 2;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .strategy-conrainer__details {
    flex: 1;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    border-left: solid blue thin;
  }
}
</style>
