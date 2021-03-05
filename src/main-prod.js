import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import "./plugin/element.js"
import "./assets/css/global.css"
import "./assets/fonts/iconfont.css"

import axios from "axios"
import TreeTable from "vue-table-with-tree-grid"

import VueQuillEditor from 'vue-quill-editor'


axios.defaults.baseURL = "https://www.liulongbin.top:8888/api/private/v1/"
//axious请求拦截器
axios.interceptors.request.use((config) => {
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config;
})
Vue.prototype.$http = axios;

Vue.config.productionTip = false

Vue.component("tree-table", TreeTable)
Vue.use(VueQuillEditor)

Vue.filter("dateFormate", function (value) {
    var dt = new Date(value);
    var y = dt.getFullYear();
    var m = (dt.getMonth() + 1 + '').padStart(2, "0");
    var d = (dt.getDate() + '').padStart(2, '0');
    var hh = (dt.getHours() + '').padStart(2, '0');
    var mm = (dt.getMinutes() + '').padStart(2, '0');
    var ss = (dt.getSeconds() + '').padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
