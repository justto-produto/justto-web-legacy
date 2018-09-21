<script>
import { Doughnut } from 'vue-chartjs'

export default {
  name: 'DoughnutChart',
  extends: Doughnut,
  props: ['title', 'data'],
  mounted () {
    let labels = this.data.slice()
    this.renderChart(
      {
        datasets: [{
          data: this.data,
          backgroundColor: [
            '#9461f7',
            '#ff9300',
            '#f4f4f4'
          ]
        }],
        labels: labels.slice(0, -1)
      },
      {
        responsive: false,
        cutoutPercentage: 75,
        legend: {
          labels: {
            usePointStyle: true,
            fontSize: 9,
            fontColor: '#424242',
            fontFamily: "'Montserrat', sans-serif"
          }
        },
        title: {
          display: true,
          position: 'bottom',
          fontFamily: "'Montserrat', sans-serif",
          fontStyle: 'normal',
          padding: 0,
          fontSize: 12
        },
        tooltips: {
          enabled: false
        }
      }
    )
    let title = this.title
    // eslint-disable-next-line
    Chart.pluginService.register({
      beforeDraw: function (chart) {
        if (chart.config.type === 'doughnut') {
          var width = chart.chart.width
          var height = chart.chart.height
          var ctx = chart.chart.ctx
          ctx.restore()
          ctx.textBaseline = 'top'
          var text = title
          var textX = Math.round((width - ctx.measureText(text).width) / 2)
          var textY = height / 2
          ctx.fillText(text, textX, textY)
          ctx.save()
        }
      }
    })
  }
}
</script>

<style media="screen">
canvas{
  margin: auto;
}
</style>
