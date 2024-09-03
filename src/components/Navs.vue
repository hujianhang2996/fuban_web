<template>
  <div style="width: 100%;text-align: end;margin-bottom: 10px">
    <el-button @click="navs_editing = !navs_editing" circle text>
      <el-icon>
        <Edit />
      </el-icon>
    </el-button>
    <el-button style="margin-left: 10px;" @click="openNavAdding" circle text>
      <el-icon>
        <Plus />
      </el-icon>
    </el-button>
  </div>
  <el-row class="navs-child-card" :gutter="10" align="middle">
    <el-col v-for="(nav, i) in store.navs" :xs="12" :sm="8" :md="6" :lg="3" :xl="2">
      <el-card shadow="hover" style="position: relative;" @click="openUrl(nav.url)" draggable="true"
        @dragstart="dragStartEvent(i)" @dragend="dragEndEvent(i)" @dragenter="dragEnterEvent(i)">
        <el-row align="middle" :gutter="10">
          <el-col :span="6" style="text-align: center;height: 30px;">
            <el-avatar :src="nav.icon" :size="30" />
          </el-col>
          <el-col :span="18" style="height: 21px;">
            <el-text truncated size="large">{{ nav.name }}</el-text>
          </el-col>
        </el-row>
        <div v-if="navs_editing"
          style="position: absolute; width: 100%; height: 100%; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(122, 122, 122, 0.8)">
          <el-button type="primary" style="position: absolute;top: 50%;left:20%;transform: translate(0, -50%);"
            @click="openNavSetting(nav)" circle><i class="bi-list"></i></el-button>
          <el-button type="danger" style="position: absolute;top: 50%;right:20%;transform: translate(0, -50%);"
            @click="deleteNav(nav.id)" circle><i class="bi-trash"></i></el-button>
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-dialog v-model="navs_setting" :width="store.isMobile ? '96%' : '600px'">
    <el-form :model="current_nav" label-width="auto" style="margin: 20px;">
      <el-form-item label="Name">
        <el-input v-model="current_nav.name" />
      </el-form-item>
      <el-form-item label="Url">
        <el-input v-model="current_nav.url" />
      </el-form-item>
      <el-form-item label="Icon">
        <el-input v-model="current_nav.icon">
          <template #append>
            <el-upload :show-file-list="false" :auto-upload="false" :on-change="uploadOnChange">
              <el-button><el-icon>
                  <Upload />
                </el-icon></el-button>
            </el-upload>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div>
        <el-button @click="navs_setting = false; navs_editing = false">Cancel</el-button>
        <el-button type="primary" @click="setOrAddNav">Confirm</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { store } from "../store"
import axios from 'axios'
const navs_editing = ref(false)
const navs_setting = ref(false)
const navs_adding = ref(false)
const current_nav = ref({
  name: "", url: "", icon: ""
})

const draggingNav = ref({})
const lastEnterIndex = ref(-1)
const dragging = ref(false)

function openUrl(url) {
  if (navs_editing.value) return
  window.open(url)
}

function openNavSetting(nav) {
  current_nav.value = nav
  navs_setting.value = true
  navs_adding.value = false
}

function openNavAdding() {
  current_nav.value = { name: "", url: "", icon: "" }
  navs_setting.value = true
  navs_adding.value = true
}

function setOrAddNav() {
  if (navs_adding.value) {
    axios({
      url: import.meta.env.VITE_HTTP_URL + "/api/add/nav",
      method: 'post',
      data: current_nav.value,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      ElMessage(response.data)
      axios({
        url: import.meta.env.VITE_HTTP_URL + "/api/navs",
        method: 'post',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(function (response) {
        console.log(response.data.data)
        store.navs = response.data.data
      })
    })
  } else {
    axios({
      url: import.meta.env.VITE_HTTP_URL + "/api/set/nav",
      method: 'post',
      data: current_nav.value,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      ElMessage(response.data)
      axios({
        url: import.meta.env.VITE_HTTP_URL + "/api/navs",
        method: 'post',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(function (response) {
        console.log(response.data.data)
        store.navs = response.data.data
      })
    })
  }
  navs_setting.value = false
  navs_editing.value = false
}

function deleteNav(id) {
  axios({
    url: import.meta.env.VITE_HTTP_URL + "/api/delete/nav",
    method: 'post',
    data: { "id": id },
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    ElMessage(response.data)
    navs_editing.value = false
    axios({
      url: import.meta.env.VITE_HTTP_URL + "/api/navs",
      method: 'post',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(function (response) {
      console.log(response.data.data)
      store.navs = response.data.data
    })
  })
}

function dragStartEvent(index) {
  draggingNav.value = store.navs[index]
  lastEnterIndex.value = index
  dragging.value = true
}

function dragEndEvent(index) {
  dragging.value = false
  if (draggingNav.value.pos == lastEnterIndex.value + 1) return
  axios({
    url: import.meta.env.VITE_HTTP_URL + "/api/set/switch_nav",
    method: 'post',
    data: { id: draggingNav.value.id, to: lastEnterIndex.value + 1 },
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    }
  }).then(function (response) {
    ElMessage(response.data)
    axios({
      url: import.meta.env.VITE_HTTP_URL + "/api/navs",
      method: 'post',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }).then(function (response) {
      store.navs = response.data.data
    })
  })
}

function dragEnterEvent(index) {
  store.navs.splice(lastEnterIndex.value, 1)
  store.navs.splice(index, 0, draggingNav.value)
  lastEnterIndex.value = index
}

function uploadOnChange(file, files) {
  console.log(file, ',', files)
  if (file == null) return
  var reader = new FileReader()
  reader.onload = function (e) {
    if (e.loaded) {
      current_nav.value.icon = this.result
    }
  }
  reader.readAsDataURL(file.raw)
}
</script>

<style type="text/css">
.navs-child-card .el-card {
  margin-bottom: 10px;
}

.navs-child-card .el-card__body {
  padding: 18px 10px;
}

.navs-child-card .el-card-div {
  position: relative;
  height: 90px;
  margin-bottom: 10px;
  display: grid;
  place-items: center;
}
</style>