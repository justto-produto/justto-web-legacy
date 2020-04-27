<template>
  <jus-view-main class="dashboard-view">
    <template slot="main">
      <jus-chart-line ref="line" :data="chartsData[3].data" :options="opt" />
    </template>
  </jus-view-main>
</template>

<script>
export default {
  name: 'Dashboard',
  components: {
    JusChartLine: () => import('@/components/charts/JusChartLine')
  },
  data () {
    return {
      chartsData: null,
      chartdata: {
        labels: ['Semana 1', 'Semana 2', 'Semana 3'],
        datasets: [{
          label: 'Tempo resposta médio',
          data: [40, 20, 10]
        }]
      },
      opt: {
        onClick: this.teste
      }
    }
  },
  mounted () {
    this.$store.dispatch('getDashboard').then(response => {
      this.chartsData = response
    })
  },
  methods: {
    teste (event, array) {

      console.log(this.$refs.line.getElement(event))

      // console.log(array[0]['_model'])
      // console.log(aray[0])
      // console.log(aray[0]._xScale)
      // console.log(aray[0]._yScale)

      // var ctx = document.getElementById(this.$refs.line.chartId)

      // console.log(ctx.getElementAtEvent(array[0]))
      // var firstPoint = myChart.getElementAtEvent(evt)[0];
      // if (firstPoint) {
      //     var label = myChart.data.labels[firstPoint._index];
      //     var value = myChart.data.datasets[firstPoint._datasetIndex].data[firstPoint._index];
      // }

    }
  }
}
</script>

<style lang="scss">
.dashboard-view {
  .el-card__body {
    height: 100%
  }
}
</style>
