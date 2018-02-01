<template>
  <div id="gauge-chart"></div>
</template>

<script>
import c3 from '../../static/js/lib/charts-c3js/c3.min.js'
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'gauge-chart',
  computed: {
    ...mapState(['stories']),
    ...mapGetters({
      total: 'getMatchingTotal',
      estOpen: 'getEstOpenTotal'
    }),
    colorLevel () {
      return this.total / 4
    }
  },
  methods: {
    initChart () {
      c3.generate({
        bindto: '#gauge-chart',
        data: {
          columns: [
            ['Opens', this.stories.currentTotals.estOpen]
          ],
          type: 'gauge'
        },
        gauge: {
          label: {
            format: function (value, ratio) {
              return value
            }
          },
          min: 0,
          max: this.stories.currentTotals.matching,
          units: ' Opens'
        },
        color: {
          pattern: ['#FF0000', '#F97600', '#F6C600', '#22b14c'],
          threshold: {
            values: [this.colorLevel, this.colorLevel * 2, this.colorLevel * 3, this.total]
          }
        },
        size: {
          height: 180
        }
      })
    }
  },
  mounted () {
    this.initChart()
  },
  data () {
    return { }
  },
  watch: {
    estOpen () {
      this.initChart()
    }
  }
}
</script>