<template lang="html">
  <div class="panel-workspace-view">
    <el-table
      :key="tableKey"
      v-loading="loading"
      :data="filteredWorkspaces"
      width="100%"
      @expand-change="getUsersByWorkspace"
    >
      <el-table-column
        type="expand"
        fixed="left"
        width="50px"
      >
        <template slot-scope="props">
          <el-table
            :key="usersTableKey"
            :data="users[props.row.id]"
            size="small"
            width="100%"
          >
            <el-table-column
              prop="name"
              label="Nome"
            />
            <el-table-column
              prop="profile"
              label="Perfil"
            >
              <template slot-scope="props2">
                {{ $t('profile.' + props2.row.profile) | capitalize }}
              </template>
            </el-table-column>
            <el-table-column
              align="right"
              fixed="right"
            >
              <template slot-scope="props2">
                <el-tooltip
                  :open-delay="800"
                  content="Remover usuário"
                >
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    style="color: #FF4B54"
                    @click="removeWorkspaceUser(props.row.id, props2.row.id)"
                  />
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="Nome"
      >
        <template slot-scope="props">
          <el-input
            v-show="props.row.editing"
            :ref="'input' + props.row.id"
            v-model="props.row.name"
            @keyup.enter.native="props.row.editing = false, editWorkspaceName(props.row)"
            @blur="props.row.editing = false, editWorkspaceName(props.row)"
          />
          <div
            v-show="!props.row.editing"
            class="label panel-workspace-view__editable-label"
            @click="props.row.editing = true ,focusInput(props.row.id, props.row.name)"
          >
            {{ props.row.name }}
            <jus-icon
              class="edit-icon"
              icon="edit"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="teamName"
        label="Nome de exibição"
      />
      <el-table-column
        prop="status"
        label="Status"
        width="80px"
      >
        <template slot-scope="props">
          {{ $t('workspace.' + props.row.status) | capitalize }}
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="right"
      >
        <template slot-scope="props">
          <el-tooltip
            :open-delay="800"
            :content="props.row.status === 'DISABLED' ? 'Equipe desabilitada' : 'Convidar usuário'"
          >
            <span style="margin-right:10px;">
              <el-button
                :disabled="props.row.status === 'DISABLED'"
                size="mini"
                type=""
                icon="el-icon-plus"
                @click="addUserDialog(props.row)"
              />
            </span>
          </el-tooltip>
          <el-tooltip
            :open-delay="800"
            content="Editar equipe"
          >
            <el-button
              size="mini"
              type=""
              icon="el-icon-edit"
              @click="editWorkspaceDialog(props.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-backtop
      ref="backTop"
      target=".panel-workspace-view"
    />
    <el-dialog
      :visible.sync="addUserDialogVisible"
      title="Convidar usuário"
      width="50%"
      @submit.native.prevent="addUser"
    >
      <el-form
        ref="userForm"
        :model="userForm"
        :rules="userRules"
        label-position="top"
      >
        <el-form-item
          label="E-mail"
          prop="email"
        >
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item
          label="Perfil"
          prop="profile"
        >
          <el-select v-model="userForm.profile">
            <el-option
              v-for="item in ['NEGOTIATOR', 'ADMINISTRATOR']"
              :key="item"
              :label="$t('profile.' + item).toUpperCase()"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          plain
          @click="addUserDialogVisible = false"
        >Cancelar</el-button>
        <el-button
          type="primary"
          @click="addUser"
        >Convidar</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="editWorkspaceDialogVisible"
      title="Editar equipe"
      width="50%"
      @submit.native.prevent="editWorkspace"
    >
      <el-form
        ref="workspaceForm"
        :model="workspaceForm"
        :rules="workspaceRules"
        label-position="top"
      >
        <h3>Alterar nome da equipe</h3>
        <el-alert
          :closable="false"
          type="info"
          show-icon
        >
          <span slot="title">
            Este nome <strong>NÃO</strong> irá aparecer nas mensagens automáticas. Utilize-o para organização interna.
          </span>
        </el-alert>
        <br>
        <el-form-item
          label="Nome da equipe"
          prop="name"
        >
          <el-input v-model="workspaceForm.name" />
        </el-form-item>
        <h3>Alterar nome da empresa/escritório</h3>
        <el-alert
          :closable="false"
          type="info"
          show-icon
        >
          <span slot="title">
            Este nome <strong>IRÁ</strong> aparecer em todas as mensagens automáticas enviadas pela Justto.
          </span>
        </el-alert>
        <br>
        <el-form-item
          label="Nome de exibição"
          prop="teamName"
        >
          <el-input v-model="workspaceForm.teamName" />
        </el-form-item>
        <h3>Configurações gerais da equipe</h3>
        <el-form-item
          label="Status"
          prop="status"
        >
          <el-select v-model="workspaceForm.status">
            <el-option
              v-for="item in ['READY', 'DISABLED']"
              :key="item"
              :label="$t('workspace.' + item).toUpperCase()"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="Como detectar possíveis ofensores em sua carteira?"
          prop="vexatiousType"
        >
          <el-select v-model="workspaceForm.properties.VEXATIOUS_TYPE">
            <el-option
              v-for="type in ['QUANTITY', 'AVERAGE']"
              :key="type"
              :label="$t(`threshold.${type}`)"
              :value="type"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="workspaceForm.properties.VEXATIOUS_TYPE"
          prop="vexatiousThreshold"
        >
          <span slot="label">
            <span v-if="workspaceForm.properties.VEXATIOUS_TYPE === 'QUANTITY'">Quantas disputas uma mesma pessoa precisa ter para ser qualificado como possível ofensor?</span>
            <span v-else>Qual percentual acima da média de disputas uma pessoa precisa ter para ser qualificado como possível ofensor?</span>
          </span>
          <money
            v-model="workspaceForm.properties.VEXATIOUS_THRESHOLD"
            v-bind="vexatiousTypeMask"
            class="el-input__inner"
          />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          plain
          @click="editWorkspaceDialogVisible = false"
        >Cancelar</el-button>
        <el-button
          type="primary"
          @click="editWorkspace"
        >Editar</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { filterByTerm } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'PanelWorkspace',
  props: {
    filterTerm: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      addUserDialogVisible: false,
      editWorkspaceDialogVisible: false,
      workspaceNameToEdit: '',
      workspaces: [],
      tableKey: 0,
      usersTableKey: 0,
      users: {},
      userForm: {
        email: '',
        profile: ''
      },
      userRules: {
        email: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { type: 'email', required: true, message: 'Insira um e-mail válido', trigger: ['submit'] }
        ],
        profile: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      },
      workspaceForm: {
        name: '',
        teamName: '',
        status: '',
        vexatiousType: '',
        vexatiousThreshold: '',
        properties: {
          VEXATIOUS_THRESHOLD: '',
          VEXATIOUS_TYPE: ''
        }
      },
      workspaceRules: {
        name: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      },
      debounce: () => {},
      filterTermDebounced: ''
    }
  },
  computed: {
    ...mapGetters({
      workspace: 'workspace'
    }),
    filteredWorkspaces() {
      return filterByTerm(this.filterTermDebounced, this.workspaces, 'name', 'teamName')
    },
    vexatiousTypeMask() {
      return {
        decimal: '',
        thousands: '',
        prefix: '',
        suffix: this.workspaceForm.properties.VEXATIOUS_TYPE === 'AVERAGE' ? ' %' : '',
        precision: 0,
        masked: false
      }
    }
  },
  watch: {
    filterTerm(current) {
      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.filterTermDebounced = current
      }, 800)
    }
  },
  beforeMount() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      this.$store.dispatch('adminWorkspaces', { method: 'get', params: { size: 99999 } }).then(response => {
        this.workspaces = response.content
        this.tableKey += 1
      }).catch(error => {
        this.$jusNotification({ error })
      }).finally(() => {
        this.loading = false
      })
    },
    getUsersByWorkspace(workspace) {
      let workspaceId
      if (typeof workspace === 'object') {
        workspaceId = workspace.id
      } else {
        workspaceId = workspace
      }
      if (!this.users[workspaceId]) {
        this.$store.dispatch('adminWorkspaceUsers', {
          method: 'get',
          workspaceId: workspaceId
        }).then(response => {
          const usersList = []
          for (const user of response) {
            usersList.push({
              name: user.person.name,
              documentNumber: user.person.documentNumber,
              profile: user.profile,
              id: user.id
            })
          }
          this.users[workspace.id] = usersList
          this.usersTableKey += 1
        }).catch(error => {
          this.$jusNotification({ error })
        })
      }
    },
    addUserDialog(workspace) {
      this.userForm = {
        email: '',
        profile: '',
        workspaceId: workspace.id,
        workspaceSubdomain: workspace.subDomain
      }
      this.addUserDialogVisible = true
    },
    addUser() {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          const loading = this.$loading({ lock: true })
          this.$store.dispatch('adminWorkspaceUsers', {
            method: 'post',
            url: `api/accounts/workspaces/invite-teammates/${this.workspace.subdomain}`,
            data: [{
              email: this.userForm.email,
              profile: this.userForm.profile
            }],
            headers: {
              Workspace: this.userForm.workspaceSubdomain
            }
          }).then(response => {
            this.$jusNotification({
              title: 'Yay!',
              message: 'Convite enviado com sucesso.',
              type: 'success'
            })
            this.userForm.email = ''
            this.userForm.profile = 'NEGOTIATOR'
            delete this.users[this.userForm.workspaceId]
            this.tableKey += 1
            this.usersTableKey += 1
            this.getUsersByWorkspace(this.userForm.workspaceId)
          }).catch(error => {
            this.$jusNotification({ error })
          }).finally(() => {
            loading.close()
            this.addUserDialogVisible = false
          })
        }
      })
    },
    editWorkspaceDialog(workspace) {
      this.editWorkspaceDialogVisible = true
      this.workspaceForm = JSON.parse(JSON.stringify(workspace))
    },
    editWorkspace() {
      this.$refs.workspaceForm.validate(valid => {
        if (valid) {
          const loading = this.$loading({ lock: true })
          this.$store.dispatch('adminWorkspaces', {
            method: 'put',
            data: this.workspaceForm
          }).then(() => {
            this.fetchData()
            this.$jusNotification({
              title: 'Yay!',
              message: 'Equipe editada com sucesso.',
              type: 'success'
            })
          }).catch(error => {
            this.$jusNotification({ error })
          }).finally(() => {
            loading.close()
            this.editWorkspaceDialogVisible = false
          })
        }
      })
    },
    removeWorkspace(workspaceId) {
      this.$confirm('Tem certeza que deseja remover esta equipe?', 'Atenção!', {
        confirmButtonText: 'Remover',
        cancelButtonText: 'Cancelar',
        type: 'warning',
        cancelButtonClass: 'is-plain'
      }).then(() => {
        const loading = this.$loading({ lock: true })
        this.$store.dispatch('adminWorkspaces', { method: 'delete', workspaceId }).then(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Equipe removida com sucesso.',
            type: 'success'
          })
        }).catch(error => {
          this.$jusNotification({ error })
        }).finally(() => {
          loading.close()
        })
      })
    },
    removeWorkspaceUser(workspaceId, userId) {
      this.$confirm('Tem certeza que deseja remover este usuário da equipe?', 'Atenção!', {
        confirmButtonText: 'Remover',
        cancelButtonText: 'Cancelar',
        type: 'warning',
        cancelButtonClass: 'is-plain'
      }).then(() => {
        const loading = this.$loading({ lock: true })
        this.$store.dispatch('adminWorkspaceUsers', {
          method: 'delete',
          userId: userId
        }).then(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Usuário removido com sucesso.',
            type: 'success'
          })
          delete this.users[workspaceId]
          this.tableKey += 1
          this.usersTableKey += 1
          this.getUsersByWorkspace(workspaceId)
        }).catch(error => {
          this.$jusNotification({ error })
        }).finally(() => {
          loading.close()
        })
      })
    },
    editWorkspaceName(workspace) {
      this.tableKey += 1
      if (workspace.name !== this.workspaceNameToEdit) {
        this.$store.dispatch('adminWorkspaces', {
          method: 'put',
          data: workspace
        })
      }
    },
    focusInput(workspaceId, workspaceName) {
      this.tableKey += 1
      this.workspaceNameToEdit = workspaceName
      this.$nextTick(() => this.$refs['input' + workspaceId].$el.children[0].focus())
    }
  }
}
</script>

<style lang="scss">
.panel-workspace-view {
  padding: 0 40px;
  overflow: auto;
  .el-table__expanded-cell {
    padding: 10px 0px 10px 50px;
    .hover-row td {
      background-color: #fff !important;
    }
    th {
      background-color: #f7f7f7;
    }
  }
  .el-form--label-top .el-form-item__label {
    line-height: normal !important;
    margin-bottom: 8px;
  }
  &__editable-label {
    .edit-icon {
      display: none;
      cursor: pointer;
      width: 16px;
    }
    &:hover {
      .edit-icon {
        display: inline;
      }
    }
  }
}
</style>
