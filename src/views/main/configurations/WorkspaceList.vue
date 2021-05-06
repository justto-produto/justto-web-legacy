<template>
  <section class="workspace-container">
    <el-table
      :data="workspaces"
      style="width: 100%"
    >
      <el-table-column
        prop="name"
        label="Workspace"
      />
      <el-table-column
        prop="teamName"
        label="Equipe"
      />
      <el-table-column
        prop="portifolios"
        label="Carteiras"
      >
        <template slot-scope="scope">
          <el-tag
            v-for="(portifolio, portifolioIndex) in scope.row.portifolios"
            :key="`portifolioIndex-${portifolioIndex}`"
            style="margin: 4px;"
          >
            {{ portifolio }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="KA.name"
        label="Key Account"
      />
      <el-table-column
        prop="KA.email"
        label="Email"
      />
    </el-table>
  </section>
</template>

<script>
export default {
  computed: {
    workspaces() {
      return [
        {
          id: 1,
          name: 'Equipe Justto 1',
          teamName: 'Equipe Justto 1',
          portifolios: ['indenizatorio', 'cobranca'],
          KA: {
            accountId: '',
            name: 'Lucas',
            email: 'lucas@justto.com.br'
          }
        },
        {
          id: 2,
          name: 'Equipe Justto 2',
          teamName: 'Equipe Justto 2',
          portifolios: ['indenizatorio', 'cobranca', 'indenizatorio', 'cobranca', 'indenizatorio', 'cobranca'],
          KA: {
            accountId: '',
            name: 'Lucas',
            email: 'lucas@justto.com.br'
          }
        }
      ]
    }
  }
}
</script>
