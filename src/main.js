import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Login from './components/Login.vue'
import Statistic from './components/Statistic.vue'
import Disks from './components/Disks.vue'
import Containers from './components/Containers.vue'
import Settings from './components/Settings.vue'
import Navs from './components/Navs.vue'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.component('Login', Login)
    .component('Statistic', Statistic)
    .component('Disks', Disks)
    .component('Containers', Containers)
    .component('Navs', Navs)
    .component('Settings', Settings)
    .mount('#app')

