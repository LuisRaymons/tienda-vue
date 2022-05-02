import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VuetifyConfirm from 'vuetify-confirm'

Vue.config.productionTip = false

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)
Vue.use(VuetifyConfirm, {
  vuetify,
  buttonTrueText: 'Aceptar',
  buttonFalseText: 'Cancelar',
  color: 'warning',
  icon: 'Eliminar',
  title: ' Registro',
  width: 400,
  property: '$confirm'
})


new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
