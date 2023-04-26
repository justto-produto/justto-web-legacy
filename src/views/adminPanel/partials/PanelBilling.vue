<template lang="html">
  <div class="panel-billing-view">
    <img src="./icon.png">
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
