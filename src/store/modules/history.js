// eslint-disable-next-line
import axios from '../utils/axios'

import mockHistory from '../mock/history'

export default {
  state: {
    history: [{}]
  },
  mutations: {
    setHistory (state, data) {
      state.history = data
    }
  },
  actions: {
    getHistory (context, payload) {
      return new Promise((resolve, reject) => {
        axios.get(`/dashboard/push/history?from=${payload.from}&to=${payload.to}&domain_id=${payload.domainId}`)
        .then(response => {
          this.commit('refreshHistory', response)
          resolve(response)
        })
        .catch(e => {
          if (process.env.NODE_ENV === 'development') {
            this.commit('setHistory', mockHistory)
            resolve(mockHistory)
          } else {
            console.log(e)
            reject(e)
          }
        })
      })
    }
  }
}
