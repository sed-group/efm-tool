import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Dashboard from './views/Dashboard.vue'
import Projects from './views/Projects.vue'
import Team from './views/Team.vue'
import Signup from './components/auth/Signup.vue'
import Login from './components/auth/Login.vue'
import ViewProfile from './components/profile/ViewProfile.vue'
import ViewProject from './components/project/ViewProject.vue'
import ViewProjectAlt from './components/project/ViewProjectAlt.vue'
import Docs from './components/documentation/Docs.vue'
import firebase from 'firebase/app';
import 'firebase/auth';

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        requiresAuth: false
      }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/projects',
      name: 'projects',
      component: Projects,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/team',
      name: 'team',
      component: Team,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/profile/:id',
      name: 'ViewProfile',
      component: ViewProfile,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/project/:id',
      name: 'ViewProject',
      component: ViewProject,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/projectAlt/:id',
      name: 'ViewProjectAlt',
      component: ViewProjectAlt,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/docs',
      name: 'Docs',
      component: Docs,
      meta: {
        requiresAuth: false
      }
    }

  ]
})

// router guards
router.beforeEach((to, from, next) => {
  // check to see if route has auth guard
  if(to.matched.some(rec => rec.meta.requiresAuth)){
    // check auth state of user
    let user = firebase.auth().currentUser
    if (user) {
      // User is signed in. Proceed to route
      next()
    } else {
      // No user is signed in. Redirect to login
      next({
        name: 'Login'
      })
    }
  } else {
    // if route is not guarded by auth, proceed
    next()
  }
})

export default router