<template>
  <section
    v-loading
    class="redirect-container"
  >
    <jusChangeWorkspace ref="workspaceSwitcher" />
  </section>
</template>

<script>
import { getLocalWorkspace } from '@/utils'
import { mapActions } from 'vuex'
import goToWorkspace from '@/utils/mixins/goToWorkspace'

export default {
  components: {
    jusChangeWorkspace: () => import('@/components/dialogs/JusChangeWorkspace.vue')
  },

  mixins: [goToWorkspace],

  beforeMount() {
    localStorage.removeItem('jusredirect')
    this.resetOccurrences()
  },

  mounted() {
    const { wid: workspaceId, did: disputeId } = this.$route.query

    if (!localStorage.getItem(`jusworkspace_${workspaceId}`)) {
      localStorage.setItem('jusredirect', JSON.stringify(this.$route.query))

      // Alterar equipe.

      this.redirectToWorkspace(workspaceId, disputeId)
    } else {
      const jusWorkspace = getLocalWorkspace()

      // TODO: Dry Run SAAS-4441
      if (Number(jusWorkspace.id) === Number(workspaceId) && Number(disputeId)) {
        this.$router.push(`negotiation/${disputeId}`)
      } else {
        this.redirectToWorkspace(workspaceId, disputeId)
      }
    }
  },

  methods: {
    ...mapActions(['myWorkspace', 'resetOccurrences']),

    redirectToWorkspace(workspaceId, disputeId) {
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
          this.goToWorkspace(destinyWokspace, disputeId)
        }
      })
    }
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
