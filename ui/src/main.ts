
import { createApp } from 'vue'
import {createBootstrap} from 'bootstrap-vue-next'
import HighchartsVue from 'highcharts-vue';

import App from './App.vue';
import router from './router';
import store from './store';

import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

createApp(App)
  .use(store)
  .use(router)
  .use(createBootstrap())
  .use(HighchartsVue)
  .mount('#app');