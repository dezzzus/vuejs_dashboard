<template>
  <div id="bar-chart" :totals="stories.totals.matching.length"></div>
</template>

<script>
import c3 from "../../static/js/lib/charts-c3js/c3.min.js";
import { mapState } from "vuex";

let chartElm;

export default {
  name: "bar-chart",
  props: ["tick"],
  mounted() {
    this.createChart();
  },
  computed: {
    ...mapState(["stories"]),
    tickMax() {
      return this.tick * (this.stories.totals.matching.length - 1);
    },
    yScale() {
      const { matching, estOpen } = this.stories.totals;
      const estOpenValues = estOpen.slice(1).filter(v => typeof v === "number");
      const matchingValues = matching.slice(1).filter(v => !!v);
      const estOpenNormalized = (estOpenValues.length && estOpenValues) || 0;
      const matchingNormalized =
        (matchingValues.length && matchingValues) || 10;
      return {
        min: Math.floor(Math.min(estOpenNormalized) * 0.9),
        max: Math.floor(Math.max(matchingNormalized) * 1.1)
      };
    }
  },
  methods: {
    createChart() {
      const { matching, estOpen } = this.stories.totals;
      const { min, max } = this.yScale;
      console.log("Creating bar chart");
      const { tick, tickMax } = this;
      chartElm = c3.generate({
        bindto: "#bar-chart",
        data: {
          columns: [matching, estOpen],
          type: "area",
          // groups: [[matching[0], estOpen[0]]],
          colors: {
            Matching: "#00a2e8",
            "Est. Open": "#22b14c"
          }
        },
        axis: {
          x: {
            type: "indexed",
            tick: {
              format(x) {
                let val = tickMax - tick * (x + 1);
                if (val === 0) {
                  return "now";
                } else {
                  let m = Math.floor(val / 60);
                  val = val % 60;
                  if (m > 0) {
                    if (val !== 0)
                      return (
                        m +
                        "." +
                        val +
                        (window.innerWidth <= 880 ? " m" : " minutes ago")
                      );
                    else
                      return (
                        m + (window.innerWidth <= 880 ? " m" : " minutes ago")
                      );
                  }
                  return (
                    val + (window.innerWidth <= 880 ? " s" : " seconds ago")
                  );
                }
              }
            }
          },
          y: {
            tick: {
              format: function(y) {
                let val = y;
                if (y >= 1000000) {
                  val = Math.round(y / 1000000 * 100) / 100 + "M";
                } else if (y >= 1000) {
                  val = Math.round(y / 1000 * 100) / 100 + "K";
                }
                return val;
              }
            },
            min,
            max
          }
        },
        size: {
          height: 240
        }
      });
    },
    refreshChart() {
      console.log("Refreshing Bar Chart");
      const { min, max } = this.yScale;
      const { matching, estOpen } = this.stories.totals;
      chartElm.load({
        columns: [matching, estOpen]
      });
      chartElm.axis.max({y: max});
      chartElm.axis.min({y: min});
    }
  },
  beforeUpdate() {
    this.refreshChart();
  }
};
</script>