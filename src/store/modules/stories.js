// eslint-disable-next-line
import axios from '../utils/axios'
import _ from 'lodash'

import mockStories from '../mock/stories'

const _estOpen = (matched, publishedTime) => {
  const secondsAgo = Math.round((Date.now() - publishedTime) / 1000)
  return Math.round(matched * Math.exp(-0.00288811325233 * (secondsAgo / 60)))
}

const MAX_TOTALS = 120

export default {
  state: {
    stories: [],
    totals: {
      matching: ['Matching', ...(new Array(MAX_TOTALS - 1).fill(null))],
      estOpen: ['Est. Opens', ...(new Array(MAX_TOTALS - 1).fill(null))]
    },
    currentTotals: {
      matching: 0,
      estOpen: 0
    }
  },
  getters: {
    getMatchingTotal: state => {
      let push = _.sumBy(state.stories, function (obj) {
        if (obj.channels) return obj.channels.push.matching_count
      })
      let fbm = _.sumBy(state.stories, function (obj) {
        if (obj.channels) return obj.channels.fbm.matching_count
      })
      let browser = _.sumBy(state.stories, function (obj) {
        if (obj.channels) return obj.channels.browser.matching_count
      })
      return push + fbm + browser
    },
    getEstOpenTotal: state => {
      let push = _.sumBy(state.stories, function (obj) {
        if (obj.channels) return obj.pushOpens
      })
      let fbm = _.sumBy(state.stories, function (obj) {
        if (obj.channels) return obj.fbmOpens
      })
      let browser = _.sumBy(state.stories, function (obj) {
        if (obj.channels) return obj.browserOpens
      })
      return push + fbm + browser
    }
  },
  mutations: {
    setStories(state, data) {
      let totalOpens = 0
      let totalMatching = 0

      const newStories = _.unionBy(state.stories, data, 'id')
        .map(story => {
          const { seconds_since_published, publishedTime: storyPublishedTime, channels: { push, fbm, browser } } = story
          const publishedTime = storyPublishedTime || Date.now() - (seconds_since_published * 1000)
          const pushOpens = _estOpen(push.matching_count, publishedTime)
          const fbmOpens = _estOpen(fbm.matching_count, publishedTime)
          const browserOpens = _estOpen(browser.matching_count, publishedTime)
          const newStory = Object.assign(story, {
            fbmOpens,
            pushOpens,
            browserOpens,
            publishedTime,
            time_ago: Math.round((Date.now() - publishedTime) / 1000)
          })

          totalOpens += pushOpens + fbmOpens + browserOpens
          totalMatching += push.matching_count + fbm.matching_count + browser.matching_count
          return newStory
        })

      const { matching, estOpen } = state.totals
      state.stories = newStories

      state.currentTotals = {
        matching: totalMatching,
        estOpen: totalOpens
      }

      state.totals = {
        estOpen: ['Est. Opens', ...estOpen.slice(2), totalOpens],
        matching: ['Matching', ...matching.slice(2), totalMatching]
      }
    }
  },
  actions: {
    getStories(context, payload) {
      return new Promise((resolve, reject) => {
        axios.get(`/dashboard/push/stories?from=${payload.from}&to=${payload.to}&domain_id=${payload.domainId}`)
          .then(response => {
            this.commit('setStories', response)
            resolve(response)
          })
          .catch(e => {
            if (process.env.NODE_ENV === 'development') {
              this.commit('setStories', mockStories)
              resolve(mockStories)
            } else {
              console.log(e)
              reject(e)
            }
          })
      })
    }
  }
}
