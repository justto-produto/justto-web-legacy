<template>
  <section
    id="negotiation-empty-ticket"
    class="empty-ticket-container"
  >
    <div class="empty-ticket-container__menu">
      <HeaderUserMenu />
    </div>

    <jus-icon
      icon="empty-ticket-state"
      class="empty-ticket-container__icon"
    />
    <span class="empty-ticket-container__text">
      Selecione ao lado um caso para iniciar
    </span>
  </section>
</template>

<script>

export default {
  components: {
    HeaderUserMenu: () => import('@/components/menus/HeaderUserMenu')
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.empty-ticket-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: $--color-primary;
  font-weight: 500;
  font-size: 40px;
  gap: 24px;
  height: 100%;

  &__text{
    text-align: center;
  }

  .empty-ticket-container__menu {
    position: absolute;
    top: 0;
    right: 0;

    display: flex;
  }
}
</style>
