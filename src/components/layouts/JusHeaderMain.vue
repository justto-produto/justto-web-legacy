<template>
  <div>
    <el-header class="jus-header-main">
      <div class="jus-header-main__search">
        <el-autocomplete
          v-model="dispute"
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
      <div class="jus-header-main__info">
        <el-tooltip
          v-if="$store.getters.isJusttoAdmin"
          content="Modo anônimo"
        >
          <el-switch v-model="ghostMode" />
        </el-tooltip>
        <el-dropdown
          trigger="click"
          placement="bottom-start"
        >
          <span class="el-dropdown-link">
            <jus-avatar-user
              :name="name"
              size="sm"
            />
            <div class="jus-header-main__name">
              <div style="text-transform: capitalize;">
                {{ name }}
              </div>
              <span>{{ teamName }}</span>
            </div>
            <jus-icon icon="expand-dropdown" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <div class="jus-header-main__version">
              Versão {{ appVersion }}
            </div>
            <router-link to="/configuration">
              <el-dropdown-item>
                Configurações
              </el-dropdown-item>
            </router-link>
            <a
              v-if="workspaces.length"
              href="#"
              @click.prevent="changeWorkspace"
            >
              <el-dropdown-item>
                Alterar equipe
              </el-dropdown-item>
            </a>
            <a
              href="#"
              @click="logout()"
            >
              <el-dropdown-item divided>
                Sair
              </el-dropdown-item>
            </a>
          </el-dropdown-menu>
        </el-dropdown>
        <el-dialog
          :close-on-click-modal="false"
          :visible.sync="changeWorkspaceDialogVisible"
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
              data-testid="select-workspace"
            />
          </el-select>
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button
              plain
              @click="changeWorkspaceDialogVisible = false"
            >Cancelar</el-button>
            <el-button
              :disabled="selectedWorkspace === ''"
              type="primary"
              @click="goToWorkspace"
            >Alterar</el-button>
          </span>
        </el-dialog>
      </div>
    </el-header>
  </div>
</template>

<script>
export default {
  name: 'JusHeaderMain',
  components: {
    JusDisputeResume: () => import('@/components/layouts/JusDisputeResume'),
  },
  data() {
    return {
      dispute: '',
      workspaces: [],
      selectedWorkspace: '',
      changeWorkspaceDialogVisible: false,
    }
  },
  computed: {
    name() {
      return this.$store.getters.loggedPersonName
    },
    teamName() {
      return this.$store.getters.workspaceTeamName
    },
    appVersion() {
      return process.env.VUE_APP_VERSION
    },
    whatsappStatus() {
      return this.$store.getters.whatsappStatus
    },
    ghostMode: {
      get() {
        return this.$store.getters.ghostMode
      },
      set(value) {
        this.$store.commit('setGhostMode', value)
      },
    },
  },
  beforeMount() {
    this.$store.dispatch('myWorkspace').then(response => {
      this.workspaces = response.filter(w => w.workspace.id !== this.$store.getters.workspaceId)
    })
  },
  methods: {
    logout() {
      setTimeout(() => {
        this.$store.dispatch('logout')
      }, 500)
      const loading = this.$loading({
        lock: true,
      })
      setTimeout(() => {
        loading.close()
      }, 1000)
    },
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
    changeWorkspace() {
      this.$store.dispatch('myWorkspace').then(response => {
        this.workspaces = response.filter(w => w.workspace.id !== this.$store.getters.workspaceId)
      })
      this.selectedWorkspace = ''
      this.changeWorkspaceDialogVisible = true
    },
    goToWorkspace() {
      const loading = this.$loading({
        lock: true,
        text: 'Alterando Equipe...',
      })
      const workspace = this.workspaces[this.selectedWorkspace]
      const oldWorkspace = this.$store.getters.workspaceTeamName
      if (workspace.workspace) this.$store.commit('setWorkspace', workspace.workspace)
      if (workspace.profile) this.$store.commit('setProfile', workspace.profile)
      if (workspace.person) this.$store.commit('setLoggedPerson', workspace.person)
      this.$store.dispatch('getWorkspaceMembers')
        .then(() => {
          // SEGMENT TRACK
          this.$jusSegment('Troca de time/workspace', {
            description: `Alterado de ${workspace.workspace.name} para ${oldWorkspace}`,
          })
          this.$router.go('/management')
          this.changeWorkspaceDialogVisible = true
        }).catch(error => {
          this.$jusNotification({ error })
        }).finally(() => {
          setTimeout(() => {
            loading.close()
          }, 1000)
        })
    },
  },
}
</script>

<style lang="scss">
.jus-header-main {
  background-color: #fff;
  box-shadow: 0 4px 24px 0 rgba(37, 38, 94, 0.1);
  z-index: 1;
  display: flex;
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
