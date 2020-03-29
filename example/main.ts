import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VirtualList from 'packages/virtual-list/src'
import Render from 'packages/render/src'
import 'packages/virtual-list/src/virtual-list.scss'
Vue.component('VirtualList', VirtualList)
Vue.component('Render', Render)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
