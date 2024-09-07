<template>
    <h1 v-if="!store.isMobile">Statistic</h1>
    <div :style="store.isMobile ? '' : 'text-align: end;position: absolute;top:30px;right:25px;'">
        <el-text style="font-weight: bold;">{{ data.os_name }}</el-text>
        <!-- <el-text style="font-style: italic;">{{ ' ' + data.os_version }}</el-text> -->
        <el-button circle text style="margin-left: 8px;" icon="Setting" @click="data.show_setting_dialog = true">
        </el-button>
        <el-divider direction="vertical" />
        <el-text style="width: 250px;">{{ secondsFormatter(store.ws_1s.Uptime) }}</el-text>
    </div>
    <div style="height: 15px;"></div>
    <el-row class="statistic-child-card" :gutter="10" align="middle">
        <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2">
            <el-card>
                <el-button text @click="data.show_cpu_detail = true" style="position: absolute;top: 0;right: 0;"><i
                        class="bi-list"></i></el-button>
                <el-statistic title="CPU" :value="cpu_temp">
                    <template #prefix>
                        <i class="bi-thermometer-half"></i>
                    </template>
                    <template #suffix>
                        <span style="font-size:12px">°C</span>
                    </template>
                </el-statistic>
                <el-progress style="margin-right: 10px;" :percentage="store.ws_1s.CpuLoad" />
            </el-card>
        </el-col>
        <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2">
            <el-card>
                <el-statistic :title="`MEM(${sizeFormatter(store.ws_1s.MemTotal, 'size')})`"
                    :value="store.ws_1s.MemUsed" :formatter="v => sizeFormatter(v, 'size')">
                    <template #prefix>
                        <i class="bi-memory"></i>
                    </template>
                </el-statistic>
                <el-progress style="margin-right: 10px;"
                    :percentage="store.ws_1s.MemTotal ? Math.round(store.ws_1s.MemUsed / (store.ws_1s.MemTotal + 0.001) * 100) : 0" />
            </el-card>
        </el-col>
        <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2">
            <el-card>
                <el-button text @click="data.show_net_setting = true" style="position: absolute;top: 0;right: 0;"><i
                        class="bi-list"></i></el-button>
                <el-statistic :formatter="(v) => sizeFormatter(v, 'speed', false)" :value="total_up_speed">
                    <template #title>
                        UPLOAD <i class="bi-arrow-up"></i>
                    </template>
                </el-statistic>
            </el-card>
        </el-col>
        <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2">
            <el-card>
                <el-button text @click="data.show_net_setting = true" style="position: absolute;top: 0;right: 0;"><i
                        class="bi-list"></i></el-button>
                <el-statistic :formatter="(v) => sizeFormatter(v, 'speed', false)" :value="total_down_speed">
                    <template #title>
                        DOWNLOAD <i class="bi-arrow-down"></i>
                    </template>
                </el-statistic>
            </el-card>
        </el-col>
        <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2">
            <el-card>
                <el-button text @click="data.show_mb_setting = true" style="position: absolute;top: 0;right: 0;"><i
                        class="bi-list"></i></el-button>
                <el-statistic title="MbTemp" :value="mb_temp">
                    <template #prefix>
                        <i class="bi-thermometer-half"></i>
                    </template>
                    <template #suffix>
                        <span style="font-size:12px">°C</span>
                    </template>
                </el-statistic>
            </el-card>
        </el-col>
        <template v-for="sensor in store.selected_sensors">
            <el-col v-if="sensor.real_select" :xs="12" :sm="6" :md="4" :lg="3" :xl="2">
                <el-card>
                    <el-button text @click="showSensorEdit(sensor)" style="position: absolute;top: 0;right: 0;"><i
                            class="bi-list"></i></el-button>
                    <el-statistic :title="sensor.user_name" :value="getSensorValue(sensor.name, sensor.channel)"
                        group-separator="" :formatter="(v) => sensor.type == 'in' ? 1000 * v : v">
                        <template #prefix>
                            <i v-if="sensor.type == 'fan'" class="bi-fan" style="font-size: 16px;"></i>
                            <i v-if="sensor.type == 'temp'" class="bi-thermometer-half" style="font-size: 16px;"></i>
                            <i v-if="sensor.type == 'in'" class="bi-cpu" style="font-size: 16px;"></i>
                        </template>
                        <template #suffix>
                            <span v-if="sensor.type == 'fan'" style="font-size: 12px;">RPM</span>
                            <span v-if="sensor.type == 'temp'" style="font-size:12px">°C</span>
                            <span v-if="sensor.type == 'in'" style="font-size:12px">mV</span>
                        </template>
                    </el-statistic>
                </el-card>
            </el-col>
        </template>

        <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2">
            <div class="el-card-div">
                <el-button size="large" style="padding: 20px;" @click="data.show_sensor_setting = true;">
                    <el-icon :size="25" color="rgb(0, 0, 0, 0.5)">
                        <Plus />
                    </el-icon>
                </el-button>
            </div>
        </el-col>

        <el-dialog v-model="data.show_cpu_detail" :title="data.cpu_name" align-center
            :width="store.isMobile ? '96%' : '65%'">
            <el-row>
                <el-col :span="12" v-for="l in store.ws_1s.CpuCoreLoads">
                    <el-progress :percentage="l" style="margin-bottom: 10px;" />
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <div style="font-size: 18px;margin-bottom: 16px;margin-top: 16px;">Choose tempurature source</div>
            <el-form>
                <el-form-item label="CPU">
                    <el-select v-model="store.cpu_temp_name" placeholder="Select" style="width: 240px">
                        <el-option v-for="temp_num, temp_name in store.ws_5s.Temps" :key="temp_name" :value="temp_name">
                            <template #default>
                                {{ temp_name }}<el-divider direction="vertical" />{{ temp_num.Temperature }}°C
                            </template>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div>
                    <el-button @click="data.show_cpu_detail = false">Cancel</el-button>
                    <el-button type="primary" @click="changeCpuMbTempName">
                        Confirm
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="data.show_mb_setting" title="Choose tempurature source" align-center
            :width="store.isMobile ? '96%' : '50%'">
            <el-form>
                <el-form-item label="MB">
                    <el-select v-model="store.mb_temp_name" placeholder="Select" style="width: 240px">
                        <el-option v-for="temp_num, temp_name in store.ws_5s.Temps" :key="temp_name" :value="temp_name">
                            <template #default>
                                {{ temp_name }}<el-divider direction="vertical" />{{ temp_num.Temperature }}°C
                            </template>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div>
                    <el-button @click="data.show_mb_setting = false">Cancel</el-button>
                    <el-button type="primary" @click="changeCpuMbTempName">
                        Confirm
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="data.show_net_setting" title="Select net port" align-center
            :width="store.isMobile ? '96%' : '500px'">
            <div v-for="speed, net in store.ws_1s.NetInfos">
                <el-checkbox :checked="!store.unselected_nets.includes(net)" @change="v => {
                    if (v) { store.unselected_nets = store.unselected_nets.filter(e => e !== net) } else { store.unselected_nets.push(net) }
                }">
                    <template #default>
                        <el-text :style="store.isMobile ? 'width: 110px;' : ''" truncated>{{ net }} </el-text>
                        <el-divider direction="vertical" /><i class="bi-arrow-up"></i>
                        <el-text truncated>{{
                            sizeFormatter(speed.UpSpeed,
                                'speed', false) }}</el-text> <i class="bi-arrow-down"></i> <el-text truncated>{{
                                sizeFormatter(speed.DownSpeed,
                                    'speed',
                                    false) }}</el-text>
                    </template>
                </el-checkbox>
            </div>
            <template #footer>
                <div>
                    <el-button @click="data.show_net_setting = false">Cancel</el-button>
                    <el-button type="primary" @click="changeUnselectedNets">
                        Confirm
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="data.show_sensor_setting" align-center :width="store.isMobile ? '96%' : '600px'"
            style="height: 80vh;overflow: auto;">
            <template #header>Add sensors</template>
            <el-table :data="store.ws_5s.Sensors" :size="store.isMobile ? 'small' : 'default'">
                <el-table-column width="40">
                    <template #default="scope">
                        <el-button text circle style="padding: 0;"
                            @click="switchSensorSelect(scope.row.Name, selectedChannel(scope.row.Name), scope.row.Type)">
                            <el-icon>
                                <Select v-if="sensorIsSelected(scope.row.Name)" />
                                <Plus v-else />
                            </el-icon>
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="Sensor Name"
                    :filters="[{ value: 'fan', text: 'fan' }, { value: 'temp', text: 'temp' }, { value: 'in', text: 'in' }]"
                    :filter-method="(value, row, column) => row.Type === value">
                    <template #default="scope">
                        {{ scope.row.Name }}
                        <i v-if="scope.row.Type == 'fan'" class="bi-fan"></i>
                        <i v-if="scope.row.Type == 'temp'" class="bi-thermometer-half"></i>
                        <i v-if="scope.row.Type == 'in'" class="bi-cpu"></i>
                    </template>
                </el-table-column>
                <el-table-column label="Channel" width="125">
                    <template #default="scope">
                        <el-select :model-value="selectedChannel(scope.row.Name)"
                            @change="(v) => changeSelectedChannel(scope.row.Name, v)"
                            :size="store.isMobile ? 'small' : 'default'" style="width: 100px">
                            <el-option v-for="v in scope.row.Values" :label="v.Name + ': ' + v.Value"
                                :value="v.Name"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog v-model="data.show_sensor_edit" align-center :width="store.isMobile ? '96%' : '600px'">
            <template #header>
                <el-text style="font-weight: bold;">Sensor {{ data.current_editing_sensor.name }}</el-text>
            </template>
            <el-form :model="data.current_editing_sensor" label-width="auto" style="margin: 0 30px;">
                <el-form-item label="Rename">
                    <el-input v-model="data.current_editing_sensor.user_name"></el-input>
                </el-form-item>
                <el-form-item label="Select view type">
                    <el-select v-model="data.current_editing_sensor.type">
                        <el-option
                            v-for="item in [{ value: 'fan', text: 'fan' }, { value: 'temp', text: 'temp' }, { value: 'in', text: 'in' }]"
                            :key="item.value" :label="item.text" :value="item.value" />
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div>
                    <el-button @click="data.show_sensor_edit = false">Cancel</el-button>
                    <el-button type="primary" @click="changeSelectedSensor">
                        Confirm
                    </el-button>
                </div>
            </template>
        </el-dialog>


        <el-dialog v-model="data.show_setting_dialog" align-center :width="store.isMobile ? '96%' : '500px'">
            <Settings></Settings>
            <el-form>
                <el-form-item v-if="data.show_logout_dialog">
                    <el-button @click="data.show_logout_dialog = false">Cancel</el-button>
                    <el-button type="primary" @click="() => { data.show_logout_dialog = false; store.logout() }">
                        Confirm
                    </el-button>
                </el-form-item>
                <el-form-item v-else>
                    <el-button type="primary" icon="SwitchButton"
                        @click="data.show_logout_dialog = true">logout</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- <el-dialog v-model="data.show_logout_dialog" align-center :width="store.isMobile ? '96%' : '500px'">
            <span>Logout?</span>
            <template #footer>
                <div>
                    <el-button @click="data.show_logout_dialog = false">Cancel</el-button>
                    <el-button type="primary" @click="() => { data.show_logout_dialog = false; store.logout() }">
                        Confirm
                    </el-button>
                </div>
            </template>
        </el-dialog> -->
    </el-row>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { store } from "../store"
import { sizeFormatter } from '../utils.js'
import axios from 'axios'
import { ElMessage } from 'element-plus';

const data = ref({
    show_cpu_detail: false,
    show_net_setting: false,
    show_mb_setting: false,
    show_sensor_setting: false,
    show_sensor_edit: false,
    show_setting_dialog: false,
    show_logout_dialog: false,
    current_editing_sensor: null,
    cpu_name: '',
    os_name: '',
    os_version: '',
})

watch(
    () => data.value.show_setting_dialog,
    () => {
        if (!data.value.show_setting_dialog)
            data.value.show_logout_dialog = false
    })

onMounted(() => {
    if (!store.authed) return
    axios({
        url: import.meta.env.VITE_HTTP_URL + "/api/system_info",
        method: 'post',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(function (response) {
        if (response.data.type == 'error') {
            store.unauth()
            return
        }
        if (response.data.CpuInfos.length > 0) {
            data.value.cpu_name = response.data.CpuInfos[0].modelName
        }
        data.value.os_name = response.data.HostInfo.kernelVersion
        data.value.os_version = response.data.HostInfo.platformVersion
    })
})

const total_up_speed = computed(() => {
    var res = 0
    if (store.ws_1s.NetInfos) {
        for (var k in store.ws_1s.NetInfos) {
            if (store.unselected_nets.includes(k)) continue
            res += store.ws_1s.NetInfos[k].UpSpeed
        }
    }
    return res
})

const total_down_speed = computed(() => {
    var res = 0
    if (store.ws_1s.NetInfos) {
        for (var k in store.ws_1s.NetInfos) {
            if (store.unselected_nets.includes(k)) continue
            res += store.ws_1s.NetInfos[k].DownSpeed
        }
    }
    return res
})
const cpu_temp = computed(() => {
    if (store.cpu_temp_name) {
        if (store.ws_5s.Temps) {
            return store.ws_5s.Temps[store.cpu_temp_name].Temperature
        }
    }
    return -1
})
const mb_temp = computed(() => {
    if (store.mb_temp_name) {
        if (store.ws_5s.Temps) {
            return store.ws_5s.Temps[store.mb_temp_name].Temperature
        }
    }
    return -1
})

function secondsFormatter(seconds) {
    if (seconds == undefined) return ''
    const d = Math.floor(seconds / 3600 / 24)
    const h = Math.floor((seconds % (3600 * 24)) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${d == 0 ? '' : d + 'Day '}${h == 0 ? '' : h + 'H '}${m == 0 ? '' : m + 'm '}${s == 0 ? '' : s + 's'}`;
}

function sensorIsSelected(sensor_name) {
    for (var i in store.selected_sensors) {
        if (sensor_name == store.selected_sensors[i].name && store.selected_sensors[i].real_select) return true
    }
    return false
}

function selectedChannel(sensor_name) {
    for (var i in store.selected_sensors) {
        if (sensor_name == store.selected_sensors[i].name) return store.selected_sensors[i].channel
    }
    return "input"
}

function switchSensorSelect(sensor_name, channel, sensor_type) {
    for (var i in store.selected_sensors) {
        if (sensor_name == store.selected_sensors[i].name) {
            store.selected_sensors[i].real_select = !store.selected_sensors[i].real_select
            store.post("/api/set/selected_sensor", store.selected_sensors[i])
            return
        }
    }
    store.selected_sensors.push({ name: sensor_name, user_name: sensor_name, type: sensor_type, channel: channel, real_select: true })
    store.post("/api/add/selected_sensor", { name: sensor_name, user_name: sensor_name, type: sensor_type, channel: channel, real_select: true })
}

function showSensorEdit(sensor) {
    data.value.current_editing_sensor = sensor
    data.value.show_sensor_edit = true
}

function changeSelectedChannel(sensor_name, channel) {
    for (var i in store.selected_sensors) {
        if (sensor_name == store.selected_sensors[i].name) {
            store.selected_sensors[i]["channel"] = channel
            store.post("/api/set/selected_sensor", store.selected_sensors[i])
            return
        }
    }
    store.selected_sensors.push({ name: sensor_name, channel: channel, real_select: false })
    store.post("/api/add/selected_sensor", { name: sensor_name, channel: channel, real_select: false })
}

function getSensorValue(sensor_name, channel) {
    if (store.ws_5s.Sensors) {
        for (var i in store.ws_5s.Sensors) {
            if (sensor_name == store.ws_5s.Sensors[i].Name) {
                for (var j in store.ws_5s.Sensors[i].Values) {
                    if (channel == store.ws_5s.Sensors[i].Values[j].Name) {
                        return store.ws_5s.Sensors[i].Values[j].Value
                    }
                }
            }
        }
    }
    return -1
}

function changeUnselectedNets() {
    store.post("/api/set/unselected_nets", { unselected_nets: store.unselected_nets.join(",") }, function (response) {
        ElMessage(response.data)
    })
    data.value.show_net_setting = false
}

function changeSelectedSensor() {
    if (data.value.current_editing_sensor.user_name.trim() == "") return
    store.post("/api/set/selected_sensor", data.value.current_editing_sensor, function (response) {
        ElMessage(response.data)
    })
    data.value.show_sensor_edit = false
}

function changeCpuMbTempName() {
    store.post("/api/set/cpu_and_mb_temp", { cpu: store.cpu_temp_name, mb: store.mb_temp_name }, function (response) {
        ElMessage(response.data)
    })
    data.value.show_cpu_detail = false
    data.value.show_mb_setting = false
}
</script>

<style type="text/css">
.statistic-child-card .el-card {
    position: relative;
    height: 90px;
    margin-bottom: 10px;
}

.statistic-child-card .el-card-div {
    position: relative;
    height: 90px;
    margin-bottom: 10px;
    display: grid;
    place-items: center;
}
</style>