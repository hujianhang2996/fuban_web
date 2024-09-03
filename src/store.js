import { reactive } from 'vue'
import axios from 'axios'

export const store = reactive({
    authed: true,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    loading: true,
    tab_index: 0,
    ws: null,
    cpu_temp_name: "",
    mb_temp_name: "",
    logs: [],
    navs: [],
    unselected_nets: [],
    selected_sensors: [],
    ws_1s: {},
    ws_5s: {},
    init() {
        this.checkClientType()
        let that = this
        this.post("/auth", null, function (response) {
            switch (response.data.type) {
                case 'refresh':
                    localStorage.setItem('token', response.data.token)
                case 'success':
                    that.auth()
                    break
                case 'error':
                    that.unauth()
                default:
                    break
            }
        })
    },
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
        this.ws = new WebSocket(import.meta.env.VITE_WS_URL + "/api/ws?token=" + localStorage.getItem("token"))
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
    },
    closeWs() {
        if (!this.ws) {
            return
        }
        this.ws.close()
    },
    logout() {
        localStorage.removeItem('token')
        this.unauth()
    },
    auth() {
        this.authed = true
        this.openWs()
        let that = this
        this.post("/api/navs", null, function (response) {
            that.navs = response.data.data
        })
        this.post("/api/cpu_and_mem_temp", null, function (response) {
            that.cpu_temp_name = response.data.data.cpu_temp_name
            that.mb_temp_name = response.data.data.mb_temp_name
        })
        this.post("/api/unselected_nets", null, function (response) {
            that.unselected_nets = response.data.data
        })
        this.post("/api/selected_sensors", null, function (response) {
            that.selected_sensors = response.data.data
        })
    },
    unauth() {
        this.authed = false
        this.closeWs()
    },
    addLogs(msg) { this.logs.push(msg); if (this.logs.length >= 101) this.logs.shift() },
    post(url, data, cb) {
        axios({
            url: import.meta.env.VITE_HTTP_URL + url,
            method: 'post',
            data: data,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        }).then(cb)
    }
})

store.init()