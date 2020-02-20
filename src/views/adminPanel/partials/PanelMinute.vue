<template lang="html">
  <div class="panel-minute-view">
    <el-table :data="filteredMinutes" width="100%">
      <el-table-column prop="name" label="Nome"/>
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
  name: 'PanelMinute',
  data () {
    return {
      search: '',
      minutes: [{
        name: 'Minuta 1',
        status: 'Ativo'
      }, {
        name: 'Minuta 2',
        status: 'Inativo'
      }]
    }
  },
  computed: {
    filteredMinutes () {
      return this.minutes.filter(data => {
        return !this.search || data.name.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  }
}
</script>

<style lang="scss">
.panel-minute-view {

}
</style>
