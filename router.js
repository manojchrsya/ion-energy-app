import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const Dashboard = () => import('~/pages/dashboard').then(m => m.default || m)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [{
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
    }],
  });
}
