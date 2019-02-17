<template>
  <JusViewMain class="dashboard-view">
    <template slot="title">
      <h1>
        Dashboard
      </h1>
    </template>
    <template slot="main">
      <el-row gutter="80">
        <el-col :span="8">
          <jus-chart-doughnut
            :data="[211, 323]"
            :height="280"
            title="Casos importados com sucesso" />
          <jus-chart-doughnut
            :data="[21, 23, 56]"
            :height="280"
            title="Acordos fechados" />
        </el-col>
        <el-col :span="15">
          <br>
          <jus-chart-line :data="data" :options="options" :height="280"/>
        </el-col>
      </el-row>
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
        labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho'],
        datasets: [
          {
            label: 'Casos importados',
            backgroundColor: '#eF930066',
            borderColor: '#eF9300',
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt()]
          },
          {
            label: 'Acordos fechados',
            backgroundColor: '#9461f766',
            borderColor: '#9461f766',
            data: [
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt(),
              this.getRandomInt()]
          }
        ]
      },
      options: {
        // responsive: true,
        // maintainAspectRatio: false
      }
    }
  },
  methods: {
    getRandomInt () {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    }
  }
}
</script>

<style lang="scss">
</style>
