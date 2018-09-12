<template>
  <div class="">
    <line-chart :data="data" :options="options">
    </line-chart>
  </div>
</template>

<script>
import LineChart from '@/components/charts/LineChart'

export default {
  name: 'Main',
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
      options: {responsive: true, maintainAspectRatio: false}
    }
  },
  components: {
    LineChart
  }
}
</script>
