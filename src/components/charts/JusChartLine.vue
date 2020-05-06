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
    }
  },
  mounted () {
    let self = this
    let annotation = this.annotation ? [{
      type: 'line',
      drawTime: 'afterDatasetsDraw',
      value: 24,
      endValue: 24,
      borderColor: '#adadad',
      borderWidth: 3,
      borderDash: [3, 3.4],
      borderDashOffset: 5,
      mode: 'horizontal',
      scaleID: 'y-axis-0',
      label: {
        backgroundColor: '#adadad',
        fontFamily: 'inherit',
        fontSize: 12,
        fontStyle: 'bold',
        fontColor: '#fff',
        xPadding: 12,
        yPadding: 6,
        cornerRadius: 4,
        position: 'center',
        enabled: true,
        content: this.annotation
      }
    }] : []
    let sufix = this.sufix ? [{
      ticks: {
        callback: (value, index, values) => {
          return value ? `${value} ${self.sufix}` : value
        }
      }
    }] : []
    this.renderChart(this.data, Object.assign(this.options, {
      legend: {
        display: this.legends
      },
      annotation: {
        drawTime: 'afterDatasetsDraw',
        annotations: annotation
      },
      scales: {
        yAxes: sufix
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
