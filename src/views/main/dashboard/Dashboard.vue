<template>
  <JusViewMain class="dashboard-view">
    <template slot="title">
      <h1>
        Dashboard
      </h1>
    </template>
    <template slot="main">
      <jus-chart-line :data="data" :options="options"/>
      <div style="display: flex; justify-content: center;">
        <jus-chart-doughnut
          :data="[21, 23, 56]"
          :height="300"
          title="O" />
        <jus-chart-doughnut
          :data="[12, 32, 65]"
          :height="300"
          title="O" />
        <jus-chart-doughnut
          :data="[12, 32, 65]"
          :height="300"
          title="O" />
      </div>
      <!-- {{ $t('message') }} -->
    </template>
  </JusViewMain>
</template>

<script>
import JusChartLine from '@/components/charts/JusChartLine'
import JusChartDoughnut from '@/components/charts/JusChartDoughnut'

export default {
  name: 'Dashboard',
  components: {
    JusChartLine,
    JusChartDoughnut
  },
  data () {
    return {
      data: {
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio'],
        datasets: [
          {
            label: 'Casos importados',
            backgroundColor: '#eF930066',
            borderColor: '#eF9300',
            data: [40, 55, 35, 55, 40]
          },
          {
            label: 'Acordos fechados',
            backgroundColor: '#9461f766',
            borderColor: '#9461f766',

            data: [40, 22, 7, 22, 40]
          }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    }
  }
}
</script>

<style lang="scss">
</style>
