import { createRouter, createWebHistory } from 'vue-router'
// import Login from '../Login.vue'
const Login = () => import('../Login.vue')
const Index = () => import('../views/Index.vue')
const Detail = () => import('../views/Detail.vue')
const Report = () => import('../views/Report.vue')
const Setting = () => import('../views/Setting.vue')
const Service = () => import('../views/Service.vue')
const FeedBack = () => import('../components/service/FeedBack.vue')
const Course = () => import('../components/service/Course.vue')
const Overview = () => import('../views/Overview.vue')
const Login1 = () => import('../Login1.vue')
const Index1 = () => import('../views/Index1.vue')

const routes = [
  { path: '/', redirect: '/login'},
  // 主登录路由
  { path: '/login', component: Login },
  { 
    path: '/index', 
    component: Index,
    children: [
      {
        path: 'overview',
        component: Overview
      },
      {
        name: 'detail',
        path: 'detail',
        component: Detail
      },
      {
        path: 'report',
        component: Report
      },{
        path: 'setting',
        component: Setting
      },{
        path: 'service',
        component: Service,
        meta:{title:'客户服务'},
        children:[
          {
            path: 'feedback',
            component: FeedBack
          },
          {
            path: 'course',
            component: Course,
            meta:{title:'系统教程'}
          }
        ]
      },
    ]
  },
  
  // 副登录路由
  {path: '/login1', component: Login1},
  {path: '/index1', component: Index1}
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  const getToken = window.sessionStorage.getItem("token");
  if(to.path === "/login" || to.path === "/login1") return next();
  if(!getToken) return next("/login");
  if(to.path === "/index"
  || to.path === '/index/service'
  ) return next("/index/overview");
  next();
})
router.afterEach((to,from)=>{
  if(from.path == '/login' && to.path != '/login'){
      window.location.reload();
      
  }
})
export default router
