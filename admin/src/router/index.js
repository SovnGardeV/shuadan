import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/basic',
    component: Layout,
    redirect: '/basic/set',
    name: 'Basic',
    meta: { title: '基础设置', icon: 'example' },
    children: [
      {
        path: 'set',
        name: 'Seeting',
        component: () => import('@/views/basicSetting/index'),
        meta: { title: '基础设置', icon: 'node' }
      },
      {
        path: 'distribution',
        name: 'Distribution',
        component: () => import('@/views/basicSetting/distribution'),
        meta: { title: '分销设置', icon: 'node' }
      },
      {
        path: 'group',
        name: 'Group',
        component: () => import('@/views/basicSetting/userGroup'),
        meta: { title: '用户组设置', icon: 'node' }
      }

    ]
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/index',
    name: 'User',
    meta: { title: '用户管理', icon: 'user' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/user/index'), // Parent router-view
        name: 'UserList',
        meta: { title: '商户管理', icon: 'node' }
      },
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/user/info'),
        meta: { title: '码商管理', icon: 'node' },
        children: [
          {
            path: 'commission',
            name: 'Commission',
            component: () => import('@/views/user/commission'),
            meta: { title: '分佣列表' },
            hidden: true
          },
          {
            path: 'subordinate',
            name: 'Subordinate',
            component: () => import('@/views/user/subordinate'),
            meta: { title: '下级列表' },
            hidden: true
          }
        ]
      }

    ]
  },
  {
    path: '/count',
    component: Layout,
    redirect: '/count/index',
    name: 'Count',
    meta: { title: '账目管理', icon: 'menu' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/count/index'), // Parent router-view
        name: 'merchant',
        meta: { title: '码商充值', icon: 'node' }
      },
      {
        path: 'operatorCash',
        component: () => import('@/views/count/operator'), // Parent router-view
        name: 'operatorCash',
        meta: { title: '商户提现', icon: 'node' }
      },
      {
        path: 'merchantCashRecord',
        component: () => import('@/views/count/merchantRecord'), // Parent router-view
        name: 'merchantCashRecord',
        meta: { title: '码商库存变动', icon: 'node' }
      },
      {
        path: 'operatorCashRecord',
        component: () => import('@/views/count/operatorRecord'), // Parent router-view
        name: 'operatorCashRecord',
        meta: { title: '商户资金变动', icon: 'node' }
      }
    ]
  },
  {
    path: '/order',
    component: Layout,
    redirect: '/order/index',
    name: 'Order',
    meta: { title: '订单管理', icon: 'form' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/order/index'), // Parent router-view
        name: 'OrderList',
        meta: { title: '订单管理', icon: 'node' }
      },
      {
        path: 'method',
        name: 'Form',
        component: () => import('@/views/order/method'),
        meta: { title: '收款方式管理', icon: 'node' }
      }
    ]
  },
  {
    path: '/product',
    component: Layout,
    redirect: '/product/index',
    name: 'Product',
    meta: { title: '产品管理', icon: 'form' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/product/index'), // Parent router-view
        name: '1',
        meta: { title: '产品管理', icon: 'product' }
      }
    ]
  },
  {
    path: '/journal',
    component: Layout,
    redirect: '/journal/index',
    name: 'Journal',
    meta: { title: '日志中心', icon: 'journal' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/journal/index'), // Parent router-view
        name: 'JournalList',
        meta: { title: '日志列表', icon: 'node' }
      },
      {
        path: 'message',
        component: () => import('@/views/journal/message'), // Parent router-view
        name: 'MessageList',
        meta: { title: '消息列表', icon: 'node' }
      }
    ]
  },
  {
    path: '/admini',
    component: Layout,
    redirect: '/admin/index',
    name: 'Admin',
    meta: { title: '管理员列表', icon: 'admin' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/admin/index'), // Parent router-view
        name: 'AdminList',
        meta: { title: '管理员列表', icon: 'node' }
      },
      {
        path: 'code',
        component: () => import('@/views/admin/code'), // Parent router-view
        name: 'Code',
        meta: { title: '商户邀请码', icon: 'node' }
      }
    ]
  },
  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/index',
    name: 'Nested',
    meta: { title: '权限菜单', icon: 'tree' },
    children: [
      {
        path: 'index',
        component: () => import('@/views/nested/index'), // Parent router-view
        name: 'Menu',
        meta: { title: '菜单管理', icon: 'node' }
      },
      {
        path: 'permission',
        component: () => import('@/views/nested/permission'), // Parent router-view
        name: 'Permission',
        meta: { title: '权限管理', icon: 'node' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }

  // 404 page must be placed at the end !!!

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export const asynRouter = [

  // { path: '*', redirect: '/404', hidden: true }
]

export default router
