<template lang="html">
  <div class="jus-chart-table">
    <el-table
      :data="disputeStatusSummaryWithWarn"
      :header-row-class-name="headerRowClassName"
      :row-class-name="tableRowClassName"
      height="calc(100% - 22px)"
      size="medium"
      @cell-click="cellClick">
      <el-table-column
        prop="label"
        class-name="status"
        label="Status"/>
      <el-table-column
        :index="0"
        align="center"
        class-name="withoutAlert"
        prop="withoutAlert"
        label="Sem alerta">
        <template slot-scope="scope">
          <el-tooltip :content="buildWithoutAlertTooltip(scope.row)">
            <span>{{ scope.row.withoutAlert }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        :index="1"
        align="center"
        class-name="withAlert"
        prop="withAlert"
        label="Com alerta">
        <template slot-scope="scope">
          <el-tooltip :content="buildWithAlertTooltip(scope.row)">
            <span>{{ scope.row.withAlert }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        :index="2"
        align="center"
        prop="total"
        class-name="column-total"
        label="Total">
        <template slot-scope="scope">
          <el-tooltip :content="buildTotalTooltip(scope.row)">
            <span>{{ scope.row.total }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <span class="jus-chart-table__subtitle">*Clique nos números para poder visualizar as disputas</span>
  </div>
</template>

<script>
export default {
  name: 'JusChartTable',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    disputeStatusSummaryWithWarn () {
      let self = this
      let disputeStatusSummaryWithWarn = []
      let sumWithoutAlert = 0
      let sumWithAlert = 0
      let sumTotal = 0
      this.data.labels.forEach((label, index) => {
        sumWithoutAlert += self.data.datasets[0].data[index]
        sumWithAlert += self.data.datasets[1].data[index]
        sumTotal += self.data.datasets[2].data[index]
        disputeStatusSummaryWithWarn.push({
          label,
          withoutAlert: self.data.datasets[0].data[index],
          withAlert: self.data.datasets[1].data[index],
          total: self.data.datasets[2].data[index],
          statusIndex: index
        })
      })
      disputeStatusSummaryWithWarn.push({
        label: 'TOTAL',
        withoutAlert: sumWithoutAlert,
        withAlert: sumWithAlert,
        total: sumTotal,
        statusIndex: 4
      })
      return disputeStatusSummaryWithWarn
    },
    selectedMemberId () {
      return this.$store.getters.dashboardSelectedMemberId
    },
    members () {
      return this.$store.state.workspaceModule.members
    }
  },
  methods: {
    tooltipName () {
      if (this.selectedMemberId) {
        return this.members.filter(member => member.personId === this.selectedMemberId)[0].person.name
      } else {
        return ''
      }
    },
    buildWithoutAlertTooltip (row) {
      let name = this.tooltipName() ? ' de ' + this.tooltipName() + ' ' : ''
      switch (row.label) {
        case 'PENDENTE':
          return row.withoutAlert + ' disputas' + name + 'estão pendentes, mas NÃO vao expirar nos proximos 3 dias'
        case 'PROPOSTA ACEITA':
          return row.withoutAlert + ' disputas' + name + 'foram concluidas'
        case 'NEGOCIANDO':
          return row.withoutAlert + ' disputas' + name + 'estão em negociação'
        case 'SEM RESPOSTA':
          return row.withoutAlert + ' disputas' + name + 'ainda não possuem resposta'
        case 'TOTAL':
          return 'Clique para ver estas disputas'
        default:
          return 'Clique para ver estas disputas'
      }
    },
    buildWithAlertTooltip (row) {
      let name = this.tooltipName() ? this.tooltipName() + ' tem ' : ''
      switch (row.label) {
        case 'PENDENTE':
          return name + row.withAlert + ' disputas que expiram nos proximos 3 dias e precisam de atenção IMEDIATA'
        case 'PROPOSTA ACEITA':
          return name + row.withAlert + ' disputas precisam gerar o termo de acordo ou responder uma mensagem para a parte'
        case 'NEGOCIANDO':
          return name + row.withAlert + ' disputas em negociação próximas de expirar ou precisam responder mensagens para a parte.'
        case 'SEM RESPOSTA':
          return name + row.withAlert + ' disputas que ainda não possuem resposta da parte e expiram nos proximos 3 dias, ou que ja fazem mais de 7 dias que você iniciou engajamento e precisa reagendar mensagens'
        case 'TOTAL':
          return 'Clique para ver estas disputas'
        default:
          return 'Clique para ver estas disputas'
      }
    },
    buildTotalTooltip (row) {
      let name = this.tooltipName() ? this.tooltipName() + ' tem ' : ''
      switch (row.label) {
        case 'PENDENTE':
          return name + row.total + ' disputas pendentes. Cuidado para não perde o prazo!'
        case 'PROPOSTA ACEITA':
          return name + row.total + ' disputas aceitas. Não se esqueça de gerar os termos e enviar para o autor'
        case 'NEGOCIANDO':
          return name + row.total + ' disputas em negociação'
        case 'SEM RESPOSTA':
          return name + row.total + ' disputas que ainda não possuem respostas. Se já se passaram 1 semana, reinicie o engajamento para aumentar as chances de sucesso'
        case 'TOTAL':
          return 'Clique para ver estas disputas'
        default:
          return 'Clique para ver estas disputas'
      }
    },
    headerRowClassName ({ row, rowIndex }) {
      return 'header'
    },
    tableRowClassName ({ row, rowIndex }) {
      if (row.label === 'TOTAL') return 'line-total'
    },
    cellClick (row, column, cell, event) {
      if (cell.textContent !== '0') {
        let statusIndex = row.statusIndex
        let cellIndex = cell.cellIndex
        let columnIndex = column.index
        let statusFilters
        if (statusIndex === 4) statusFilters = { [Object.keys(this.data.filter[0])[1]]: Object.values(this.data.filter[0])[1] }
        else statusFilters = this.data.filter[statusIndex]
        let datasetFilters = this.data.datasets[columnIndex] ? this.data.datasets[columnIndex].filter[cellIndex] : null
        if (columnIndex !== undefined && (datasetFilters || statusFilters)) {
          const filters = Object.assign(statusFilters || {}, datasetFilters || {})
          this.$store.commit('clearDisputeQuery')
          this.$store.commit('updateDisputeQuery', { key: 'status', value: [] })
          for (let key in filters) {
            if (filters.hasOwnProperty(key)) {
              this.$store.commit('updateDisputeQuery', { key, value: filters[key] })
            }
          }
          if (this.selectedMemberId) {
            this.$store.commit('updateDisputeQuery', { key: 'persons', value: [this.selectedMemberId] })
          }
          this.$store.commit('setDisputeHasFilters', true)
          this.$store.commit('setDisputesTab', '3')
          this.$router.push('/management')
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';
.jus-chart-table {
  height: 100%;
  .el-table {
    padding-right: 10px;
    .header th{
      background: #f6f6f6;
    }
    td.status {
      background: #f6f6f6;
      font-weight: bold;
    }
    td.withoutAlert {
      background: #1abc9c80 !important;
    }
    td.withAlert {
      background: #f1c40f80 !important;
    }
    td.column-total {
      font-weight: bold;
      background: #f6f6f6 !important;
      color: #424242 !important;
    }
    tr.line-total {
      font-weight: bold;
    }
    &::before {
      background: #fff;
    }
    .el-tooltip  {
      display: block;
      width: 100%;
      cursor: pointer;
    }
    .el-table__body {
      height: 100%;
    }
  }
  &__subtitle {
    display: block;
    width: 100%;
    font-style: italic;
    text-align: center;
  }
}
</style>
