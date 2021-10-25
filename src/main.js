// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import store from './store/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/main.css'
import 'babel-polyfill'   
// 转码使用的
import VCharts from 'v-charts'  
// 基于 Vue2.0 和 echarts 封装的 v-charts 图表组件
// 通过npm新装的依赖需要通过 npm install重新安装

Vue.use(ElementUI)
Vue.use(VCharts)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
