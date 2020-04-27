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
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  },
  methods: {
    // getElement (e) {
    //   var firstPoint = this._data._chart.getElementsAtEvent(e)[0]
    //   if (firstPoint) {
    //     return {
    //       label: this.data.labels[firstPoint._index],
    //       value: this.data.datasets[firstPoint._datasetIndex].data[firstPoint._index],
    //       filter: this.data.datasets[firstPoint._datasetIndex].filter[firstPoint._index],
    //     }
    //   }
    // }
  }
}
</script>
