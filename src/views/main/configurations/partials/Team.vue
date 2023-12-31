<template>
  <section class="team-container">
    <div class="team-container__header">
      <el-input
        v-model="searchTerm"
        placeholder="Busque por um membro"
        class="team-container__header-input"
        size="small"
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
        size="small"
        @click="handleInviteMember"
      >
        Cadastrar novo membro
      </el-button>
    </div>

    <div
      v-if="isJustto"
      class="team-container__filters"
    >
      <el-switch
        ref="internalAdminSwitch"
        v-model="hideAdmins"
        active-text="Ocultar usuários Projuris"
        active-value="ENABLED"
        inactive-value="DISABLED"
      />
    </div>

    <el-table
      :data="filteredTeam"
      class="team-container__table"
    >
      <el-table-column
        prop="name"
        label="Nome"
      >
        <template #default="scope">
          <TextInlineEditorInner
            v-if="scope.row.personName || activeAddingData === 'name' + scope.row.id"
            :ref="'name' + scope.row.id"
            v-model="scope.row.personName"
            @change="handleEditMemberName($event, scope.row.id)"
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
        <template #default="scope">
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
      >
        <template #default="scope">
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
      >
        <template #default="scope">
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

      <el-table-column
        v-if="isJustto"
        prop="personProperties"
        label="Envio de relatórios"
        center
      >
        <el-table-column
          prop="personProperties.MANAGEMENT"
          label="Gerencial"
        >
          <template #default="scope">
            <PopoverInlineEditor
              v-model="scope.row.personProperties.MANAGEMENT"
              :width="180"
              :options="reportsOptions"
              @change="handleEditReport('MANAGEMENT', $event, scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="personProperties.EXPIRED"
          label="Expiradas"
        >
          <template #default="scope">
            <PopoverInlineEditor
              v-model="scope.row.personProperties.EXPIRED"
              :width="180"
              :options="reportsOptions"
              @change="handleEditReport('EXPIRED', $event, scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="personProperties.NPS"
          label="NPS"
        >
          <template #default="scope">
            <PopoverInlineEditor
              v-model="scope.row.personProperties.NPS"
              :width="180"
              :options="reportsOptions"
              @change="handleEditReport('NPS', $event, scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column
          prop="personProperties.MANAGER"
          label="Gestão"
        >
          <template #default="scope">
            <PopoverInlineEditor
              v-model="scope.row.personProperties.MANAGER"
              :width="180"
              :options="reportsOptions"
              @change="handleEditReport('MANAGER', $event, scope.row)"
            />
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column width="80px">
        <template #default="scope">
          <i
            class="el-icon-delete team-container__table-action"
            @click="handleRemoveMember(scope.row.personId, scope.row.personName)"
          />

          <i
            v-if="['blocked'].includes(scope.row.status) && isJustto"
            class="el-icon-unlock team-container__table-action"
            @click="handleUnlockUser(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-button
      v-if="isJustto"
      type="secondary"
      class="team-container__button"
      @click="createNewTeam"
    >
      <JusIcon
        icon="logo-small"
        class="team-container__button-icon"
      />

      Criar uma nova equipe
    </el-button>

    <TeamDialogs ref="teamDialogs" />

    <RemoveTeamMemberDialog
      ref="removeTeamMemberDialog"
      @createMember="handleInviteMember"
    />
  </section>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { filterByTerm } from '@/utils'
import emailTemplate from './moreWorkspacesEmailTemplate'
import { isJusttoUser } from '@/utils/validations'

export default {
  name: 'Team',

  components: {
    TextInlineEditorInner: () => import('@/components/inputs/TextInlineEditorInner'),
    PopoverInlineEditor: () => import('@/components/inputs/PopoverInlineEditor'),
    TeamDialogs: () => import('./TeamDialogs'),
    RemoveTeamMemberDialog: () => import('./partials/RemoveTeamMemberDialog')
  },

  data: () => ({
    searchTerm: '',
    activeAddingData: ''
  }),

  computed: {
    ...mapGetters({
      team: 'workspaceTeam',
      isJustto: 'isJusttoAdmin',
      workspace: 'workspace',
      userProperties: 'userProperties',
      hiddeInternalAdmins: 'getHiddeInternalAdmins'
    }),

    hideAdmins: {
      get() { return this.userProperties.HIDDE_INTERNAL_ADMINS },
      set(HIDDE_INTERNAL_ADMINS) {
        this.setAccountProperty({ HIDDE_INTERNAL_ADMINS })
          .catch(error => this.$jusNotification({ error }))
          .finally(() => {
            this.$refs.internalAdminSwitch.$forceUpdate()
          })
      }
    },

    reportsOptions() {
      return [
        {
          value: '',
          label: this.$tc('reports.INACTIVE'),
          disabled: true
        },
        {
          value: 'UNKNOWN',
          label: this.$tc('reports.UNKNOWN')
        },
        {
          value: 'DAILY',
          label: this.$tc('reports.DAILY')
        },
        {
          value: 'WEEKLY',
          label: this.$tc('reports.WEEKLY')
        },
        {
          value: 'FORTNIGHT',
          label: this.$tc('reports.FORTNIGHT')
        },
        {
          value: 'MONTHLY',
          label: this.$tc('reports.MONTHLY')
        }
      ]
    },

    filteredTeam() {
      return filterByTerm(this.searchTerm, this.team, 'name', 'email').filter(({ email }) => {
        return this.hiddeInternalAdmins ? !isJusttoUser(email || '') : true
      })
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
      'setPersonProperties',
      'getWorkspaceTeam',
      'removeWorkspaceMember',
      'changeMemberName',
      'editWorkspaceMember',
      'updatePersonProfile',
      'unlockAccount',
      'sendCustomEmail',
      'getCustomerWorkspaceCount',
      'setAccountProperty'
    ]),

    handleUnlockUser(user) {
      this.$confirm(`Desbloquear conta de ${user.name}?`, 'Conta bloqueada', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }).then(() => {
        this.unlockAccount(user.id).then(this.getWorkspaceTeam).catch(error => {
          this.$jusNotification({ error })
        })
      })
    },

    handleInviteMember() {
      this.$refs.teamDialogs.openNewMemberDialog()
    },

    handleEditMemberName(name, accountId) {
      this.changeMemberName({ name, accountId, updateWorkspace: true })
    },

    handleEditReport(report, value, { personProperties, personId }) {
      const properties = { ...personProperties }
      properties[report] = value

      this.setPersonProperties({ properties, personId })
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
    },

    handleRemoveMember(id, name) {
      this.$refs.removeTeamMemberDialog.show({ id, name })
    },

    validateWorkspacesQuantity() {
      return new Promise((resolve) => {
        this.getCustomerWorkspaceCount(this.workspace?.id).then(({ count }) => {
          if (count > 0 && count % 3 === 0) {
            this.$alert('<b>Limite de workspace por cliente foi excedido</b><br><br>Por favor, analisar o contrato firmado com o cliente, para avaliar um possível ajuste no valor da mensalidade.', {
              customClass: 'workspace-limit-alert',
              dangerouslyUseHTMLString: true,
              confirmButtonText: 'OK',
              showClose: false,
              center: true
            })

            const workspaceName = this.workspace?.teamName
            const workspaceSubDomain = this.workspace?.subDomain
            const keyAccountName = this.workspace?.associatedKeyAccount?.name || 'Não definido'

            this.sendCustomEmail({
              subject: 'Limite de Workspace excedido',
              address: 'financeiro@justto.com.br',
              content: emailTemplate({ workspaceName, workspaceSubDomain, keyAccountName })
            })

            this.sendCustomEmail({
              subject: 'Limite de Workspace excedido',
              address: 'deivid@justto.com.br',
              content: emailTemplate({ workspaceName, workspaceSubDomain, keyAccountName })
            })
          }
        }).finally(resolve)
      })
    },

    createNewTeam() {
      this.validateWorkspacesQuantity().then(() =>
        this.$confirm('Você será redirecionado para a criação de nova Equipe, deseja continuar?', 'Redirecionamento', {
          confirmButtonText: 'Criar nova Equipe',
          cancelButtonText: 'Cancelar',
          type: 'warning'
        }).then(() => {
          this.$store.commit('redirectNewWorkspaceTrue')
          this.$router.push('onboarding')
        })
      )
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

  .team-container__filters {
    display: flex;
    justify-content: flex-end;
    margin: 16px 8px -16px;
    z-index: 1;
  }
}

.custom-header__reports {
  display: flex;
  justify-content: space-between;
}
</style>

<style lang="scss">
@import '~projuris-acordos-theme/src/common/colors.scss';

.team-container {
  display: flex;
  flex-direction: column;
  height: 100%;

  .team-container__table {
    max-width: 93vw;
    margin-top: 3px;
    flex: 1;
    display: flex;
    flex-direction: column;
    border: none;

    &::before { display: none; }
    &::after { display: none; }

    .el-table__header-wrapper {
      font-size: 16px;
      border: none;

      tr th {
        color: $--color-text-primary;
        font-weight: 500;
      }

      thead tr th {
        background-color: #fff;
        border: none;

        /* Alinha os textos do header ao topo. */
        height: 100%;
        vertical-align: top;
      }
    }

    .el-table__body-wrapper {
      border-top: solid thin #ebeef5;
      flex: 1;
      overflow: auto;

      .el-table__body tbody tr td {
        border-right: none;
      }

      &.is-scrolling-none {
        overflow-x: hidden;
      }
    }

    .el-table__row {
      .team-container__table-status {
        &--warning { color: $--color-warning; }
        &--danger { color: $--color-danger; }
        .pointer { cursor: pointer; }
      }

      .team-container__table-action {
        opacity: 0;
        transition: .2s ease-in-out;
        display: inline-block;
        font-size: 16px;
        margin: 0 4px;

        &.el-icon-delete:hover {
          color: $--color-danger;
          cursor: pointer;
        }

        &.el-icon-unlock {
          color: $--color-primary;
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

.workspace-limit-alert {
  .el-message-box__header {
    display: none;
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
