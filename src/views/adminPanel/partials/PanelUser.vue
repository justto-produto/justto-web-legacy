<template lang="html">
  <div class="panel-user-view">
    <img src="./icon.png">
    <!-- <el-table :data="filteredUsers" width="100%">
      <el-table-column prop="name" label="Nome"/>
      <el-table-column prop="status" label="Status"/>
      <el-table-column fixed="right" align="right">
        <template slot="header" slot-scope="scope">
          <el-input
            v-model="search"
            size="mini"
            placeholder="Buscar"/>
        </template>
        <template v-slot="props">
          <el-tooltip content="Adicionar">
            <el-button size="mini" type="" icon="el-icon-plus" />
          </el-tooltip>
          <el-tooltip content="Editar">
            <el-button size="mini" type="" icon="el-icon-edit" />
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
  name: 'PanelUser',
  data() {
    return {
      search: '',
      users: [{
        name: 'Usuario 1',
        status: 'Ativo'
      }, {
        name: 'Usiiario 2',
        status: 'Inativo'
      }]
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(data => {
        return !this.search || data.name.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  }
}
</script>

<style lang="scss">
.panel-user-view {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
