<template>
  <el-dialog
    :close-on-click-modal="false"
    :visible.sync="isVisible"
    custom-class="change-workspace-dialog"
    append-to-body
    title="Alterar Equipe"
    width="40%"
  >
    <el-select
      v-model="selectedWorkspace"
      placeholder="Selecione"
      filterable
      data-testid="select-workspace"
    >
      <el-option
        v-for="(workspace, index) in workspaces"
        :key="workspace.id"
        :value="index"
        :label="workspace.workspace.teamName"
        :disabled="workspace.workspace.id == loggedWorkspaceId"
        data-testid="select-workspace"
      />
    </el-select>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="isVisible = false">
        Cancelar
      </el-button>
      <el-button
        :disabled="selectedWorkspace === ''"
        type="primary"
        @click="getMembersAndRedirect"
      >
        Alterar
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    visible: {
      type: Boolean,
      default: () => (false)
    }
  },

  data: () => ({
    selectedWorkspace: ''
  }),

  computed: {
    ...mapGetters({
      loggedWorkspaceId: 'workspaceId',
      workspaces: 'getUserWorkspaces',
      customHome: 'getCustomHome'
    }),

    isVisible: {
      get() {
        return this.visible
      },
      set(is) {
        this.$emit('update:visible', is)
      }
    }
  },

  methods: {
    ...mapActions({
      getMyWorkspaces: 'myWorkspace'
    }),

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
            window.location.replace(href.split('#')[0] + `#${this.customHome || '/negotiation'}`)
          }
          window.location.reload()
        })
    },

    getMembersAndRedirect() {
      const loading = this.$loading({
        lock: true,
        text: 'Alterando Equipe...'
      })

      const selectedWorkspace = this.workspaces[this.selectedWorkspace]

      if (selectedWorkspace.person) {
        this.goToWorkspace(selectedWorkspace)
      } else {
        this.$store.dispatch('ensureWorkspaceAccesss', selectedWorkspace.workspace.id).then((res) => {
          this.$store.commit('setToken', res)

          this.getMyWorkspaces().then(response => {
            const updatedWorkspace = response.find(el => {
              return el.workspace.id === selectedWorkspace.workspace.id
            })

            this.goToWorkspace(updatedWorkspace)
          }).finally(() => { setTimeout(loading.close, 1000) })
        })
      }
    }
  }
}
</script>

<style lang="scss">
.change-workspace-dialog {
  .el-dialog__body {
    display: flex;
    flex-direction: column;
  }
}
</style>
