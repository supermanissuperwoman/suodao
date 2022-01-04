import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'
import axios from 'axios'
import store from './store/index.js'
// import VTouch from 'vue3-touch'
// import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.min.css'
import 'swiper/components/pagination/pagination.scss';
import * as echarts from 'echarts';
import { clearSessionStorage, getItem } from './api/index'
import { urlObj } from './config/index'
// import 'lib-flexible/flexible'
// import jquery from "../node_modules/jquery/dist/jquery.min.js";
// import 'jquery' from 
import { installElement } from "./plugins/element";
import './assets/css/base.css'
import 'element-plus/lib/theme-chalk/index.css';
import 'element-plus/lib/theme-chalk/display.css';
import 'element-plus/packages/theme-chalk/src/base.scss'
import lang from 'element-plus/lib/locale/lang/zh-cn'
import 'dayjs/locale/zh-cn'
import locale from 'element-plus/lib/locale'
import './assets/iconfont/iconfont.css'
import VuePlayerVideo from 'vue3-player-video'
locale.use(lang)

const app = createApp(App)
installElement(app)
axios.defaults.headers = {
  "content-type": "application/json",
  "accesstoken": getItem("token")
}
// 请求拦截器
axios.interceptors.request.use(
  config => {
    //       // 每次发送请求之前判断vuex中是否存在token
    //       // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    //       // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
    // const token = getItem("token");
    // token && (config.headers.accesstoken = token);
    return config;
  },
  error => {
    return Promise.error(error);
  }
);
// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 对所有请求的响应进行拦截，token过期，则重新登录
    if (response.status === 200 && response.data.errorCode == "1111") {
      window.location.href = '/login';
    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
)
app.config.globalProperties.$http = axios
app.config.globalProperties.$echarts = echarts
app.config.globalProperties.$urlObj = urlObj
app.use(router)
// app.use(VTouch)
// app.use(VueAwesomeSwiper)
app.use(Vuex)
app.use(store)
app.component('VuePlayerVideo', VuePlayerVideo)
app.mount('#app')