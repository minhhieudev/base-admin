import Vue from 'vue'
import Router from 'vue-router'
// Load Auth Middleware
import routerBefore from './router-before'
import routerAfter from './router-after'
// Component
import RootLayout from '@/components/Layouts/RootLayout'
import NotFound from '@/components/GeneralView/NotFoundPage'

// Model routes
import userRoutes from './children/user'
import checkInRoute from './children/checkin'
import settingRoute from './children/setting'

Vue.use(Router)

let pageRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/Pages/Login')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/components/Pages/Register')
  }
]

let adminRoutes = {
  path: '/',
  component: RootLayout,
  redirect: 'dashboard',
  name: 'app',
  meta: {
    authRequired: false
  },
  children: [
    {
      path: 'dashboard',
      component: () => import('@/components/Views/Overview'),
      name: 'dashboard',
      meta: {
        title: 'Dashboard'
      }
    },
    ...settingRoute,
    ...checkInRoute,
    ...userRoutes,
  ]
}

const router = new Router({
  routes: [
    adminRoutes, ...pageRoutes, { path: '*', name: 'not_found', component: NotFound, meta: { title: '404 Not Found' } }
  ]
})

router.onError((error) =>{
  if (/Loading (chunk|CSS chunk) [\w|-]* failed/gi.test(error.message) && navigator.onLine) {
    if (router.history.pending) {
      router.go(router.history.pending)
    }
  }
});

router.beforeEach(routerBefore)
router.afterEach(routerAfter)

export default router
