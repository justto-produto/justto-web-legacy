<template>
  <section
    id="negotiation-empty-ticket"
    class="empty-ticket-container"
  >
    <transition
      name="fade"
      :duration="{ leave: 500 }"
      @enter="handleEnterTransition"
    >
      <div
        v-if="!hidden"
        class="empty-ticket-container__menu"
      >
        <HeaderUserMenu />
      </div>
    </transition>

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
  },

  props: {
    hidden: {
      type: Boolean,
      default: false
    }
  },

  methods: {
    handleEnterTransition(el, done) {
      el.style.opacity = 0

      setTimeout(() => {
        el.style.opacity = 1
        done()
      }, 500)
    }
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
    -webkit-transition: opacity 0.5s;
    -moz-transition: opacity 0.5s;
    -o-transition: opacity 0.5s;
    transition: opacity 0.5s;
  }
}
</style>
