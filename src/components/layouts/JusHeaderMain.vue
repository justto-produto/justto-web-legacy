<template>
  <div>
    <el-header
      v-if="!$route.meta.hideFullHeader"
      class="jus-header-main"
    >
      <div class="jus-header-main__search">
        <el-autocomplete
          v-model="dispute"
          :min="3"
          :trigger-on-focus="false"
          :fetch-suggestions="search"
          :debounce="800"
          popper-class="jus-header-main__autocomplete"
          placeholder="Busque aqui as suas disputas"
        >
          <template slot-scope="{ item }">
            <jus-dispute-resume
              v-if="item.id"
              :dispute="item"
              @click="goToDispute"
            />
            <span
              v-else
              style="background-color: white;display: block;padding: 0 20px;"
            >
              Não foram encontradas disputas para esta busca. Tente buscar pelo número do processo.
            </span>
          </template>
        </el-autocomplete>
      </div>
      <header-user-menu class="jus-header-main__info" />
    </el-header>
  </div>
</template>

<script>
export default {
  name: 'JusHeaderMain',
  components: {
    JusDisputeResume: () => import('@/components/layouts/JusDisputeResume'),
    HeaderUserMenu: () => import('@/components/menus/HeaderUserMenu')
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

  @media (max-height: 680px) {
    height: 40px !important;
  }

  &__version {
    margin: 6px 20px 12px 20px;
    color: #adadad;
    font-size: 12px;
  }
  &__title {
    margin-left: 20px;
    font-weight: 500;
    a {
      margin-right: 20px;
    }
  }
  &__search {
    display: flex;
    width: 100%;
    .el-autocomplete {
      width: 100%;
      input {
        border: 0;
        outline: 0;
        height: 58px;
        font-size: 16px;
        opacity: .75;

        @media (max-height: 680px) {
          height: 40px;
        }
      }
    }
  }
  &__info {
    display: flex;
    align-items: center;
    .el-switch {
      margin-right: 20px;
    }
    .el-dropdown-link {
      display: flex;
      align-items: center;
      margin: 8px 0;
      cursor: pointer;

      @media (max-height: 680px) {
        margin: 2px 0;
      }
    }
  }
  &__name {
    margin: 0 20px 0 10px;
    div {
      white-space: nowrap;
      font-weight: 600;
    }
    span {
      font-size: 12px;
      color: #666666;
      white-space: nowrap;
    }
  }
  &__autocomplete li {
    cursor: default;
    padding: 0;
  }
  &__whatsapp {
    position: relative;
    margin: auto;
    margin-right: 14px;
    img {
      width: 28px;
    }
    .el-icon-warning {
      position: absolute;
      right: -4px;
      bottom: 1px;
    }
  }
  .el-select {
    width: 100%;
    margin: 20px 0;
  }
}
</style>
