<template>
  <main class="container-fluid page-content">
    <div class="row charts">
      <div class="col-lg-4 gauge">
        <section class="card">
            <header class="card-header">
              Distribution Potential
            </header>
            <div class="card-block">
              <gauge-chart v-if='devicesTotal && devicesEstOpen' />
              <i v-else class="fa fa-spinner fa-spin fa-3x fa-fw" aria-hidden="true"></i>
            </div>
          </section>
      </div>
      <div class="col-lg-8 bar">
        <section class="card">
          <header class="card-header">
            Real time potential & est. open
          </header>
          <div class="card-block">
            <bar-chart v-if='showBarChart' :totalData='stories.totals.matching' :estOpenData='stories.totals.estOpen' :tick='barChartTick' />
            <i v-else class="fa fa-spinner fa-spin fa-3x fa-fw" aria-hidden="true"></i>
          </div>
        </section>
      </div>
    </div>
    <div class="row statistics">
      <div class="col-lg-8 col-md-12">
        <h2 class="heading">Stories</h2>
        <div class="stories">
          <div class="row">
            <div class="col-sm-6 col-md-4 col-lg-3">
              <story-refresh v-on:refreshStories='resetStoryTimers' :counter='storiesRefreshCounter' :spin='storiesSpinner' />
            </div>
            <div class="col-sm-6 col-md-4 col-lg-3" v-for="story in stories.stories"  v-if="story.id">
              <story :storyData='story' :pushOpen='story.pushOpens' :fbmOpen='story.fbmOpens' :browserOpen='story.browserOpens' />
            </div>
          </div>
          <div class="row older">
            <div class="col-lg-12">
              <i class="fa fa-spinner fa-2x fa-spin" v-if="olderSpinner" aria-hidden="true"></i>
            </div>
            <div class="col-lg-12">
              <button v-if='!olderSpinner' type="button" class="btn btn-rounded btn-inline btn-secondary" @click='loadOlderStories'>Older</button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-12">
        <div class="queues_heading heading">
          <h2>Sending Queues</h2>
          <div class="refresh_block">
            <button type="button" class="btn btn-rounded btn-inline btn-sm" @click='resetHistoryTimers'>Refresh Now</button>
            <i class="fa fa-refresh" :class="{ 'fa-spin': historySpinner }" aria-hidden="true"></i>
            <span>{{ historyRefreshCounter }}s</span>
          </div>
        </div>
        <div class="queues">
          <div class="row">
            <data-table v-if='history.history[0].title' :historyData='history.history' />
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.card-header {
  font-size: 1.5em;
}
.card-block {
  min-height: 272px;
}
.gauge {
  .card-block {
    padding: 46px 16px;
  }
}
h2 {
  font-size: 1.4em;
  color: #65656b;
  display: inline-block;
  background-color: #eceff4;
  padding: 0 10px;
}
.stories,
.queues {
  padding: 20px;
  border-top: 1px solid #dfe6eb;
  border-right: 1px solid #dfe6eb;
  border-radius: 0.25rem;
  padding-top: 30px;
  padding-right: 30px;
  margin-bottom: 30px;
}
.stories {
  .row {
    & > div {
      min-width: 225px;
    }
  }
}
.older > div {
  text-align: center;
  margin-bottom: 15px;
  i {
    color: #6b7a85;
  }
}
.heading {
  padding: 10px;
  position: absolute;
  top: -25px;
  &.queues_heading {
    width: 90%;
  }
  .refresh_block {
    padding: 0 10px;
    display: inline-block;
    position: absolute;
    right: 0;
    background-color: #eceff4;
    color: #65656b;
    button {
      font-size: 0.7em;
    }
  }
}
</style>

<script>
import gaugeChart from "../components/GaugeChart";
import barChart from "../components/BarChart";
import story from "../components/Story";
import storyRefresh from "../components/StoryRefresh";
import dataTable from "../components/DataTable";

import { mapState, mapActions, mapGetters } from "vuex";

const STORIES_REQUEST_PERIOD = 10;
const REFRESH_INTERVAL = 10000;
const REAL_TIME_CHART_INTERVAL = 5000;
const REAL_TIME_CHART_COLUMNS = 120;
const PUSH_HISTORY_INTERVAL = 10000;

export default {
  name: "RealtimePage",
  data() {
    return {
      cachedRefreshStoriesFrom: STORIES_REQUEST_PERIOD,
      storiesTimer: undefined,
      historyTimer: undefined,
      barChartTimer: undefined,
      storiesRefreshTimer: undefined,
      historyRefreshTimer: undefined,
      storiesRefreshCounter: 0,
      historyRefreshCounter: 0,
      storiesSpinner: false,
      historySpinner: false,
      olderSpinner: false,
      barChartTick: REAL_TIME_CHART_INTERVAL / 1000,
      chartTotalData: ["Matching"],
      chartEstOpenData: ["Est. Open"]
    };
  },
  computed: {
    ...mapState(["stories", "history"]),
    showBarChart() {
      return !!this.stories.totals.matching.length;
    },
    ...mapGetters({
      devicesTotal: "getMatchingTotal",
      devicesEstOpen: "getEstOpenTotal"
    })
  },
  methods: {
    refreshStories(from, to) {
      let self = this;
      this.storiesSpinner = true;
      this.getStories({ from, to, domainId: "000111" }).then(
        response => {
          if (response.length === 0) {
            self.cachedRefreshStoriesFrom -= STORIES_REQUEST_PERIOD;
            let to = STORIES_REQUEST_PERIOD;
            self.refreshStories(self.cachedRefreshStoriesFrom, to);
          } else {
            this.storiesSpinner = false;
            this.olderSpinner = false;
            self.storiesRefreshCounter = REFRESH_INTERVAL / 1000;
            if (self.storiesRefreshTimer)
              clearInterval(self.storiesRefreshTimer);
            self.storiesRefreshTimer = setInterval(() => {
              self.storiesRefreshCounter--;
            }, 1000);
          }
        },
        () => {
          this.storiesSpinner = false;
          this.olderSpinner = false;
          console.log("error");
        }
      );
    },
    refreshBarChart() {
      if (this.devicesTotal && this.devicesEstOpen) {
        /* this.chartTotalData.shift()
        this.chartTotalData.pop()
        this.chartTotalData.unshift(this.devicesTotal)
        this.chartTotalData.unshift('Matching')
        this.chartEstOpenData.shift()
        this.chartEstOpenData.pop()
        this.chartEstOpenData.unshift(this.devicesEstOpen)
        this.chartEstOpenData.unshift('Est. Open') */
        let size = REAL_TIME_CHART_COLUMNS;
        for (let i = 0; i < size; i++) {
          this.chartTotalData[i] = this.chartTotalData[i + 1];
          this.chartEstOpenData[i] = this.chartEstOpenData[i + 1];
        }
        this.chartTotalData[0] = "Matching";
        this.chartEstOpenData[0] = "Est. Open";
        this.chartTotalData[size] = this.devicesTotal;
        this.chartEstOpenData[size] = this.devicesEstOpen;
        // console.log(this.chartTotalData);
      }
    },
    refreshStoryData() {
      this.refreshStories(this.cachedRefreshStoriesFrom, 0);
      this.refreshBarChart();
    },
    loadOlderStories() {
      this.olderSpinner = true;
      this.cachedRefreshStoriesFrom += STORIES_REQUEST_PERIOD;
      this.refreshStories(this.cachedRefreshStoriesFrom, 0);
    },
    refreshHistory() {
      let self = this;
      this.historySpinner = true;
      this.getHistory({
        from: STORIES_REQUEST_PERIOD,
        to: 0,
        domainId: "000111"
      }).then(
        () => {
          self.historySpinner = false;
          self.historyRefreshCounter = PUSH_HISTORY_INTERVAL / 1000;
          if (self.historyRefreshTimer) clearInterval(self.historyRefreshTimer);
          self.historyRefreshTimer = setInterval(() => {
            self.historyRefreshCounter--;
          }, 1000);
        },
        () => {
          console.log("error");
        }
      );
    },
    setTimers() {
      let self = this;
      this.storiesTimer = setInterval(() => {
        self.refreshStories(this.cachedRefreshStoriesFrom, 0);
      }, REFRESH_INTERVAL);

      this.barChartTimer = setInterval(() => {
        self.refreshBarChart();
      }, REAL_TIME_CHART_INTERVAL);

      this.historyTimer = setInterval(() => {
        self.refreshHistory();
      }, PUSH_HISTORY_INTERVAL);
    },
    resetStoryTimers() {
      console.log("story timers reseted");
      clearInterval(this.storiesRefreshTimer);
      clearInterval(this.storiesTimer);
      clearInterval(this.barChartTimer);
      this.refreshStoryData();
      this.setTimers();
    },
    resetHistoryTimers() {
      console.log("history timers reseted");
      clearInterval(this.historyRefreshTimer);
      clearInterval(this.historyTimer);
      this.refreshHistory();
    },
    ...mapActions({
      getStories: "getStories",
      getHistory: "getHistory"
    }),
    initCharts() {
      for (let i = 1; i <= REAL_TIME_CHART_COLUMNS; i++) {
        this.chartTotalData.push(0);
        this.chartEstOpenData.push(0);
      }
    }
  },
  mounted() {
    this.initCharts();
    this.refreshStoryData();
    this.refreshHistory();
    this.setTimers();
  },
  components: {
    gaugeChart,
    barChart,
    story,
    storyRefresh,
    dataTable
  }
};
</script>
