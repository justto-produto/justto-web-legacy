<template>
  <jus-view-main class="dashboard-view">
    <template slot="main">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="dashboard-view__card">
            <el-dropdown class="dashboard-view__menu" trigger="click">
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click="reload('DISPUTE_AVG_RESPONSE_TIME')">Atualizar</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <jus-chart-bar class="dashboard-view__dataset" ref="line" :data="chartsDatasets[1].data" :options="opt" :type="'horizontalBar'"/>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="dashboard-view__card">
            <el-dropdown class="dashboard-view__menu" trigger="click">
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click="reload('DISPUTE_AVG_RESPONSE_TIME')">Atualizar</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <jus-chart-line class="dashboard-view__dataset" ref="line" :data="chartsDatasets[0].data" :options="opt" />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="dashboard-view__card">
            <el-dropdown class="dashboard-view__menu" trigger="click">
              <span class="el-dropdown-link">
                <i class="el-icon-more" />
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click="reload('DISPUTE_AVG_RESPONSE_TIME')">Atualizar</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <jus-chart-line class="dashboard-view__dataset" ref="line" :data="chartsDatasets[3].data" :options="opt" />
          </div>
        </el-col>
        <el-col :span="12">
        </el-col>
      </el-row>
      <el-button type="" @click="reload('DISPUTE_AVG_RESPONSE_TIME')">Teste</el-button>
    </template>
  </jus-view-main>
</template>

<script>
export default {
  name: 'Dashboard',
  components: {
    JusChartLine: () => import('@/components/charts/JusChartLine'),
    JusChartBar: () => import('@/components/charts/JusChartBar')
  },
  data () {
    return {
      // chartsData: null,
      // chartdata: {
      //   labels: ['Semana 1', 'Semana 2', 'Semana 3'],
      //   datasets: [{
      //     label: 'Tempo resposta médio',
      //     data: [40, 20, 10]
      //   }]
      // },
      opt: {
        onClick: this.teste,
      }
    }
  },
  computed: {
    chartsDatasets () {
      return this.$store.getters.chartsDatasets
    }
  },
  methods: {
    reload (chartName) {
      this.$store.dispatch('getDashboard', chartName)
    },
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
@import '@/styles/colors.scss';

.dashboard-view {
  .el-card__body {
    height: 100%
  }
  &__card {
    position: relative;
  }
  &__menu {
    position: absolute;
    top: 5px;
    right: 5px;
  }
  .el-icon-more {
    font-size: 18px;
    transform: rotate(90deg);
    cursor: pointer;
    &:hover {
      color: $--color-primary;
    }
  }
}
</style>
