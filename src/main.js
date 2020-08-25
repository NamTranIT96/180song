import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'
import 'element-ui/lib/theme-chalk/reset.css'

Vue.use(VueAxios, axios)
Vue.config.productionTip = false
Vue.use(ElementUI, {locale});


new Vue({
    render: h => h(App),
}).$mount('#app')
