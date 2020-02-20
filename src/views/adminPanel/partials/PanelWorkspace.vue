<template lang="html">
  <div class="panel-workspace-view">
    <el-table :data="filteredWorkspaces" width="100%">
      <el-table-column type="expand" fixed="left" width="50px">
        <template slot-scope="props">
          <el-table :data="props.row.users" size="small" width="100%">
            <el-table-column prop="name" label="Nome"/>
            <el-table-column prop="email" label="E-mail"/>
            <el-table-column prop="email" label="E-mail"/>
            <el-table-column prop="email" label="E-mail"/>
            <el-table-column align="right" fixed="right">
              <template slot-scope="props">
                <el-button type="text" icon="el-icon-delete" style="color: #FF4B54"/>
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
          <el-tooltip content="Adicionar usuário">
            <el-button size="mini" type="success" icon="el-icon-plus" />
          </el-tooltip>
          <el-tooltip content="Editar">
            <el-button size="mini" type="primary" icon="el-icon-edit" />
          </el-tooltip>
          <el-tooltip content="Excluir">
            <el-button size="mini" type="danger" icon="el-icon-delete" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'PanelWorkspace',
  data () {
    return {
      search: '',
      workspaces: [{
        name: 'Workspace 1',
        teamName: 'Time 1',
        status: 'Ativo',
        users: [{ name: 'Conta 1', email: 'a@a.com' }, { name: 'Conta 2', email: 'a@a.com' }]
      }, {
        name: 'Workspace 2',
        teamName: 'Time 2',
        status: 'Inativo',
        users: [{ name: 'Conta 4', email: 'a@a.com' }, { name: 'Conta 5', email: 'a@a.com' }]
      }]
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
