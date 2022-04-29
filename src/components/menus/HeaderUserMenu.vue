<template>
  <section
    id="HeaderUserMenuComponet"
    class="usermenu-container"
  >
    <Dialer />

    <!-- <JusAcademy /> -->

    <Notification
      class="usermenu-container__jus-academy"
    />

    <el-dropdown
      trigger="click"
      placement="bottom-start"
    >
      <span class="el-dropdown-link">
        <jus-avatar-user
          class="md"
          :name="name"
          :size="avatarSize"
        />
        <div class="usermenu-container__name md">
          <div style="text-transform: capitalize;">
            {{ name | resumedName }}
          </div>
          <span
            class="usermenu-container__name__team-name"
            :class="{
              'use-marquee-animation': isLargeTeamName,
              'large-team-name-container': !isJusttoAdmin,
              'small-team-name-container': isJusttoAdmin
            }"
          >
            {{ teamName }}
          </span>
        </div>
        <span class="sm">
          <jus-icon icon="menu-hamburger" />
        </span>
      </span>
      <el-dropdown-menu slot="dropdown">
        <div
          class="usermenu-container__perfil"
          @click="editUser()"
        >
          Meu perfil
        </div>

        <div class="usermenu-container__version">
          Versão {{ appVersion }}
        </div>
        <!-- <a
          v-if="canAccessDialer"
          href="#"
          @click.prevent="openDialer('')"
        >
          <el-dropdown-item>
            Discador
          </el-dropdown-item>
        </a> -->

        <router-link
          v-if="showConfigs"
          to="/configurations"
        >
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
          @click.prevent="changeWorkspace"
        >
          <el-dropdown-item>
            Alterar equipe
          </el-dropdown-item>
        </a>

        <a
          href="#"
          @click.prevent="() => {}"
        >
          <el-dropdown-item>
            <JusAcademy mode="text" />
          </el-dropdown-item>
        </a>

        <a @click="logout()">
          <el-dropdown-item divided>
            Sair
          </el-dropdown-item>
        </a>
      </el-dropdown-menu>
    </el-dropdown>

    <JusChangeWorkspace
      ref="changeWorkspace"
      :visible.sync="changeWorkspaceDialogVisible"
    />
    <JusEditUser ref="editUser" />
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    JusAcademy: () => import('@/components/dialogs/JusAcademy'),
    JusChangeWorkspace: () => import('@/components/dialogs/JusChangeWorkspace'),
    JusEditUser: () => import('@/components/dialogs/JusEditUserDialog'),
    Notification: () => import('@/components/drawer/NotificationIcon'),
    Dialer: () => import('@/views/main/dialer/Dialer')
  },

  data: () => ({
    selectedWorkspace: '',
    changeWorkspaceDialogVisible: false
  }),

  computed: {
    ...mapGetters({
      accountId: 'accountId',
      width: 'getWindowWidth',
      name: 'loggedPersonName',
      loggedPerson: 'loggedPerson',
      teamName: 'workspaceTeamName',
      isJusttoAdmin: 'isJusttoAdmin',
      isAdminProfile: 'isAdminProfile',
      canAccessDialer: 'canAccessDialer',
      workspacesList: 'getUserWorkspaces',
      loggedPersonHasName: 'loggedPersonHasName'
    }),
    appVersion() {
      return process.env.VUE_APP_VERSION
    },
    showConfigs() {
      return this.isJusttoAdmin || this.isAdminProfile
    },
    isLargeTeamName() {
      return this.teamName.length > 20
    },
    avatarSize() {
      return this.width <= 1600 ? 'mini' : 'sm'
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
    this.getFeaturesAndModules()
  },

  methods: {
    ...mapActions([
      'openDialer',
      'myWorkspace',
      'changeMemberName',
      'getFeaturesAndModules'
    ]),

    changeWorkspace() {
      this.changeWorkspaceDialogVisible = true
    },

    editUser() {
      this.$refs.editUser.open()
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
          this.$jusSegment('Nome do usuário alterado no primeiro')
          this.changeMemberName({
            updatePerson: true,
            updateWorkspace: false,
            accountId: this.accountId,
            name: value
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
@import '@/styles/colors.scss';

.usermenu-container {
  background-color: transparent; // REMOVER
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;

  .usermenu-container__ghost-mode {
    margin-right: 8px;
  }

  .usermenu-container__jus-academy {
    margin-right: 10px;
  }

  .el-dropdown-link {
    display: flex;
    align-items: center;
    margin: 8px 0;
    cursor: pointer;

    .sm {
      display: none;
    }

    @media (max-height: 6780) {
      margin: 2px 0;
    }
  }

  &__version {
    margin: 6px 20px 12px 20px;
    color: $--color-text-secondary;
    font-size: 12px;
  }

  &__perfil {
    text-transform: capitalize;
    text-align: center;
    cursor: pointer;
  }

  &__name {
    margin: 0 10px 0 10px;
    overflow-x: hidden;
    div {
      white-space: nowrap;
      font-weight: 600;
    }

    .usermenu-container__name__team-name {
      font-size: 12px;
      color: #666666;
      max-width: 180px;
      display: inline-block;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow-x: hidden;
      vertical-align: top;
    }

    .large-team-name-container {
      max-width: 250px;
    }

    .small-team-name-container {
      max-width: 130px;
    }
  }
}

@media (max-width: 900px) {
  .usermenu-container {
    .el-switch { display: none;}
    .el-dropdown-link {
      .md {
        display: none;
      }
      .sm {
        display: flex;
      }
    }
  }
}
</style>
