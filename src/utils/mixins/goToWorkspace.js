export default {
  methods: {
    goToWorkspace(workspace, specificDispute = null) {
      const loading = this.$loading({
        lock: true,
        text: 'Alterando Equipe...'
      })

      const oldWorkspace = this.$store.getters.workspaceTeamName

      if (workspace.workspace) {
        this.$store.commit('setWorkspace', workspace.workspace)
      }

      if (workspace.profile) {
        this.$store.commit('setProfile', workspace.profile)
      }

      if (workspace.person) {
        this.$store.commit('setLoggedPerson', workspace.person)
      }

      this.$store.dispatch('getWorkspaceMembers')
        .then(() => {
          this.$jusSegment('Troca de time/workspace', {
            description: `Alterado de ${workspace.workspace.name} para ${oldWorkspace}`
          })
        }).catch(error => {
          this.$jusNotification({ error })
        }).finally(() => {
          const { href } = window.location

          this.isVisible = false

          setTimeout(() => {
            loading.close()
          }, 1000)

          if (specificDispute) {
            window.location.replace(href.split('#')[0] + `#/negotiation/${specificDispute}`)
          } else {
            window.location.replace(href.split('#')[0] + `#${this.$store.getters.getCustomHome || '/negotiation'}`)
          }
          window.location.reload()
        })
    }
  }
}
