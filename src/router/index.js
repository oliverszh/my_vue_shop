import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../components/Login.vue"

import Home from "../components/Home.vue"
// import Welcome from "../components/welcome.vue"
import Users from "../components/user/users.vue"
import Rights from "../components/power/Rights.vue"
import Roles from "../components/power/Roles.vue"
import Cart from "../components/goods/Cart.vue"
import Params from "../components/goods/Params.vue"
import List from "../components/goods/List.vue"
import Add from "../components/goods/Add.vue"
import Order from "../components/order/Order.vue"
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
        { path: "users", component: Users },
        { path: "rights", component: Rights },
        { path: "roles", component: Roles },
        { path: "categories", component: Cart },
        { path: "params", component: Params },
        { path: "goods", component: List },
        {
          path: "/goods/add",
          component: Add
        },
        { path: "orders", component: Order }
      ]
  }
]

const router = new VueRouter({
  mode: 'history',
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
