<template>
  <div v-if="!store.authed">
    <Login></Login>
  </div>
  <el-container v-else>
    <el-main v-if="!store.isMobile" v-loading="store.loading">
      <el-tabs v-model="store.tab_index">
        <el-tab-pane label="Main" :name="0" style="margin: 20px;">
          <Statistic></Statistic>
          <Disks></Disks>
          <Containers></Containers>
        </el-tab-pane>
        <el-tab-pane label="Navs" :name="1" style="margin: 20px;">
          <Navs></Navs>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <el-main v-if="store.isMobile" v-loading="store.loading">
      <el-tabs v-model="store.tab_index" stretch>
        <el-tab-pane label="Statistic" :name="0">
          <Statistic></Statistic>
        </el-tab-pane>
        <el-tab-pane label="Disks" :name="1">
          <Disks></Disks>
        </el-tab-pane>
        <el-tab-pane label="Containers" :name="2">
          <Containers></Containers>
        </el-tab-pane>
        <el-tab-pane label="Navs" :name="3">
          <Navs></Navs>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>
</template>

<script setup>
import { store } from './store'

</script>

<style></style>
