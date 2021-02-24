<template>
  <section
    id="negotiation-empty-ticket"
    class="empty-ticket-container"
  >
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
import EmptyTicket from '@/assets/icons/ic-empty-ticket-state.svg'

export default {
  data: () => ({
    src: EmptyTicket
  })
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

  &__text{
    text-align: center;
  }
}
</style>
