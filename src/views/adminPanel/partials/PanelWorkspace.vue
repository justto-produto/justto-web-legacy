<template lang="html">
  <div class="panel-workspace-view">
    <el-table v-loading="loading" :data="filteredWorkspaces" width="100%">
      <el-table-column type="expand" fixed="left" width="50px">
        <template slot-scope="props">
          <el-table :data="props.row.users" size="small" width="100%">
            <el-table-column prop="name" label="Nome"/>
            <el-table-column prop="email" label="E-mail"/>
            <el-table-column prop="email" label="E-mail"/>
            <el-table-column prop="email" label="E-mail"/>
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
      <el-table-column prop="status" label="Status"/>
      <el-table-column fixed="right" align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="Buscar"/>
        </template>
        <template slot-scope="props">
          <el-tooltip :open-delay="800" content="Adicionar usuário">
            <el-button size="mini" type="" icon="el-icon-plus" @click="addUserDialog(props.row.id)"/>
          </el-tooltip>
          <el-tooltip :open-delay="800" content="Editar equipe">
            <el-button size="mini" type="" icon="el-icon-edit" @click="editWorkspaceDialog(props.row.id)"/>
          </el-tooltip>
          <el-tooltip :open-delay="800" content="Remover equipe">
            <el-button size="mini" type="danger" plain icon="el-icon-delete" @click="removeWworkspace(props.row.id)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :visible.sync="addUserDialogVisible"
      title="Adicionar usuário"
      width="50%"
      @submit.native.prevent="addUser">
      <el-form ref="userForm" :model="userForm" :rules="userRules" label-position="top">
        <el-form-item label="Nome" prop="name">
          <el-input v-model="userForm.name" />
        </el-form-item>
        <el-form-item label="E-mail" prop="email">
          <el-input v-model="userForm.email" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="addUserDialogVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="addUser">Adicionar</el-button>
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
      workspaces: [],
      userForm: {
        name: '',
        email: ''
      },
      userRules: {
        name: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }],
        email: [
          { required: true, message: 'Campo obrigatório', trigger: 'submit' },
          { type: 'email', required: true, message: 'Insira um e-mail válido', trigger: ['submit'] }
        ]
      },
      workspaceForm: {
        name: ''
      },
      workspaceRules: {
        name: [{ required: true, message: 'Campo obrigatório', trigger: 'submit' }]
      }
    }
  },
  computed: {
    filteredWorkspaces () {
      return this.workspaces.filter(data => {
        return !this.search ||
          data.name.toLowerCase().includes(this.search.toLowerCase()) ||
          data.teamName.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  beforeMount () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      this.loading = true
      setTimeout(() => {
        this.workspaces = [{
          id: 1,
          name: 'Workspace 1',
          teamName: 'Time 1',
          status: 'Ativo',
          users: [{ id: 11, name: 'Conta 1', email: 'a@a.com' }, { id: 12, name: 'Conta 2', email: 'a@a.com' }]
        }, {
          id: 2,
          name: 'Workspace 2',
          teamName: 'Time 2',
          status: 'Inativo',
          users: [{ id: 21, name: 'Conta 4', email: 'a@a.com' }, { id: 22, name: 'Conta 5', email: 'a@a.com' }]
        }]
        this.loading = false
      }, 1000)
    },
    addUserDialog (workspaceId) {
      this.addUserDialogVisible = true
    },
    addUser () {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          const loading = this.$loading({ lock: true })
          setTimeout(() => {
            this.$jusNotification({
              title: 'Yay!',
              message: 'Usuário adicionado com sucesso.',
              type: 'success'
            })
            loading.close()
            this.addUserDialogVisible = false
          }, 2000)
        }
      })
    },
    editWorkspaceDialog (workspaceId) {
      this.editWorkspaceDialogVisible = true
    },
    editWorkspace () {
      this.$refs.workspaceForm.validate(valid => {
        if (valid) {
          const loading = this.$loading({ lock: true })
          setTimeout(() => {
            this.$jusNotification({
              title: 'Yay!',
              message: 'Equipe editada com sucesso.',
              type: 'success'
            })
            loading.close()
            this.editWorkspaceDialogVisible = false
          }, 2000)
        }
      })
    },
    removeWworkspace (workspaceId) {
      this.$confirm('Tem certeza que deseja remover esta equipe?', 'Atenção!', {
        confirmButtonText: 'Remover',
        cancelButtonText: 'Cancelar',
        type: 'warning',
        cancelButtonClass: 'is-plain'
      }).then(() => {
        const loading = this.$loading({ lock: true })
        setTimeout(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Equipe removida com sucesso.',
            type: 'success'
          })
          loading.close()
        }, 2000)
      })
    },
    removeWorkspaceUser (workspaceId, userId) {
      this.$confirm('Tem certeza que deseja remover este usuárioda equipe?', 'Atenção!', {
        confirmButtonText: 'Remover',
        cancelButtonText: 'Cancelar',
        type: 'warning',
        cancelButtonClass: 'is-plain'
      }).then(() => {
        const loading = this.$loading({ lock: true })
        setTimeout(() => {
          this.$jusNotification({
            title: 'Yay!',
            message: 'Usuário removido com sucesso.',
            type: 'success'
          })
          loading.close()
        }, 2000)
      })
    }
  }
}
</script>

<style lang="scss">
.panel-workspace-view {
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
