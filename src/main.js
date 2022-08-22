import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import vuetify from "./plugins/vuetify";
import "./plugins";
import store from "./store";
import { sync } from "vuex-router-sync";
import apolloProvider from "./plugins/apollo";
import "@/permission";
Vue.config.productionTip = false;

sync(store, router);

new Vue({
  router,
  vuetify,
  store,
  apolloProvider,
  render: (h) => h(App),
}).$mount("#app");
