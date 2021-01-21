<template>
  <section
    id="overviewOmnichanelNegotiatorContainer"
    class="overview-container"
  >
    <span
      class="overview-container__button"
      @click="$emit('toggle-show-overview')"
    >
      aqui
    </span>

    <HeaderUserMenu class="overview-container__header" />

    <article class="overview-container__data">
      OVERVIEW AQUI
    </article>
  </section>
</template>

<script>
export default {
  name: 'Overview',
  components: {
    HeaderUserMenu: () => import('@/components/menus/HeaderUserMenu')
  }
}
</script>

<style lang="scss" scoped>
.overview-container {
  background-color: transparent;
  padding: 6px;
  position: relative;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 60px calc(100vh - 66px);

  .overview-container__button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: -10px;
  }

  @media (max-height: 680px) {
    grid-template-rows: 40px calc(100vh - 46px);
  }

  &__header {
    display: flex;
    justify-self: center;
    align-items: center;
  }

  .overview-container__data {
    flex: 1;
  }
}
</style>
