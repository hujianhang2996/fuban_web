import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Statistic from './components/Statistic.vue'
import Disks from './components/Disks.vue'
import Containers from './components/Containers.vue'
import Navs from './components/Navs.vue'

createApp(App).component('Statistic', Statistic).component('Disks', Disks).component('Containers', Containers).component('Navs', Navs).mount('#app')

