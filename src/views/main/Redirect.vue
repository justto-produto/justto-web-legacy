<template>
  <section
    v-loading
    class="redirect-container"
  >
    <!-- <el-skeleton
      :rows="12"
      class="redirect-container__skeleton"
    /> -->

    <jusChangeWorkspace ref="workspaceSwitcher" />
  </section>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  components: {
    jusChangeWorkspace: () => import('@/components/dialogs/JusChangeWorkspace.vue')
  },

  beforeMount() {
    localStorage.removeItem('jusredirect')
  },

  mounted() {
    const { wid: workspaceId, did: disputeId } = this.$route.query

    if (!localStorage.getItem('jusworkspace')) {
      localStorage.setItem('jusredirect', JSON.stringify(this.$route.query))
      this.$router.push('login')
    } else {
      const jusWorkspace = JSON.parse(localStorage.getItem('jusworkspace'))

      // TODO: Dry Run SAAS-4441
      if (Number(jusWorkspace.id) === Number(workspaceId) && Number(disputeId)) {
        this.$router.push(`negotiation/${disputeId}`)
      } else {
        this.myWorkspace().then(res => {
          const destinyWokspace = res.find(({ workspace: { id } }) => Number(id) === Number(workspaceId))

          if (!destinyWokspace || !Number(disputeId)) {
            this.$confirm('Você não possui privilégios para visualizar esta página!', 'Warning', {
              closeOnPressEscape: false,
              closeOnClickModal: false,
              confirmButtonText: 'OK',
              showCancelButton: false,
              showClose: false,
              type: 'warning',
              center: true
            }).then(() => {
              this.$router.push({ name: 'dashboard' })
            })
          } else {
            this.$refs.workspaceSwitcher.goToWorkspace(destinyWokspace)
            // SAAS-4441
            // redirect?wid=626&did=252813
          }
        })
      }
    }
  },

  methods: {
    ...mapActions(['myWorkspace'])
  }
}
</script>

<style lang="scss">
.redirect-container {
  width: 100%;
  height: 100%;
  padding: 16vh 8vw;

  .redirect-container__skeleton {
    .el-skeleton {
      text-align: center;
    }
  }
}
</style>
