import { createApp } from 'vue'
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue'
import "bootstrap/dist/css/bootstrap.min.css"
import HighchartsVue from 'highcharts-vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)

app.filter("localize", n =>
  Number(n).toLocaleString(undefined, { maximumFractionDigits: 8 })
);

app.use(BootstrapVue)
app.use(BootstrapVueIcons)
app.use(HighchartsVue)
app.use(router)
app.use(store)
app.mount('#app')
