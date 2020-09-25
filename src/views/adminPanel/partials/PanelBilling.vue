<template lang="html">
  <div class="panel-billing-view">
    <img src="./icon.png">
    <!-- <el-table :data="filteredAccounts" width="100%">
      <el-table-column type="expand" fixed="left" width="50px">
        <template slot-scope="props">
          <el-table :data="props.row.workspaces" size="small" width="100%">
            <el-table-column prop="name" label="Workspace"/>
            <el-table-column prop="teamName" label="Nome de Exibição"/>
            <el-table-column prop="status" label="Status"/>
            <el-table-column align="right" fixed="right">
              <template slot-scope="props">
                <el-button type="text" icon="el-icon-delete" style="color: #FF4B54"/>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Nome"/>
      <el-table-column prop="status" label="Status"/>
      <el-table-column prop="contract" label="Contrato"/>
      <el-table-column prop="plan" label="Plano"/>
      <el-table-column fixed="right" align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="Buscar"/>
        </template>
        <template slot-scope="props">
          <el-tooltip content="Adicionar usuário">
            <el-button size="mini" type="" plain icon="el-icon-plus" />
          </el-tooltip>
          <el-tooltip content="Editar">
            <el-button size="mini" type="" plain icon="el-icon-edit" />
          </el-tooltip>
          <el-tooltip content="Excluir">
            <el-button size="mini" type="danger" plain icon="el-icon-delete" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table> -->
  </div>
</template>

<script>
export default {
  name: 'PanelBilling',
  data() {
    return {
      search: '',
      accounts: [{
        name: 'Cabanellos',
        status: 'Ativo',
        contract: 'Empresa',
        plan: '8, 12, 1000',
        workspaces: [{ name: 'Cetelem', teamName: 'Cetelem', status: 'Ativo' }, { name: 'Claro', teamName: 'Claro', status: 'Ativo' }, { name: 'Dell', teamName: 'Dell', status: 'Inativo' }]
      }, {
        name: 'Mediato',
        status: 'Inativo',
        contract: 'Escritório',
        plan: '4, 8, 500',
        workspaces: [{ name: 'Via Varejo', teamName: 'Via Varejo', status: 'Ativo' }, { name: 'Whirepool', teamName: 'Whirepool', status: 'Inativo' }]
      }]
    }
  },
  computed: {
    filteredAccounts() {
      return this.accounts.filter(data => {
        return !this.search ||
          data.name.toLowerCase().includes(this.search.toLowerCase()) ||
          data.teamName.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  }
}
</script>

<style lang="scss">
.panel-billing-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
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
