<template lang="html">
  <div class="jus-chart-table">
    <el-table
      :data="disputeStatusSummaryWithWarn"
      :header-row-class-name="headerRowClassName"
      :cell-class-name="cellClassName"
      height="100%"
      size="medium"
      @cell-click="cellClick"
    >
      <el-table-column
        prop="label"
        class-name="status"
        label="Status"
      />
      <el-table-column
        :index="0"
        align="center"
        prop="withoutAlert"
        label="Sem alerta"
      >
        <template slot-scope="scope">
          <el-tooltip
            v-if="scope.row.withoutAlert > 0"
            popper-class="jus-chart-table__tooltip"
          >
            <div
              slot="content"
              v-html="buildWithoutAlertTooltip(scope.row)"
            />
            <span>{{ scope.row.withoutAlert }}</span>
          </el-tooltip>
          <el-tooltip
            v-else
            content="Tudo certo aqui, nenhuma disputa precisa de sua atenção"
          >
            <jus-icon
              icon="check"
              class="jus-chart-table__check-icon"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        :index="1"
        align="center"
        prop="withAlert"
        label="Com alerta"
      >
        <template slot-scope="scope">
          <el-tooltip
            v-if="scope.row.withAlert > 0"
            popper-class="jus-chart-table__tooltip"
          >
            <div
              slot="content"
              v-html="buildWithAlertTooltip(scope.row)"
            />
            <span>{{ scope.row.withAlert }}</span>
          </el-tooltip>
          <el-tooltip
            v-else
            content="Tudo certo aqui, nenhuma disputa precisa de sua atenção"
          >
            <jus-icon
              icon="check"
              class="jus-chart-table__check-icon"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        :index="2"
        align="center"
        prop="total"
        class-name="column-total"
        label="Total"
      >
        <div slot-scope="scope">
          <el-tooltip
            v-if="scope.row.total > 0"
            popper-class="jus-chart-table__tooltip"
          >
            <div
              slot="content"
              v-html="buildTotalTooltip(scope.row)"
            />
            <span>{{ scope.row.total }}</span>
          </el-tooltip>
          <el-tooltip
            v-else
            content="Tudo certo aqui, nenhuma disputa precisa de sua atenção"
          >
            <jus-icon
              icon="check"
              class="jus-chart-table__check-icon"
            />
          </el-tooltip>
        </div>
      </el-table-column>
    </el-table>
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
    disputeStatusSummaryWithWarn() {
      const self = this
      const disputeStatusSummaryWithWarn = []
      this.data.labels.forEach((label, index) => {
        disputeStatusSummaryWithWarn.push({
          label,
          withoutAlert: self.data.datasets[0].data[index],
          withoutAlertFilter: self.data.datasets[0].filter[index],
          withAlert: self.data.datasets[1].data[index],
          withAlertFilter: self.data.datasets[1].filter[index],
          total: self.data.datasets[2].data[index],
          totalFilter: self.data.datasets[2].filter[index],
          statusIndex: index
        })
      })
      return disputeStatusSummaryWithWarn
    },
    selectedMemberId() {
      return this.$store.getters.dashboardSelectedMemberId
    },
    members() {
      return this.$store.state.workspaceModule.members
    }
  },
  methods: {
    tooltipName() {
      if (this.selectedMemberId) {
        return this.members.filter(member => member.personId === this.selectedMemberId)[0].person.name
      } else {
        return ''
      }
    },
    buildWithoutAlertTooltip(row) {
      const name = this.tooltipName() ? ' de ' + this.tooltipName() : ''
      switch (row.label) {
        case 'PENDENTE':
          return row.withoutAlert + ' disputas' + name + ' estão pendentes, mas NÃO vão expirar nos proximos 3 dias. Pode tratar dos outros casos, só não esqueça de tratar estas pendências'
        case 'PROPOSTA ACEITA':
          return row.withoutAlert + ' disputas' + name + ' foram concluidas. Aguardando providências para sua formalização'
        case 'NEGOCIANDO':
          return row.withoutAlert + ' disputas' + name + ' estão em negociação, mas NÃO vão expirar nos próximos 3 dias'
        case 'SEM RESPOSTA':
          return row.withoutAlert + ' disputas' + name + ' ainda não possuem resposta, mas NÃO vão expirar nos próximos 3 dias'
        case 'TOTAL':
        default:
          return 'Clique para ver estas disputas.'
      }
    },
    buildWithAlertTooltip(row) {
      const name = this.tooltipName() ? this.tooltipName() + ' tem ' : ''
      switch (row.label) {
        case 'PENDENTE':
          return name + row.withAlert + ' disputas pendentes precisam de atenção IMEDIATA para iniciar negociação'
        case 'PROPOSTA ACEITA':
          return name + row.withAlert + ' disputas precisam gerar o termo de acordo, providenciar sua assinatura, responder uma mensagem da parte ou dar ganho na disputa'
        case 'NEGOCIANDO':
          return name + row.withAlert + ' disputas em negociação próximas de expirar ou precisam responder mensagens para a parte.'
        case 'SEM RESPOSTA':
          return name + row.withAlert + ' disputas que ainda não possuem resposta da parte e expiram nos proximos 3 dias, ou que já fazem mais de 7 dias que você iniciou engajamento e precisa reagendar mensagens. Entre em contato manualmente ou reagende as mensagens'
        case 'TOTAL':
        default:
          return 'Clique para ver estas disputas'
      }
    },
    buildTotalTooltip(row) {
      const name = this.tooltipName() ? this.tooltipName() + ' tem ' : ''
      switch (row.label) {
        case 'PENDENTE':
          return name + row.total + ' disputas pendentes. Cuidado para não perde o prazo!'
        case 'PROPOSTA ACEITA':
          return name + row.total + ' disputas aceitas. Não se esqueça de gerar os termos e enviar para o autor.'
        case 'NEGOCIANDO':
          return name + row.total + ' disputas em negociação.'
        case 'SEM RESPOSTA':
          return name + row.total + ' disputas que ainda não possuem respostas. Se já se passaram 1 semana, reinicie o engajamento para aumentar as chances de sucesso.'
        case 'TOTAL':
        default:
          return 'Clique para ver estas disputas.'
      }
    },
    headerRowClassName({ row, rowIndex }) {
      return 'header'
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      let cls = ''
      if (row.label === 'TOTAL') cls += 'line-total '
      if (columnIndex === 1) cls += 'without-alert'
      if (columnIndex === 2) {
        if (row.withAlert) cls += 'with-alert'
        else cls += 'without-alert'
      }
      return cls
    },
    cellClick(row, column, cell, event) {
      if (cell.textContent) {
        const statusIndex = row.statusIndex
        const columnProperty = column.property
        // let columnLabel = column.label
        // let cellIndex = cell.cellIndex
        // let columnIndex = column.index
        // if (statusIndex === 4) {
        //   let status = []
        //   let datasetFilter = this.data.datasets.filter(d => d.label.toUpperCase() === columnLabel.toUpperCase())[0]
        //   statusFilters = { status: status.concat(this.data.filter[0].status, this.data.filter[1].status, this.data.filter[2].status, this.data.filter[3].status) }
        //   datasetFilters = { ...datasetFilter.filter[0], ...datasetFilter.filter[1], ...datasetFilter.filter[2], ...datasetFilter.filter[3] }
        // } else {
        const statusFilters = this.data.filter[statusIndex]
        const datasetFilters = row[columnProperty + 'Filter']
        // }
        // let datasetFilters = this.data.datasets[columnIndex] ? this.data.datasets[columnIndex].filter[cellIndex] : null
        // if (columnIndex !== undefined && (datasetFilters || statusFilters)) {
        const filters = Object.assign(statusFilters || {}, datasetFilters || {})
        this.$store.commit('clearDisputeQuery')
        this.$store.commit('updateDisputeQuery', { key: 'status', value: [] })
        for (const key in filters) {
          // eslint-disable-next-line no-prototype-builtins
          if (filters.hasOwnProperty(key)) {
            this.$store.commit('updateDisputeQuery', { key, value: filters[key] })
          }
        }
        if (this.selectedMemberId) {
          this.$store.commit('updateDisputeQuery', { key: 'persons', value: [this.selectedMemberId] })
        }
        this.$store.commit('setDisputeHasFilters', true)
        this.$store.commit('updateDisputeQuery', { key: 'sort', value: ['visualized,asc', 'id,desc'] })
        this.$store.commit('setDisputesTab', '9')
        this.$router.push('/management/all')
        // }
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/colors.scss';
.jus-chart-table {
  .el-table {
    .header th {
      background: #f6f6f6;
    }
    td.status {
      background: #f6f6f6;
      font-weight: bold;
    }
    td.without-alert {
      background: #1abc9c80 !important;
    }
    td.with-alert {
      background: #f1c40f80 !important;
    }
    td.column-total {
      font-weight: bold;
      background: #f6f6f6 !important;
      color: #424242 !important;
    }
    tr.line-total, td.line-total {
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
    &__body {
      height: 100%;
      td {
        padding: 0;
      }
    }
  }
  &__check-icon {
    height: 14px;
  }
  &__tooltip {
    div {
      text-align: justify;
      max-width: 360px;
    }
  }
}
</style>
