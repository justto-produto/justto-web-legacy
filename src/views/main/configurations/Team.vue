<template>
  <section class="team-container">
    <div class="team-container__header">
      <el-input
        v-model="searchTerm"
        placeholder="Busque por um membro"
        class="team-container__header-input"
      >
        <i
          slot="prefix"
          class="el-input__icon el-icon-search"
        />
      </el-input>
      <el-button
        type="primary"
        icon="el-icon-plus"
        class="team-container__header-button"
        @click="handleInviteMember"
      >
        Cadastrar novo membro
      </el-button>
    </div>
    <el-table
      :data="filteredTeam"
      class="team-container__table"
    >
      <el-table-column
        prop="name"
        label="Nome"
      >
        <template slot-scope="scope">
          <TextInlineEditorInner
            v-if="scope.row.personName || activeAddingData === 'name' + scope.row.id"
            :ref="'name' + scope.row.id"
            v-model="scope.row.personName"
            @change="handleEditMemberName($event, scope.row.personId)"
            @blur="stopEditing"
            @enableEdit="enableEdit"
          />
          <div
            v-else
            class=""
          >
            <a @click="startEditing('name', scope.row.id)">Adicionar</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="email"
        label="Email"
      >
        <template slot-scope="scope">
          <span class="show-right-icon">
            {{ scope.row.email }}
            <i
              class="el-icon-copy-document hidden-icon"
              @click="copyText(scope.row.email)"
            />
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="profile"
        label="Perfil"
        width="300px"
      >
        <template slot-scope="scope">
          <PopoverInlineEditor
            v-model="scope.row.profile"
            :width="180"
            :options="profileOptions"
            @change="handleEditMemberProfile($event, scope.row.personId)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="Status"
        width="180px"
      >
        <template slot-scope="scope">
          <span
            :class="{
              'team-container__table-status--danger': ['blocked', 'inactive'].includes(scope.row.status),
              'team-container__table-status--warning': ['activation.pending', 'password.reset'].includes(scope.row.status)
            }"
          >
            {{ $t(`member-status.${scope.row.status.replace('.', '-')}`) }}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="60px">
        <template slot-scope="scope">
          <i
            class="el-icon-delete team-container__table-action"
            @click="handleRremoveMember(scope.row.memberId, scope.row.name)"
          />
        </template>
      </el-table-column>
    </el-table>
    <el-button
      type="secondary"
      class="team-container__button"
      @click="createNewTeam"
    >
      <JusIcon
        icon="logo-small"
        class="team-container__button-icon"
      />
      Criar uma nova esquipe
    </el-button>

    <TeamDialogs ref="teamDialogs" />
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { filterByTerm } from '@/utils'

export default {
  name: 'Team',
  components: {
    TextInlineEditorInner: () => import('@/components/inputs/TextInlineEditorInner'),
    PopoverInlineEditor: () => import('@/components/inputs/PopoverInlineEditor'),
    TeamDialogs: () => import('./TeamDialogs')
  },
  data: () => ({
    searchTerm: '',
    activeAddingData: ''
  }),
  computed: {
    ...mapGetters({
      team: 'workspaceTeam'
    }),
    filteredTeam() {
      return filterByTerm(this.searchTerm, this.team, 'name', 'email')
    },
    profileOptions() {
      return [
        {
          label: this.$t('profile.ADMINISTRATOR'),
          value: 'ADMINISTRATOR'
        },
        {
          label: this.$t('profile.NEGOTIATOR'),
          value: 'NEGOTIATOR'
        }
      ]
    }
  },
  beforeMount() {
    this.getWorkspaceTeam()
  },
  methods: {
    ...mapActions([
      'getWorkspaceTeam',
      'removeWorkspaceMember',
      'changeMemberName',
      'editWorkspaceMember',
      'updatePersonProfile'
    ]),

    handleInviteMember() {
      this.$refs.teamDialogs.openNewMemberDialog()
    },

    handleEditMemberName(name, personId) {
      this.changeMemberName({ name, personId })
    },

    handleEditMemberProfile(profile, personId) {
      this.updatePersonProfile({ profile, personId })
        .then(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Usuário editado com sucesso.',
            type: 'success'
          })
        })
        .catch(error => {
          this.$jusNotification({ error })
        })
      // const data = {
      //   accountEmail: member.email,
      //   accountId: member.id,
      //   createdAt: null,
      //   id: member.memberId,
      //   personId: member.personId,
      //   profile: role,
      //   updatedAt: null
      // }

      // this.editWorkspaceMember(data)
      //   .then(() => {
      //     this.$jusNotification({
      //       title: 'Yay!',
      //       message: 'Usuário editado com sucesso.',
      //       type: 'success'
      //     })
      //   })
      //   .catch(error => {
      //     this.$jusNotification({ error })
      //   })
    },

    handleRremoveMember(memberId, memberName) {
      const message = `Tem certeza que dexeja excluir <b>${memberName}</b> da sua workspace? Esta ação é irreversível.`
      const options = {
        confirmButtonText: 'Continuar',
        cancelButtonText: 'Cancelar',
        cancelButtonClass: 'is-plain',
        dangerouslyUseHTMLString: true,
        showClose: false
      }

      this.$confirm(message, 'Atenção', options)
        .then(() => {
          this.removeWorkspaceMember(memberId)
        })
    },

    createNewTeam() {
      this.$confirm('Você será redirecionado para a criação de nova Equipe, deseja continuar?', 'Redirecionamento', {
        confirmButtonText: 'Criar nova Equipe',
        cancelButtonText: 'Cancelar',
        cancelButtonClass: 'is-plain',
        type: 'warning'
      }).then(() => {
        this.$store.commit('redirectNewWorkspaceTrue')
        this.$router.push('onboarding')
      })
    },

    startEditing(key, id) {
      this.activeAddingData = key + id
    },

    enableEdit() {
      const { activeAddingData } = this
      if (activeAddingData) this.$refs[activeAddingData].enableEdit()
    },

    stopEditing() {
      this.activeAddingData = ''
    },

    copyText(value) {
      navigator.clipboard.writeText(value)

      this.$message({
        message: 'Texto copiado para a área de transferência.',
        type: 'info',
        center: true,
        showClose: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.team-container {
  .team-container__header {
    display: flex;
    gap: 12px;
    margin-top: 3px;
  }
}
</style>

<style lang="scss">
@import '@/styles/colors.scss';

.team-container {
  display: flex;
  flex-direction: column;
  height: 100%;

  .team-container__header {
    .team-container__header-input {
      .el-input__inner {
        height: 50px;
        line-height: 50px;
      }
    }
    .team-container__header-button {
      height: 50px;
    }
  }

  .team-container__table {
    margin-top: 3px;
    flex: 1;
    display: flex;
    flex-direction: column;
    &:before { display: none; }

    .el-table__header-wrapper {
      font-size: 16px;
      // border-bottom: 1px solid $--color-text-secondary;
      tr th {
        color: $--color-text-regular;
        font-weight: 500;
      }
    }

    .el-table__body-wrapper {
      flex: 1;
      overflow: auto;
    }

    .el-table__row {
      .team-container__table-status {
        &--warning { color: $--color-warning; }
        &--danger { color: $--color-danger; }
      }

      .team-container__table-action {
        opacity: 0;
        transition: .2s ease-in-out;
        display: inline-block;
        font-size: 16px;
        &.el-icon-delete:hover {
          color: $--color-danger;
          cursor: pointer;
        }
      }
      &:hover {
       .team-container__table-action {
          opacity: 1;
        }
      }
    }
  }

  .team-container__button{
    margin: 18px auto 0;
    width: 400px;
    max-width: 100%;
    font-size: 16px;
    & > span {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .team-container__button-icon {
      width: 16px;
      height: 16px;
      margin-right: 12px;
    }
  }
}

@media (max-height: 1400px) {
  .team-container {
    max-width: 1400px;
    margin: auto;
  }
}

@media (max-width: 900px) {
  .team-container {
    .team-container__header {
      margin-top: 0;

      .team-container__header-input {
        .el-input__inner {
          height: 50px;
          line-height: 50px;
        }
      }
      .team-container__header-button {
        height: 50px;
      }
    }
    .team-container__table {
      margin-top: 3px;
    }
  }
}
</style>
