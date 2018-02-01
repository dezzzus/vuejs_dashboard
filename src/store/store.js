 /* eslint-disable */

import Vue from 'vue'
import Vuex from 'vuex'

import storiesModule from './modules/stories.js'
import historyModule from './modules/history.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    stories: storiesModule,
    history: historyModule
  }
})

export default store
