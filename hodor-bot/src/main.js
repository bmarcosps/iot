import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)

import BootstrapVue from 'bootstrap-vue'

Vue.use(BootstrapVue);

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

new Vue({
  render: h => h(App)
}).$mount('#app')
