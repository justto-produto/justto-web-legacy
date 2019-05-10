<template>
  <JusViewMain class="view-management-review">
    <template slot="title">
      <h1 class="ticket-view__title">
        <router-link to="/management">
          <jus-icon icon="back" />
        </router-link>
        {{ slide.title }}
      </h1>
    </template>
    <template slot="main">
      <el-table
        ref="reviewTable"
        :data="cases"
        size="small"
        class="el-table--card">
        <el-table-column type="index" />
        <el-table-column label="Campanha">
          <template slot-scope="scope">
            {{ scope.row.campaignname }}
            <!-- <jus-icon icon="alert" /> -->
          </template>
        </el-table-column>
        <el-table-column label="Indetificação">
          <template slot-scope="scope">{{ scope.row.disputecode }}
            <!-- <jus-icon icon="alert" /> -->
          </template>
        </el-table-column>
        <el-table-column label="Alçada máxima">
          <template slot-scope="scope">{{ scope.row.disputeupperrange | currency }}</template>
        </el-table-column>
        <el-table-column label="Nome">
          <template slot-scope="scope">{{ scope.row.claiments[0].name }}</template>
        </el-table-column>
        <el-table-column label="CPF/CNPJ">
          <template slot-scope="scope">{{ scope.row.claiments[0].document_number }}
            <!-- <jus-icon icon="alert" /> -->
          </template>
        </el-table-column>
        <el-table-column
          align="right">
          <template slot-scope="scope">
            <el-tooltip content="Visualizar caso">
              <router-link :to="{ name: 'case', params: { id: scope.row.disputeid } }">
                <jus-icon icon="open-case" />
              </router-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>
  </JusViewMain>
</template>

<script>
export default {
  name: 'Review',
  data () {
    return {
      cases: []
    }
  },
  computed: {
    slide () {
      return this.$route.params.slide
    }
  },
  beforeCreate () {
    if (!this.$route.params.slide) {
      this.$router.push('/management')
    }
  },
  beforeMount () {
    this.$store.dispatch('showLoading')
    this.cases = []
    let query = { query: { bool: { must: this.slide.must } }, from: 0, size: 3000, order_by: 'favorite DESC' }
    this.$store.dispatch('getDisputes', query).then(response => {
      this.cases = response
    }).catch(error => {
      console.error(error)
      this.$jusNotification({
        title: 'Ops!',
        message: 'Houve uma falha de conexão com o servidor. Tente novamente ou entre em contato com o administrador do sistema.',
        type: 'error'
      })
    }).finally(() => {
      this.$store.dispatch('hideLoading')
    })
  }
}
</script>

<style lang="scss">
.view-management-review {
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #fff;
  }
  // .cell {
  //   img {
  //     margin-left: 4px;
  //     vertical-align: text-top;
  //   }
  // }
  // .jus-main-view__main-card > .el-card__body {
  //   position: relative;
  //   height: 100%;
  //   padding: 20px 0;
  // }
  // .el-table--enable-row-hover .el-table__body tr:hover > td {
  //   background-color: #fff;
  // }
}
</style>
