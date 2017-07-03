// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'assets/css/common.css'
window._ = require('lodash')

Vue.use(VueAxios,axios)
Vue.use(ElementUI)

axios.defaults.baseURL = 'http://weixinx.djtaoke.com'
// axios.defaults.withCredentials = true;

router.beforeEach((to, from, next) => {
  if(to.path != '/'){
    axios.get('http://tym.taoyumin.cn/index.php?r=user/checklogin',{withCredentials: true})
      .then((response) => {
        var data = response.data
        if(data.state == 1000){
          next()
        }
        else{
          next({
            path: '/'
          })
        }
      }, (response) => {
        console.log(response);
      });
  }
  else{
    next()
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
