<template>
  <article class="minimized-drafts">
    <div
      v-for="id in draftsIds"
      :key="id"
      class="minimized-draft__item"
    >
      <div class="left-triangle" />

      <el-tag
        closable
        size="mini"
        @close="handleCloseDraft(id)"
        @click="handleRedirectToDraft(id)"
      >
        Minuta {{ `#${id}` }}
      </el-tag>

      <div class="right-triangle" />
    </div>
  </article>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      draftsIds: 'getStoredDraftsIds'
    })
  },

  methods: {
    ...mapActions([
      'openStoredDraft',
      'forgetMinimizedDraft'
    ]),

    handleRedirectToDraft(id) {
      const needRedirect = Number(this.$route.params.id) !== Number(id)

      this.$confirm(`Gerênciar minuta da disputa #${id}?`, 'Gerênciar minuta', {
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        center: true,
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.openStoredDraft(id)

        if (needRedirect) {
          this.$router.push({
            name: this.$route.name,
            params: { id }
          })
        }
      })
    },

    handleCloseDraft(id) {
      this.$confirm(`Esquecer minuta da disputa #${id}?`, 'Esquecer minuta', {
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não',
        center: true,
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        this.forgetMinimizedDraft(id)
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/colors.scss';

.minimized-drafts {
  position: absolute;
  top: 0;
  left: 0;
  margin-top: -20px;
  margin-left: 12px;
  display: flex;
  gap: 4px;

  .minimized-draft__item {
    display: flex;

    .left-triangle {
      width: 6px;
      height: 20px;
      background-color: $--color-light-gray;
      clip-path: polygon(0% 100%, 100% 0%, 100% 100%)
    }

    .el-tag {
      border: none;
      cursor: pointer;
      border-radius: 0;
      color: $--color-black;
      background-color: $--color-light-gray;
    }

    .right-triangle {
      width: 6px;
      height: 20px;
      background-color: $--color-light-gray;
      clip-path: polygon(0% 100%, 0% 0%, 100% 100%)
    }
  }

}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

.minimized-drafts {
  .minimized-draft__item {
    .el-tag {
      .el-tag__close {
        color: $--color-black;

        &:hover {
          background-color: $--color-black;
          color: $--color-white;
        }
      }
    }
  }
}
</style>
