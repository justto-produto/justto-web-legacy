<template>
  <section
    id="HeaderUserMenuComponet"
    class="usermenu-container"
  >
    <el-tooltip
      v-if="isJusttoAdmin"
      content="Modo anônimo"
    >
      <el-switch v-model="isGhostMode" />
    </el-tooltip>

    <el-dropdown
      trigger="click"
      placement="bottom-start"
    >
      <span class="el-dropdown-link">
        <jus-avatar-user
          :name="name"
          :size="avatarSize"
        />
        <div class="usermenu-container__name">
          <div style="text-transform: capitalize;">
            {{ name }}
          </div>
          <span>{{ teamName }}</span>
        </div>
        <jus-icon icon="expand-dropdown" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <div class="usermenu-container__version">
          Versão {{ appVersion }}
        </div>
        <router-link to="/configuration">
          <el-dropdown-item>
            Configurações
          </el-dropdown-item>
        </router-link>
        <router-link
          v-if="isJusttoAdmin || isAdminProfile"
          to="/billing"
        >
          <el-dropdown-item>
            Financeiro
          </el-dropdown-item>
        </router-link>
        <a
          v-if="workspacesList.length"
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

    <jus-change-workspace
      ref="changeWorkspace"
      :visible.sync="changeWorkspaceDialogVisible"
    />
  </section>
</template>

<script>
import { IS_SMALL_WINDOW } from '@/constants/variables'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    JusChangeWorkspace: () => import('@/components/dialogs/JusChangeWorkspace')
  },
  data: () => ({
    selectedWorkspace: '',
    changeWorkspaceDialogVisible: false
  }),
  computed: {
    ...mapGetters({
      ghostMode: 'ghostMode',
      name: 'loggedPersonName',
      loggedPerson: 'loggedPerson',
      teamName: 'workspaceTeamName',
      isJusttoAdmin: 'isJusttoAdmin',
      isAdminProfile: 'isAdminProfile',
      workspacesList: 'getUserWorkspaces',
      loggedPersonHasName: 'loggedPersonHasName'
    }),
    appVersion() {
      return process.env.VUE_APP_VERSION
    },
    isGhostMode: {
      get() {
        return this.ghostMode
      },
      set(value) {
        this.setGhostMode(value)
      }
    },
    avatarSize() {
      return IS_SMALL_WINDOW ? 'mini' : 'sm'
    }
  },
  watch: {
    loggedPersonHasName() {
      if (!this.loggedPersonHasName) {
        this.setPersonName()
      }
    }
  },
  mounted() {
    this.myWorkspace()
    this.setPersonName()
  },
  methods: {
    ...mapActions([
      'setGhostMode',
      'myWorkspace'
    ]),

    changeWorkspace() {
      this.changeWorkspaceDialogVisible = true
    },

    setPersonName() {
      if (!this.loggedPersonHasName && this.$route.meta.requiresAuth && this.$route.name !== 'login') {
        const validator = (value) => {
          if (!value || value.length < 3) return 'Ops, o nome precisa ter mais de duas letras'
          else if (!value.match(/^[^!@#$%*(){}[\]/|\\_<>?¢£¬§=+]+$/)) return 'Ops, o nome não pode conter caracteres especiais'
          else return true
        }
        this.$prompt('Por favor, insira seu nome', 'Bem vindo(a)', {
          confirmButtonText: 'Ok',
          inputValidator: validator,
          inputErrorMessage: 'Ops, insira um nome válido',
          showCancelButton: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          showClose: false
        }).then(({ value }) => {
          const loggetPersonId = this.$store.getters.loggedPersonId
          this.$store.dispatch('changePersonName', {
            person: { id: loggetPersonId, name: value },
            isEditingLoggedPerson: true
          }).then(() => {
            this.$jusNotification({
              title: 'Yay!',
              message: 'Nome alterado com sucesso.',
              type: 'success'
            })
          }).catch(error => this.$jusNotification({ error }))
        })
      }
    },

    logout() {
      setTimeout(() => {
        this.$store.dispatch('logout')
      }, 500)
      const loading = this.$loading({
        lock: true
      })
      setTimeout(() => {
        loading.close()
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.usermenu-container {
  background-color: transparent;
  z-index: 1;
  display: flex;
  justify-content: center;
  // align-items: center;

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
  &__version {
    margin: 6px 20px 12px 20px;
    color: #adadad;
    font-size: 12px;
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
}
</style>
