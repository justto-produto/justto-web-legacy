<template>
  <section
    id="overviewOmnichanelNegotiatorContainer"
    class="overview-container"
  >
    <i
      :class="{ 'overview-container__button--active': showOverview }"
      class="overview-container__button el-icon-arrow-left el-icon-arrow-left"
      @click="$emit('toggle-show-overview')"
    />

    <HeaderUserMenu class="overview-container__header" />

    <article class="overview-container__info">
      OVERVIEW AQUI
    </article>
  </section>
</template>

<script>
export default {
  name: 'Overview',
  components: {
    HeaderUserMenu: () => import('@/components/menus/HeaderUserMenu')
  },
  props: {
    showOverview: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.overview-container {
  background-color: $--light-gray;
  position: relative;
  padding: 6px;
  display: flex;
  flex-direction: column;

  .overview-container__button {
    transform: translateY(-50%);
    position: absolute;
    top: 50%;
    left: -18px;
    font-size: 18px;
    transition: .6s;
    &--active { transform: rotate(180deg) translateY(50%); }
  }

  .overview-container__info {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  }
}

@media (max-width: 900px) {
  .overview-container {
    .overview-container__header {
      display: none;
    }
  }
}
</style>
