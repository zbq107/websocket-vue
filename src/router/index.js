import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import login from '@/components/login'
import reg from '@/components/reg'
import index from '@/components/index'

Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/reg',
      name: 'reg',
      component: reg
    },
    {
      path: '/index',
      name: 'index',
      component: index
    }
  ]
});

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
  if(to.path === '/login' || to.path === '/reg' ) {
    next();
  } else {
    let token = sessionStorage.getItem("userName")
    if(token === null || token === '') {
      next('/login');
    }else {
      next();
    }
  }
});

export default router;
