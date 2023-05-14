import App from './App.vue';
import router from './router';
import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import store from './store'; 
import 'ant-design-vue/dist/antd.css';

createApp(App)
	.use(Antd)
	.use(router)
	.use(store)
	.mount('#app')
