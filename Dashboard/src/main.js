import Vue from 'vue'
import App from './App.vue'

import router from './router'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/css/fontawesome-all.css'

Vue.use(BootstrapVue)

import VueMqtt from 'vue-mqtt';
Vue.use(VueMqtt, 'ws://test.mosquitto.org:8080/mqtt');

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
