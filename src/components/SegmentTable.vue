<template>
  <div class="table_container">
    <table class="table table-bordered tabled-hover">
      <thead>
      <tr>
        <th>{{tableName}}</th>
        <th>Users</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for='entry in historyData'>
        <td class="table-icon-cell">
          <img src="../assets/facebook-messenger.svg" v-if='entry.channel === "fbm"'>
          <i v-if='entry.channel === "browser"' class="fa fa-globe" aria-hidden="true"></i>
          <i v-if='entry.channel === "push"' class="fa fa-mobile" aria-hidden="true"></i>
          <br><small>{{ entry.seconds_ago_created | convertTimeAgo }}</small>
        </td>
        <td><br>
          <span>{{ entry.sent_count }}</span>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped>
  .table_container {
    max-width: 400px;
    min-width: 100%;
    overflow-x: auto;
  }
  td {
    text-align: center;
    overflow-x: hidden;
    overflow-y: hidden;
    font-size: .85em;
    &:first-child {
      img {
        max-width: 12px;
        max-height: 12px;
      }
      small {
        font-size: 95%;
      }
      i {
        font-size: 110%;
        &.fa-mobile {
          font-size: 1.5em;
          position: relative;
          top: 2px;
        }
      }
    }
    &.story_cell {
      border-bottom: none;
      display: flex;
      flex-direction: row;
      align-items: stretch;
      justify-content: left;
      img {
        max-width: 30px;
        display: inline-block;
        margin-right: 7px;
      }
      .text {
        display: inline-block;
        text-align: left;
        a:link, a:visited {
          color: inherit;
          text-decoration: none;
          border-bottom: none;
        }
        a:hover, a:active {
          text-decoration: underline;
          border-bottom: none;
        }
      }
    }
    &.status {
      overflow-y: hidden;
      span:first-child {
        text-align: center;
        display: inline-block;
        font-size: 80%;
        &.sending {
          color: #00a8ff;
        }
      }
    }
  }
</style>

<script>
  export default {
    name: 'segment-table',
    props: {
      'historyData': {
        type: Array
      },
      'tableName': {
        type: String
      }
    },
    data () {
      return { }
    },
    filters: {
      convertTimeAgo (s) {
        let m = Math.floor(s / 60)
        s = s % 60
        let h = Math.floor(m / 60)
        m = m % 60
        let d = Math.floor(h / 24)
        h = h % 24
        return d > 0 ? d + 'd' : (h > 0 ? h + 'h' : (m > 0 ? m + 'm' : s + 's'))
      }
    }
  }
</script>
