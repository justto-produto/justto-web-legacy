<template>
  <section
    id="overviewOmnichanelNegotiatorContainer"
    class="overview-container"
  >
    <header-user-menu class="overview-container__header" />
    OVERVIEW VAI SER AQUI
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
  padding: 6px;
  background-color: transparent;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 60px calc(100vh - 60px);

  @media (max-height: 680px) {
    height: 40px;
    grid-template-rows: 40px calc(100vh - 40px);
  }

  &__header {
    display: flex;
    justify-self: center;
    align-items: center;
  }
}
</style>
