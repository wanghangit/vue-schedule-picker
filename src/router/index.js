import Vue from 'vue'
import Router from 'vue-router'
import hello from '@/components/Hello'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'timeFrame',
      component: hello
    }
  ]
})
