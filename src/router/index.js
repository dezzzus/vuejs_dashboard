import Vue from 'vue'
import Router from 'vue-router'
import AudiencePage from '../pages/audience.vue'
import RealtimePage from '../pages/realtime-notifications.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    // Each of these routes are loaded asynchronously, when a user first navigates to each corresponding endpoint.
    // The route will load once into memory, the first time it's called, and no more on future calls.
    // This behavior can be observed on the network tab of your browser dev tools.
    {
      path: '/',
      name: 'realtimepage',
      component: RealtimePage,
      beforeEnter: guardRoute
    },
    {
      path: '/audience',
      name: 'audiencepage',
      component: AudiencePage
    }
  ]
})

function guardRoute (to, from, next) {
  // work-around to get to the Vuex store (as of Vue 2.0)
  next();
}

export default router
