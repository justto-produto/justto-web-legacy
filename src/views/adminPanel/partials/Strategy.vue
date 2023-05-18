<template>
  <section class="strategy-container">
    <StrategiesList class="strategy-container__list" />

    <article class="strategy-container__view">
      <transition name="fade">
        <router-view />
      </transition>
    </article>
  </section>
</template>

<script>
export default {
  components: {
    StrategiesList: () => import('@/views/adminPanel/partials/partials/StrategiesList')
  }
}
</script>

<style lang="scss" scoped>
  .strategy-container {
    display: flex;
    gap: 8px;
    position: relative;
    overflow: hidden;
    height: 100%;
    width: 100%;
    flex: 1;
    flex-direction: row;
  }

  .strategy-container__list {
    flex: 1;
    border-right: solid lightgray thin;
    overflow-x: hidden;
  }

  .strategy-container__view {
    flex: 2.5;
  }
</style>
