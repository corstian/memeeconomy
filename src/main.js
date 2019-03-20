import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import Graph from './Graph.js'
import VueApexCharts from 'vue-apexcharts'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/paper-kit.css'


Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(Graph, "https://memeeconomy.dokku.skyhop.org/graph", {});
Vue.use(VueApexCharts);

Vue.component('apexchart', VueApexCharts)

new Vue({
  render: h => h(App),
}).$mount('#app')
