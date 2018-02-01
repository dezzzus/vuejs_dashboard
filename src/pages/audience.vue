<template>
  <main class="container-fluid page-content">
    <div class="row duration-row">
      <ul class="nav nav-pills">
        <li class="nav-item">
          <a href="#">24 Hours</a>
        </li>
        <li class="nav-item active">
          <a href="#">7 Days</a>
        </li>
        <li class="nav-item">
          <a href="#">30 Days</a>
        </li>
      </ul>
    </div>
    <div class="row">
      <div class="col-md-4">
        <section class="card">
          <header class="card-header">
            Subscriptions
          </header>
          <div class="card-block">
            <div class="title">Total: 125,452</div>
            <div class="row thick-row">
              <div class="col-md-2 col align-middle">
                1
              </div>
              <div class="col-md-7 col align-middle">
                <div class="progress">
                  <span class="progress-bar" :style="{ 'width': 80 + '%', 'background-color': '#1133af' }"></span>
                </div>
              </div>
              <div class="col-md-3 col align-middle">
                12,520
              </div>
            </div>
            <div class="row thick-row">
              <div class="col-md-2 col align-middle">
                1
              </div>
              <div class="col-md-7 col align-middle">
                <div class="progress">
                  <span class="progress-bar" :style="{ 'width': 80 + '%', 'background-color': '#1133af' }"></span>
                </div>
              </div>
              <div class="col-md-3 col align-middle">
                12,520
              </div>
            </div>
            <div class="row thick-row">
              <div class="col-md-2 col align-middle">
                1
              </div>
              <div class="col-md-7 col align-middle">
                <div class="progress">
                  <span class="progress-bar" :style="{ 'width': 80 + '%', 'background-color': '#1133af' }"></span>
                </div>
              </div>
              <div class="col-md-3 col align-middle">
                12,520
              </div>
            </div>

          </div>
        </section>
      </div>
      <div class="col-md-8">
        <section class="card">
          <header class="card-header">
            Subscriptions overtime
          </header>
          <div class="card-block">
            <bar-chart v-if='showBarChart' :totalData='stories.totals.matching' :estOpenData='stories.totals.estOpen' :tick='barChartTick' />
            <i v-else class="fa fa-spinner fa-spin fa-3x fa-fw" aria-hidden="true"></i>
          </div>
        </section>
      </div>
    </div>
    <div class="row-title">
      Popular Segments
      <div class="row-line"></div>
    </div>
    <div class="row table-row">
      <div class="col-md-4">
        <segment-table v-if='history.history[0].title' :tableName="'Most Popular Segments By User'" :historyData='history.history' />
      </div>
      <div class="col-md-4">
        <segment-table v-if='history.history[0].title' :tableName="'Most Popular Segments By Subscribers'" :historyData='history.history' />
      </div>
      <div class="col-md-4">
        <segment-table v-if='history.history[0].title' :tableName="'Top Segments By CTR'" :historyData='history.history' />
      </div>
    </div>
    <div class="row table-row">
      <div class="col-md-4">
        <segment-table v-if='history.history[0].title' :tableName="'Most Popular Segments By User'" :historyData='history.history' />
      </div>
      <div class="col-md-4">
        <segment-table v-if='history.history[0].title' :tableName="'Most Popular Segments By Subscribers'" :historyData='history.history' />
      </div>
      <div class="col-md-4">
        <segment-table v-if='history.history[0].title' :tableName="'Top Segments By CTR'" :historyData='history.history' />
      </div>
    </div>
    <div class="row-title">
      Segments
      <div class="row-line"></div>
    </div>
    <div class="row">
      <div class="input-group input-group-sm mb-3">
        <input type="text" class="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" placeholder="Search Segment">
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
  import segmentTable from "../components/SegmentTable";

  import { mapState, mapActions, mapGetters } from "vuex";

  const STORIES_REQUEST_PERIOD = 10;
  const REFRESH_INTERVAL = 10000;
  const REAL_TIME_CHART_INTERVAL = 5000;
  const REAL_TIME_CHART_COLUMNS = 120;
  const PUSH_HISTORY_INTERVAL = 10000;

  export default {
    name: "AudiencePage",
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
        chartTotalData: ["data1"],
        chartEstOpenData: ["data2"]
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
          this.chartTotalData[0] = "data1";
          this.chartEstOpenData[0] = "data2";
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
      segmentTable
    }
  };
</script>
