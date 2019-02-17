<template>
  <JusViewMain class="view-management-review">
    <template slot="title">
      <h1 class="ticket-view__title">
        <router-link to="/management">
          <jus-icon icon="back" />
        </router-link>
        Casos para revisar
      </h1>
    </template>
    <template slot="main">
      <el-table
        ref="reviewTable"
        :data="cases"
        size="small"
        class="el-table--card"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" />
        <el-table-column label="Campanha">
          <template slot-scope="scope">
            {{ scope.row._source.campaignname }}
            <jus-icon icon="alert" />
          </template>
        </el-table-column>
        <el-table-column label="Indetificação">
          <template slot-scope="scope">R$ {{ scope.row._source.disputeobjectboundary }}
          <jus-icon icon="alert" /></template>
        </el-table-column>
        <el-table-column label="Alçada máxima">
          <template slot-scope="scope">R$ {{ scope.row._source.disputeobjectboundary }}</template>
        </el-table-column>
        <el-table-column label="CPF/CNPJ/OAB">
          <template slot-scope="scope">R$ {{ scope.row._source.disputeobjectboundary }}</template>
        </el-table-column>
        <el-table-column label="Nome">
          <template slot-scope="scope">R$ {{ scope.row._source.disputeobjectboundary }}
          <jus-icon icon="alert" /></template>
        </el-table-column>
      </el-table>
    </template>
  </JusViewMain>
</template>

<script>
export default {
  name: 'Management',
  data () {
    return {
      cases: [],
      multipleSelection: []
    }
  },
  computed: {
    multiActive () {
      return this.multipleSelection.length > 1
    }
  },
  beforeMount () {
    this.$store.dispatch('showLoading')
    this.cases = []
    this.$store.dispatch('getDisputes').then(response => {
      this.$store.dispatch('hideLoading')
      this.cases = response.hits.hits
    })
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style lang="scss">
.view-management-review {
  .cell {
    img {
      margin-left: 4px;
      vertical-align: text-top;
    }
  }
  .jus-main-view__main-card > .el-card__body {
    position: relative;
    height: 100%;
    padding: 20px 0;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #fff;
  }
}
</style>
