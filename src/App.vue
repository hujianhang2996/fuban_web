<template>
  <div v-if="false" style="position: fixed; left: 10px; bottom: 0; z-index: 100;">
    <el-form inline>
      <el-form-item>
        <el-button @click="openWs">Open</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="closeWs">Close</el-button>
      </el-form-item>
      <el-form-item>
        <el-input type="text" value="Hello world!" />
      </el-form-item>
      <el-form-item>
        <el-button>Send</el-button>
      </el-form-item>
    </el-form>
  </div>
  <el-container>
    <el-main v-if="isDesktop" v-loading="loading">
      <el-tabs v-model="tab_index">
        <el-tab-pane label="Main" :name="0" style="margin: 20px;">
          <h1>Statistic</h1>
          <Statistic :ws_1s="ws_1s" :ws_5s="ws_5s"></Statistic>
          <h1>Disks</h1>
          <Disks :ws_5s="ws_5s"></Disks>
          <h1>Containers</h1>
          <Containers :ws_5s="ws_5s"></Containers>
        </el-tab-pane>
        <el-tab-pane label="Navs" :name="1" style="margin: 20px;">
          <Navs :navs="navs"></Navs>
        </el-tab-pane>
        <el-tab-pane label="Logs" :name="2"></el-tab-pane>
      </el-tabs>
    </el-main>
    <el-main v-if="isMobile" v-loading="loading">
      <el-tabs v-model="tab_index" stretch>
        <el-tab-pane label="Statistic" :name="0">
          <Statistic :ws_1s="ws_1s" :ws_5s="ws_5s"></Statistic>
        </el-tab-pane>
        <el-tab-pane label="Disks" :name="1">
          <Disks :ws_5s="ws_5s"></Disks>
        </el-tab-pane>
        <el-tab-pane label="Containers" :name="2">
          <Containers :ws_5s="ws_5s"></Containers>
        </el-tab-pane>
        <el-tab-pane label="Navs" :name="3">
          <Navs :navs="navs"></Navs>
        </el-tab-pane>
        <el-tab-pane label="Logs" :name="4">
          <el-table :data="logs" height="80vh">
            <el-table-column>
              <template #default="scope">
                {{ scope.row }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </el-container>


</template>

<script>

export default {
  name: 'App',
  components: {},
  data() {
    return {
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      loading: true,
      tab_index: 0,
      ws: null,
      logs: [],
      navs: [
        { name: '迅雷', url: 'http://192.168.2.247:2345', icon: 'https://xfile2.a.88cdn.com/file/k/avatar/default' },
        { name: 'gitee', url: 'https://gitee.com', icon: 'https://gitee.com/favicon.ico' },
        { name: 'kimi', url: 'https://kimi.moonshot.cn/', icon: 'https://statics.moonshot.cn/kimi-chat/favicon.ico' },
        { name: '迅雷', url: 'http://192.168.2.247:2345', icon: 'https://xfile2.a.88cdn.com/file/k/avatar/default' },
        { name: 'gitee', url: 'https://gitee.com', icon: 'https://gitee.com/favicon.ico' },
        { name: 'kimi', url: 'https://kimi.moonshot.cn/', icon: 'https://statics.moonshot.cn/kimi-chat/favicon.ico' },
        { name: '迅雷', url: 'http://192.168.2.247:2345', icon: 'https://xfile2.a.88cdn.com/file/k/avatar/default' },
        { name: 'gitee', url: 'https://gitee.com', icon: 'https://gitee.com/favicon.ico' },
        { name: 'kimi', url: 'https://kimi.moonshot.cn/', icon: 'https://statics.moonshot.cn/kimi-chat/favicon.ico' }
      ],
      ws_1s: {},
      ws_5s: {}
    }
  },
  created() {
    this.checkClientType();
  },
  mounted() { this.openWs() },
  methods: {
    checkClientType() {
      const userAgent = navigator.userAgent;
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
        this.isMobile = true;
        this.isTablet = /iPad|Tablet/i.test(userAgent);
        this.isDesktop = false;
      } else {
        this.isDesktop = true;
      }
    },
    openWs() {
      if (this.ws) {
        return
      }
      this.ws = new WebSocket(import.meta.env.VITE_WS_URL + "start")
      let that = this
      this.ws.onopen = function (evt) {
        that.addLogs("OPEN")
      }
      this.ws.onclose = function (evt) {
        that.addLogs("CLOSE")
        that.ws = null
      }
      this.ws.onmessage = function (evt) {
        if (that.loading)
          that.loading = false
        that.addLogs(evt.data)
        let ws_json_data = JSON.parse(evt.data)
        if (ws_json_data.Type == 1) {
          that.ws_1s = ws_json_data
        }
        if (ws_json_data.Type == 5) {
          that.ws_5s = ws_json_data
        }
      }
      this.ws.onerror = function (evt) {
        that.addLogs("ERROR: " + evt.data)
      }
      return false
    },
    closeWs() {
      if (!this.ws) {
        return
      }
      this.ws.close()
      return
    },
    addLogs(msg) { this.logs.push(msg); if (this.logs.length >= 101) this.logs.shift(); },
  }
}
</script>
