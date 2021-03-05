import Vue from 'vue'
import VueRouter from 'vue-router'

// 路由的懒加载
// import Login from "../components/Login.vue"
const Login = () => import('../components/Login.vue')

// import Home from "../components/Home.vue"
const Home = () => import('../components/Home.vue')
// import Welcome from "../components/welcome.vue"
// import Users from "../components/user/users.vue"
const Users = () => import('../components/user/users.vue')
// import Rights from "../components/power/Rights.vue"
const Rights = () => import('../components/power/Rights.vue')

// import Roles from "../components/power/Roles.vue"
const Roles = () => import('../components/power/Roles.vue')

// import Cart from "../components/goods/Cart.vue"
const Cart = () => import('../components/goods/Cart.vue')

// import Params from "../components/goods/Params.vue"
const Params = () => import('../components/goods/Params.vue')

// import List from "../components/goods/List.vue"
const List = () => import('../components/goods/List.vue')

// import Add from "../components/goods/Add.vue"
const Add = () => import('../components/goods/Add.vue')

// import Order from "../components/order/Order.vue"
const Order = () => import('../components/order/Order.vue')

// import Report from '../components/report/Report.vue'
const Report = () => import('../components/report/Report.vue')
Vue.use(VueRouter)

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login, name: "login" },
  {
    path: "/home",
    component: Home,
    name: "home",
    redirect: "/home/users",
    children:
      [
        { path: "users", component: () => import('../components/user/users.vue') },
        { path: "rights", component: Rights },
        { path: "roles", component: Roles },
        { path: "categories", component: Cart },
        { path: "params", component: Params },
        { path: "goods", component: List },
        {
          path: "/goods/add",
          component: Add
        },
        { path: "orders", component: Order },
        { path: "reports", component: Report }
      ]
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

//挂载路由导航守卫
router.beforeEach((to, from, next) => {
  //to 要访问的路径
  //from 代表从哪个路径跳转而来
  //next 是一个函数，表示放行
  // next() 放行 next("/login") 强制跳转
  if (to.path == "/login") return next();

  var token = window.sessionStorage.getItem("token");
  if (!token) return next("/login");
  next();
});

export default router
