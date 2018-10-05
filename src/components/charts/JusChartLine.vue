<script>
import { Line } from 'vue-chartjs'

export default {
  name: 'JusChartLine',
  extends: Line,
  props: {
    data: {
      type: Object,
      default: undefined
    },
    options: {
      type: Object,
      default: undefined
    }
  },
  mounted () {
    this.renderChart(this.data, this.options)
  }
}
</script>
