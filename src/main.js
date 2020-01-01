import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

/* 注册路由标签 */
import VueRouter from "vue-router";
Vue.use(VueRouter);

/* 导入配置的路由对象 */
import router from "./router";

/** element ui */
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
