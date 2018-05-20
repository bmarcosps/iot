import Vue from 'vue'
import VueRouter from 'vue-router'

import Dashboard from './components/TheDashboard'
import TheDashboardHome from './components/Dashboard/TheDashboardHome'

Vue.use(VueRouter)

const routes = [
  {path: '/', name: 'home', redirect: '/dashboard'},
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      {path: '', name: 'dashboard', component: TheDashboardHome}
    ]
  },
  {path: '/*', redirect: '/'}
]

export default new VueRouter({
  routes,
  mode: 'history',
  linkExactActiveClass: 'active',
  saveScrollPosition: true
})