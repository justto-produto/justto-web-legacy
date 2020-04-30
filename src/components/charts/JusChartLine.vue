<script>
import { Line } from 'vue-chartjs'

export default {
  name: 'JusChartLine',
  extends: Line,
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {}
    },
    legends: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    this.renderChart(this.data, Object.assign(this.options, {
      legend: {
        display: this.legends
      }
    }))
  },
  methods: {
    getElement (e) {
      var firstPoint = this._data._chart.getElementAtEvent(e)[0]
      if (firstPoint) {
        let filters = this.data.datasets[firstPoint._datasetIndex].filter[firstPoint._index]
        if (this.data.filter) {
          Object.assign(filters, this.data.filter[firstPoint._datasetIndex])
        }
        return {
          label: this.data.labels[firstPoint._index],
          value: this.data.datasets[firstPoint._datasetIndex].data[firstPoint._index],
          filters
        }
      }
    }
  }
}
</script>
