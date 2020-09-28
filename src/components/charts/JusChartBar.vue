<script>
import { Bar } from 'vue-chartjs'

export default {
  name: 'JusChartBar',
  extends: Bar,
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {}
    },
    stacked: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    const opt = this.options
    if (this.stacked) {
      Object.assign(opt, {
        scales: {
          xAxes: [{
            stacked: true
          }],
          yAxes: [{
            stacked: true
          }]
        }
      })
    }
    this.renderChart(this.data, opt)
  },
  methods: {
    getElement(e) {
      return null
      // var firstPoint = this._data._chart.getElementAtEvent(e)[0]
      // if (firstPoint) {
      //   return {
      //     label: this.data.labels[firstPoint._index],
      //     value: this.data.datasets[firstPoint._datasetIndex].data[firstPoint._index],
      //     filter: this.data.datasets[firstPoint._datasetIndex].filter[firstPoint._index]
      //   }
      // }
    }
  }
}
</script>
