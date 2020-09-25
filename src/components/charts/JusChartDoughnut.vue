<script>
import { Doughnut } from 'vue-chartjs'

export default {
  name: 'JusChartDoughnut',
  extends: Doughnut,
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
    const labels = this.data.slice()
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
    const title = this.title
    // eslint-disable-next-line
    Chart.pluginService.register({
      beforeDraw: function(chart) {
        if (chart.config.type === 'doughnut') {
          const width = chart.chart.width
          const height = chart.chart.height
          const ctx = chart.chart.ctx
          ctx.restore()
          ctx.textBaseline = 'top'
          const text = title
          const textX = Math.round((width - ctx.measureText(text).width) / 2)
          const textY = height / 2
          ctx.fillText(text, textX, textY)
          ctx.save()
        }
      }
    })
  }
}
</script>

<style>
canvas{
  margin: auto;
}
</style>
