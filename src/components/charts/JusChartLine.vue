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
    },
    annotation: {
      type: String,
      default: ''
    },
    sufix: {
      type: String,
      default: ''
    },
    filterable: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    const options = Object.assign({}, this.options)
    const self = this
    if (!this.filterable) delete options.onClick
    const annotation = this.annotation ? [{
      type: 'line',
      drawTime: 'afterDatasetsDraw',
      value: 24,
      endValue: 24,
      borderColor: '#adadad',
      borderWidth: 1,
      borderDash: [3, 3.4],
      borderDashOffset: 5,
      mode: 'horizontal',
      scaleID: 'y-axis-0',
      label: {
        backgroundColor: 'rgba(173, 173, 173, 0.8)',
        fontFamily: 'inherit',
        fontSize: 12,
        fontStyle: 'bold',
        fontColor: '#fff',
        xPadding: 3,
        yPadding: 4,
        cornerRadius: 3,
        position: 'center',
        enabled: true,
        content: this.annotation,
        yAdjust: this.getMax() < 24 ? 11 : 0
      }
    }] : []
    // eslint-disable-next-line
    const sufix = this.sufix ? [{
      ticks: {
        callback: (value, index, values) => {
          return value ? `${value} ${self.sufix}` : value
        }
      }
    }] : []
    this.renderChart(this.data, Object.assign(options, {
      legend: {
        display: this.legends,
        position: 'bottom',
        labels: {
          boxWidth: 6,
          usePointStyle: true,
          generateLabels: this.generateLabels
        }
      },
      annotation: { annotations: annotation }
    }))
  },
  methods: {
    getElement(e) {
      const firstPoint = this._data._chart.getElementAtEvent(e)[0]
      if (firstPoint) {
        const filters = this.data.datasets[firstPoint._datasetIndex].filter[firstPoint._index]
        if (this.data.filter) {
          Object.assign(filters, this.data.filter[firstPoint._datasetIndex])
        }
        return {
          label: this.data.labels[firstPoint._index],
          value: this.data.datasets[firstPoint._datasetIndex].data[firstPoint._index],
          filters
        }
      }
    },
    generateLabels(chart) {
      const data = chart.data
      if (data.datasets.length && data.datasets.length) {
        return data.datasets.map(function(dataset, i) {
          // eslint-disable-next-line
          let fill = Chart.helpers.getValueAtIndexOrDefault(data.datasets[i].borderColor, i, chart.options.elements.arc.borderColor)
          return {
            text: dataset.label,
            fillStyle: fill,
            index: i,
            hidden: false
          }
        })
      } else {
        return []
      }
    },
    getMax() {
      let max = 0
      for (const dataset of this.data.datasets) {
        for (const data of dataset.data) {
          if (data >= max) max = data
        }
      }
      return max
    }
  }
}
</script>
