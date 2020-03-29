import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VirtualList from 'packages/virtual-list'
import 'styles/virtual-list.scss'
Vue.component('VirtualList', VirtualList)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
