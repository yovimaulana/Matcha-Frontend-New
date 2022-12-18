import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '../views/LoginPage_v2.vue'
import store from '../store/index.js'
const routes = [
  {
    path: '/',
    name: 'login',
    //karena inisiasi awal maka tidak perlu lazy load
    // component: () => import('../views/LoginPage.vue'),
    component:/* webpackChunkName: "login" */ Login,       
   
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/MyLayout.vue')
  },
  {
    path: '/assessment',
   
    component: () => import('../views/MyLayout2.vue'),
    children: [{
      path: '',
      name: 'assessment',
      component: () => import('../views/Assessment_v2.vue')
    }],
    meta: {
      title: "Assessment",      
      requiresAuth: true,
      restriction: 'user',
    }
  },  
  {
    path: '/matching',    
    component: () => import('../views/MyLayout2.vue'),
    children: [{
      path: '',
      name: 'matching',
      component: () => import(/* webpackChunkName: "Matching"*/'../views/Matching.vue'),      
    }],    
    meta: {
      title: "Matching Manual",      
      requiresAuth: true,
      restriction: 'user',
    }
  },
  {
    path: '/dashboard/admin', 
    component: () => import('../views/MyLayout2.vue'),
    children: [{
      path: '/dashboard/admin',
      name: 'dashboardAdmin',
      component: () => import(/* webpackChunkName: "DashboardAdmin"*/'../views/DashboardAdmin.vue')
    }],
    meta: {
      title: "Dashboard",      
      requiresAuth: true,
      restriction: 'admin',
    }
  },
  {
    path: '/analytics',    
    component: () => import('../views/MyLayout2.vue'),
    children: [{
      path: '',
      name: 'analytics',
      component: () => import(/* webpackChunkName: "Matching"*/'../views/DashboardAnalytics.vue'),      
    }],    
    meta: {
      title: "Data SBR Live",      
      requiresAuth: true,
      restriction: 'supervisor',
    }
  },
  {
    path: '/dashboard',
 
    component: () => import('../views/MyLayout2.vue'),
    children: [{
      path: '/dashboard',
      name: 'dashboardUser',
      component: () => import(/* webpackChunkName: "DashboardAdmin"*/'../views/DashboardUser.vue')
    }],
    meta: {
      title: "Dashboard",      
      requiresAuth: true,
      restriction: 'user',
    }
  },
  {
    path: '/kegiatan',    
    component: () => import('../views/MyLayout2.vue'),
    children: [{
      path: '',
      name: 'kegiatan',
      component: () => import(/* webpackChunkName: "Kegiatan"*/'../views/Kegiatan.vue')
    }],
    meta: {
      title: "Kegiatan",      
      requiresAuth: true,
      restriction: 'admin',
    }
  },
  {
    path: '/manajemen-user',    
    component: () => import('../views/MyLayout2.vue'),
    children: [{
      path: '',
      name: 'manajemenUser',
      component: () => import(/* webpackChunkName: "Kegiatan"*/'../views/ManagementUser.vue')
    }],
    meta: {
      title: "Manajemen User",      
      requiresAuth: true,
      restriction: 'admin',
    }
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/MyLayout2.vue'),
    children: [{
      path: '',
      component: () => import('../views/History.vue')
    }],
  },
  {
    path: '/alokasi/matching',
   
    component: () => import('../views/MyLayout2.vue'),
    children: [{
      path: '',
      name: 'alokasiMatching',
      component: () => import(/* webpackChunkName: "AlokasiMatching"*/'../views/AlokasiMatching.vue')
    }],
    meta: {
      title: "Alokasi Petugas Matching",      
      requiresAuth: true,
      restriction: 'admin',
    }
  },
  {
    path: '/alokasi/assessment',
    
    component: () => import('../views/MyLayout2.vue'),
    children: [{
      path: '',
      name: 'alokasiAssessment',
      component: () => import(/* webpackChunkName: "AlokasiAssessment"*/'../views/AlokasiAssessment.vue')
    }],
    meta: {
      title: "Alokasi Petugas Assessment",      
      requiresAuth: true,
      restriction: 'admin',
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/MyLayout2.vue'),
    children: [{
      path: '',
      component: () => import('../views/About.vue')
    }],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import(/* webpackChunkName: "NotFound"*/'../views/NotFound.vue')
  },
  {
    path: '/unauthorized',
    name: 'unauthorized',
    component: () => import(/* webpackChunkName: "NotFound"*/'../views/NotFound.vue')
  },
  {
    path: '/katalog-data-sbr',    
    name: 'direktoriLinkDataSM',
    component: () => import(/* webpackChunkName: "KatalogDataSBR"*/'../views/DirektoriLinkDataSM.vue')
  }
    
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})


router.beforeEach((to, from, next) => { 
      
  // handle kalo coba masuk ke halaman login
  if(to.path == '/') 
  {
    if (store.getters.isLoggedIn) { 

      let userRoles = store.getters.user.roles,
          filteredRoles = userRoles.find(role => role.name == "ROLE_ADMIN"),
          nameRoute = filteredRoles == undefined ? 'dashboardUser' : 'dashboardAdmin';      
          
      next({ name: nameRoute })      
      return;
    }
  }  

  // redirect ke halaman login kalo sudah logout
  if(to.matched.some(record => record.meta.requiresAuth))
  {    
    if (!store.getters.isLoggedIn) {
      next({ name: 'login' })   
      return;   
    } 
    
    let userRoles = store.getters.user.roles,
        filteredRoles = userRoles.find(role => role.name == `ROLE_${to.meta.restriction.toUpperCase()}`)
    if(filteredRoles == undefined) {
      next({name: 'unauthorized'})
      return
    }
  }

  // set title dokumen
  document.title = process.env.VUE_APP_NAME+' '+(to.meta.title ? `- ${to.meta.title}` : '')  
  
  next()

  // if (to.matched.some(record => record.meta.auth)) {
  //   if (store.getters.isLoggedIn && store.getters.user) {
  //     next()
  //     return
  //   }
  //   next('/')
  // }

  // if (to.matched.some(record => record.meta.guest)) {
  //   if (!store.getters.isLoggedIn) {
  //     next()
  //     return
  //   }
  //   next('/dashboard')
  // }

  // next()
})

export default router
