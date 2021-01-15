<template>
  <section id="negotiation-empty-ticket">
    <jus-icon icon="hand-click" />
    <span>
      Selecione ao lado um caso
    </span>
    <span>
      para iniciar
    </span>
  </section>
</template>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

#negotiation-empty-ticket {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: $--color-primary;
  font-weight: 500;
  font-size: 40px;
}
</style>
