import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import "./plugin/element.js"
import "./assets/css/global.css"
import "./assets/fonts/iconfont.css"

import axios from "axios"
axios.defaults.baseURL="https://www.liulongbin.top:8888/api/private/v1/"
//axious请求拦截器
axios.interceptors.request.use((config)=>{
  config.headers.Authorization=window.sessionStorage.getItem("token");
  return config;
})
Vue.prototype.$http=axios;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
