<template>
  <el-tooltip placement="top-start">
    <div slot="content">
      {{ isCustomHome ? 'Redefinir página inicial.' : 'Definir como página inicial.' }}
    </div>
    <div
      v-loading="loading"
      class="menu-item-pin"
      :class="{ 'current-custom-home': isCustomHome }"
    >
      <button
        class="menu-item-pin__button"
        @click="setCustomHome"
      >
        <jus-icon icon="pin" />
      </button>
    </div>
  </el-tooltip>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    loading: false
  }),

  computed: {
    ...mapGetters({ customHome: 'getCustomHome' }),

    isCustomHome() {
      return this.value.index === this.customHome
    }
  },

  methods: {
    ...mapActions(['setAccountProperty']),

    setCustomHome() {
      this.loading = true

      this.setAccountProperty({ CUSTOM_HOME: this.isCustomHome ? null : this.value.index }).then(() => this.$jusNotification({
        title: 'Yay!',
        message: `Página inicial ${this.isCustomHome ? 'redefinida' : 'modificada'} com sucesso`,
        type: 'success',
        dangerouslyUseHTMLString: true
      })).catch(error => this.$jusNotification({ error })).finally(_ => {
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-item-pin {
  &:not(.current-custom-home) {
    .menu-item-pin__button {
      display: none;
    }
  }
}
</style>
