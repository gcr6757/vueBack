import Vue from 'vue'
import VueRouter from 'vue-router'

//引入登录组件
import Login from '@views/Login'

//引入权限角色列表
import Roles from '@views/Power/roles.vue'

import Cates from '@views/Goods/cates.vue'

import Params from '@views/Goods/params.vue'

import GoodsList from '@views/Goods/goodsList.vue'

import Add from '../views/Goods/add.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/home',
    name: 'home',
    redirect: '/welcome',
    component: () => import('@views/Home'),
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: () => import('@views/Welcome')
      },
      {
        path: '/users',
        name: 'users',
        component: () => import('@views/User')
      },
      {
        path: '/rights',
        name: 'rights',
        component: () => import('@views/Power')
      },
      {
        path: '/roles',
        name: 'roles',
        component: Roles
      },
      {
        path: '/categories',
        name: 'categories',
        component: Cates
      },
      {
        path: '/params',
        name: 'params',
        component: Params
      },
      {
        path: '/goods',
        name: 'goods',
        component: GoodsList,
      },
      {
        path: '/goods/add',
        name: 'goods/add',
        component: Add,
      },
      {
        path: '/orders',
        name: 'orders',
        component: () => import('@views/Order'),
      },
      {
        path: '/reports',
        name: '/reports',
        component: () => import('@views/Report'),
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//定义一个全局的前置导航守卫
//如果用户直接访问主页，并没有登录要重定向到登录
//判断是否有token
router.beforeEach((to, from, next) => {
  // console.log(to);
  if (to.fullPath === '/login') {
    next()
  }
  //取出token判断是否为空
  const token = window.sessionStorage.getItem('token')
  if (!token) {
    //不存在就重定向
    next({
      path: '/login'
    })
  }
  next()
})


export default router
