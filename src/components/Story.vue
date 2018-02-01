<template>
<section class="card">
  <section class="widget widget-simple-sm story">
    <span class="time_ago">{{ storyData.time_ago | convertTimeAgo }} ago</span>
    <div class="image" :style="headerStyle">
    </div>
    <h3><a :href="storyData.full_url" target="_blank">{{ storyData.title }}</a></h3>
    <div class="distribution">
      <div class="heading">
        <h4>Distribution Potential</h4>
        <div class="progress">
          <span class="progress-bar" :style="{ 'width': distributionPotential + '%', 'background-color': distPotentialColor }"></span>
        </div>
      </div>
      <div class="distribution-table">
        <table class="table table-bordered table-hover">
          <thead>
            <tr>
              <th></th>
              <th class="table-icon-cell">
                <i class="fa fa-mobile" aria-hidden="true"></i>
                <br><small>Devices</small>
              </th>
              <th class="table-icon-cell">
                <i class="fa fa-globe" aria-hidden="true"></i>
                <br><small>Browsers</small>
              </th>
              <th class="table-icon-cell">
                <img src="../assets/facebook-messenger.svg">
                <br><small>Users</small>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Matched</td>
              <td><strong>{{ push.matching_count }}</strong></td>
              <td><strong>{{ fbm.matching_count }}</strong></td>
              <td><strong>{{ browser.matching_count }}</strong></td>
            </tr>
            <tr>
              <td>Est. Open</td>
              <td><strong>{{ pushOpen }}</strong></td>
              <td><strong>{{ fbmOpen }}</strong></td>
              <td><strong>{{ browserOpen }}</strong></td>
            </tr>
          </tbody>
          <tfoot>
            <td></td>
            <story-option :status="push.status" />
            <story-option :status="fbm.status" />
            <story-option :status="browser.status" />
          </tfoot>
        </table>
      </div>
    </div>
  </section>
</section>
</template>

<style lang="scss" scoped>
  .story {
    margin: 0;
    .time_ago {
      position: absolute;
      color: #fff;
      display: inline-block;
      margin-top: 10px;
      padding: 2px 10px;
      font-size: .8em;
      background-color: rgba(#000, .5);
      border-radius: 0 .25rem .25rem 0;
    }
    .image {
      display: inline-block;
      height: 150px;
      width: 100%;
      border-radius: .25rem .25rem 0 0;
    }
    h3 {
      color: #fff;
      font-size: .95em;
      background-color: rgba(#000, .5);
      text-align: center;
      width: 100%;
      bottom: 36px;
      padding: 7px 5px;
      position: relative;
      margin-bottom: -20px;
      a:link, a:visited {
        color: #fff;
      }
      a:hover, a:active {
        color: #fff;
        text-decoration: underline;
      }
    }
    .distribution {
      .heading {
        padding: 0 15px;
        h4 {
          font-size: 1em;
          font-weight: bold;
        }
        .progress-bar {
          background-color: #52c95d;
        }
      }
      .distribution-table {
        overflow-x: auto;
        margin-top: 20px;
        th {
          text-align:center;
          padding: 2px;
          width: 25%;
          min-width: 25%;
          max-width: 25%;
          overflow: hidden;
          &.table-icon-cell {
            img {
              max-width: 15px;
              max-width: 15px;
            }
            i.fa-mobile {
              font-size: 1.3em;
              position: relative;
              top: 2px;
            }
          }
        }
        td {
          overflow: hidden;
          font-size: 85%;
          min-width: 25%;
          max-width: 25%;
          width: 25%;
          padding: 0;
          &:first-child {
            text-align: left;
          }
        }
        tfoot {
          background-color: #f6f8fa;
          td {
            border: none;
            text-align: center;
          }
        }
      }
    }
  }
</style>

<script>
import storyOption from './StoryOption'

export default {
  name: 'story',
  props: ['storyData', 'pushOpen', 'fbmOpen', 'browserOpen'],
  data () {
    return {
      total: 0,
      estOpen: 0
    }
  },
  computed: {
    push () {
      return this.storyData.channels.push
    },
    fbm () {
      return this.storyData.channels.fbm
    },
    browser () {
      return this.storyData.channels.browser
    },
    headerStyle () {
      return {
        background: 'url("' + this.storyData.image_url + '") no-repeat',
        backgroundSize: 'cover'
      }
    },
    distributionPotential () {
      this.total = this.push.matching_count + this.fbm.matching_count + this.browser.matching_count
      this.estOpen = this.pushOpen + this.fbmOpen + this.browserOpen
      return ((this.estOpen * 100) / this.total).toFixed()
    },
    distPotentialColor () {
      let grade = this.total / 4
      if (this.estOpen >= grade * 3) {
        return '#22b14c'
      } else if (this.estOpen >= grade * 2) {
        return '#F6C600'
      } else if (this.estOpen >= grade) {
        return '#F97600'
      } else {
        return '#FF0000'
      }
    }
  },
  filters: {
    convertTimeAgo (s) {
      let m = Math.floor(s / 60)
      s = s % 60
      let h = Math.floor(m / 60)
      m = m % 60
      let d = Math.floor(h / 24)
      h = h % 24
      return d > 0 ? d + ' days' : (h > 0 ? h + ' hours' : (m > 0 ? m + ' minutes' : s + ' seconds'))
    }
  },
  components: {
    storyOption
  },
  mounted () {
  }
}
</script>