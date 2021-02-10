<template>
  <el-header
    :class=" { 'jus-header-main--hidden': $route.meta.hideFullHeader }"
    class="jus-header-main"
  >
    <i
      class="jus-header-main__back el-icon-arrow-left"
      @click="$router.push('/negotiation')"
    />
    <TicketsHeader class="jus-header-main__search" />
    <img
      class="jus-header-main__logo"
      src="@/assets/logo-small.svg"
    >
    <HeaderUserMenu class="jus-header-main__menu" />
  </el-header>
</template>

<script>
export default {
  name: 'JusHeaderMain',
  components: {
    HeaderUserMenu: () => import('@/components/menus/HeaderUserMenu'),
    TicketsHeader: () => import('@/views/main/negotiation/partials/tickets/TicketsHeader')
  },
  data: () => ({
    dispute: ''
  }),
  methods: {
    search(term, cb) {
      clearTimeout(this.termDebounce)
      this.termDebounce = setTimeout(() => {
        this.$store.dispatch('searchDisputes', { key: 'term', value: term }).then(response => {
          // SEGMENT TRACK
          this.$jusSegment('Busca global de disputas', { description: `Termo utilizado: ${term}` })
          if (response.length) {
            cb(response)
          } else {
            cb([{}])
          }
        })
      }, 800)
    },

    goToDispute({ disputeId }) {
      this.$router.push(`/management/dispute/${disputeId}`)
    }
  }
}
</script>

<style lang="scss">
.jus-header-main {
  background-color: #fff;
  box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.1);
  z-index: 1;
  display: flex;

  &--hidden {
    @media (min-width: 900px) {
      display: none;
    }
  }

  @media (max-height: 680px) {
    height: 40px !important;
    padding-left: 0px;
  }

  .jus-header-main__back,
  .jus-header-main__logo {
    display: none;
  }

  .jus-header-main__search {
    flex: 1;
  }

  .jus-header-main__menu {
    width: auto;
  }
}

@media (max-width: 900px) {
  .jus-header-main {
    justify-content: space-between;
    align-items: center;

    .jus-header-main__back {
      display: inline-block;
      font-size: 24px;
      margin-right: 6px;
      align-self: center;
      cursor: pointer;
    }

    .jus-header-main__search {
      display: none;
    }

    .jus-header-main__logo {
      display: inline-block;
    }
  }
}

// @media (max-height: 900px) {
//   .jus-header-main {
//     height: 40px !important;
//   }
// }
</style>
