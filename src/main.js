import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import VueRouter from 'vue-router'

Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.config.productionTip = false

//Routes
import Settings from './components/Settings.vue'
import Hello from './components/Hello.vue'
import ManageSlots from './components/ManageSlots.vue'
import ManageFreeSlots from './components/ManageFreeSlots.vue'

const routes = [
  { name:'settings', path: '/settings', component: Settings },
  { name: 'hello', path: '/hello', component: Hello },
  { name:'manageSlots', path: '/manageSlots', component: ManageSlots, props: true},
  { name:'manageFreeSlots', path: '/manageFreeSlots', component: ManageFreeSlots, props: true}
]

const router = new VueRouter({
  routes // short for `routes: routes`
})

new Vue({
  render: h => h(App, {
    template:"<app :id='id'></app>",
    props:{
    }
  }),
  router
}).$mount('#app')
