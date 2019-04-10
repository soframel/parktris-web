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
const routes = [
  { path: '/settings', component: Settings },
  { path: '/hello', component: Hello }
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
