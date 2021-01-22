<template>
  <section
    id="negotiation-empty-ticket"
    class="empty-ticket-container"
  >
    <jus-icon
      icon="hand-click"
      class="empty-ticket-container__icon"
    />
    <span class="empty-ticket-container__text">
      Selecione ao lado um caso para iniciar
    </span>
  </section>
</template>

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

  &__text{
    text-align: center;
  }
}
</style>
