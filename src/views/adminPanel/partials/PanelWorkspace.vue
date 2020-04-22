<template lang="html">
  <div class="panel-workspace-view">
    <el-table v-loading="loading" :key="tableKey" :data="filteredWorkspaces" width="100%" @expand-change="getUsersByWorkspace">
      <el-table-column type="expand" fixed="left" width="50px">
        <template slot-scope="props">
          <el-table :key="usersTableKey" :data="users[props.row.id]" size="small" width="100%">
            <el-table-column prop="name" label="Nome"/>
            <el-table-column prop="profile" label="Perfil">
              <template slot-scope="props2">
                {{ $t('profile.' + props2.row.profile) | capitalize }}
              </template>
            </el-table-column>
            <el-table-column align="right" fixed="right">
              <template slot-scope="props2">
                <el-tooltip :open-delay="800" content="Remover usuário">
                  <el-button
                    type="text"
                    icon="el-icon-delete"
                    style="color: #FF4B54"
                    @click="removeWorkspaceUser(props.row.id, props2.row.id)"/>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Nome"/>
      <el-table-column prop="teamName" label="Nome de exibição"/>
      <el-table-column prop="status" label="Status" width="80px">
        <template slot-scope="props">
          {{ $t('workspace.' + props.row.status) | capitalize }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="Buscar"
            @input="resetPage"/>
        </template>
        <template slot-scope="props">
          <el-tooltip :open-delay="800" :content="props.row.status === 'DISABLED' ? 'Equipe desabilitada' : 'Convidar usuário'">
            <span style="margin-right:10px;">
              <el-button :disabled="props.row.status === 'DISABLED'" size="mini" type="" icon="el-icon-plus" @click="addUserDialog(props.row)"/>
            </span>
          </el-tooltip>
          <el-tooltip :open-delay="800" content="Editar equipe">
            <el-button size="mini" type="" icon="el-icon-edit" @click="editWorkspaceDialog(props.row)"/>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-backtop ref="backTop" target=".panel-workspace-view" />
    <el-pagination
      v-show="!search"
      :page-size="pageSize"
      :current-page="page"
      :total="workspaces.length"
      layout="prev, pager, next"
      @current-change="handleCurrentChange"/>
    <el-dialog
      :visible.sync="addUserDialogVisible"
      title="Convidar usuário"
      width="50%"
      @submit.native.prevent="addUser">
      <el-form ref="userForm" :model="userForm" :rules="userRules" label-position="top">
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
        <el-form-item label="Perfil" prop="profile">
          <el-select v-model="userForm.profile">
            <el-option
              v-for="item in ['NEGOTIATOR', 'ADMINISTRATOR']"
              :key="item"
              :label="$t('profile.' + item).toUpperCase()"
              :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="addUserDialogVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="addUser">Convidar</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="editWorkspaceDialogVisible"
      title="Editar equipe"
      width="50%"
      @submit.native.prevent="editWorkspace">
      <el-form ref="workspaceForm" :model="workspaceForm" :rules="workspaceRules" label-position="top">
        <el-form-item label="Nome" prop="name">
          <el-input v-model="workspaceForm.name" />
        </el-form-item>
        <el-form-item label="Nome de exibição" prop="teamName">
          <el-input v-model="workspaceForm.teamName" />
        </el-form-item>
        <el-form-item label="Status" prop="status">
          <el-select v-model="workspaceForm.status">
            <el-option
              v-for="item in ['READY', 'DISABLED']"
              :key="item"
              :label="$t('workspace.' + item).toUpperCase()"
              :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="editWorkspaceDialogVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="editWorkspace">Editar</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'PanelWorkspace',
  data () {
    return {
      loading: false,
      addUserDialogVisible: false,
      editWorkspaceDialogVisible: false,
      search: '',
      page: 1,
      pageSize: 20,
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
        status: ''
      },
      workspaceRules: {
        name: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      }
    }
  },
  computed: {
    filteredWorkspaces () {
      if (this.search) {
        return this.workspaces.filter(data => {
          return !this.search ||
          data.name.toLowerCase().includes(this.search.toLowerCase()) ||
          data.teamName.toLowerCase().includes(this.search.toLowerCase())
        })
      } else {
        const start = this.page === 1 ? 0 : ((this.page - 1) * this.pageSize)
        const end = (this.page * this.pageSize)
        return this.workspaces.slice(start, end)
      }
    }
  },
  beforeMount () {
    this.fetchData()
  },
  methods: {
    fetchData () {
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
    getUsersByWorkspace (workspace) {
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
          let usersList = []
          for (let user of response) {
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
    handleCurrentChange (page) {
      this.page = page
      if (this.$refs.backTop && this.$refs.backTop.$el.click) this.$refs.backTop.$el.click()
    },
    resetPage () {
      this.page = 1
    },
    addUserDialog (workspace) {
      this.userForm = {
        email: '',
        profile: '',
        workspaceId: workspace.id,
        workspaceSubdomain: workspace.subDomain }
      this.addUserDialogVisible = true
    },
    addUser () {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          const loading = this.$loading({ lock: true })
          this.$store.dispatch('adminWorkspaceUsers', {
            method: 'post',
            url: `api/accounts/workspaces/invite-teammates/${this.userForm.workspaceSubdomain}`,
            data: [{
              email: this.userForm.email,
              profile: this.userForm.profile
            }],
            headers: {
              'Workspace': this.userForm.workspaceSubdomain
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
    editWorkspaceDialog (workspace) {
      this.editWorkspaceDialogVisible = true
      this.workspaceForm = JSON.parse(JSON.stringify(workspace))
    },
    editWorkspace () {
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
    removeWorkspace (workspaceId) {
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
    removeWorkspaceUser (workspaceId, userId) {
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
}
</style>
