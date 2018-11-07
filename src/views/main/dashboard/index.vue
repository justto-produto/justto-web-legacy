<template>
  <JusViewMain class="dashboard-container">
    <template slot="title">
      <h1>Dashboard</h1>
    </template>
    <template slot="main">
      <JusChartLine :data="data" :options="options"/>
      <!-- {{ $t('hello') }} -->
    </template>
  </JusViewMain>
</template>

<script>
import JusChartLine from '@/components/charts/JusChartLine'

export default {
  name: 'Dashboard',
  components: {
    JusChartLine
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
            data: [110, 54, 15, 41, 27, 120]
          },
          {
            label: 'Acordos fechados',
            backgroundColor: '#9461f766',
            borderColor: '#9461f766',

            data: [41, 22, 7, 12, 11, 32]
          }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false }
    }
  }
}
</script>

<style lang="scss">
  .dashboard-container{
    margin: 10px 20px 20px;
  }
</style>

<i18n>
{
  "en": {
    "hello": "Hello i18n in SFC!"
  },
  "pt-BR": {
    "hello": "Olá i18n in SFC!"
  }
}
</i18n>
