<template>
    <h1 v-if="!store.isMobile">Containers</h1>

    <el-row class="containers-child-card" :gutter="10" align="middle">
        <el-col v-for="container in store.ws_5s.Containers" :xs="24" :sm="12" :md="6" :lg="6" :xl="4">
            <el-card style="position: relative;">
                <template #header>
                    <el-row justify="space-between">
                        <el-col :span="20" style="">
                            <el-text style="font-weight: bold;" truncated>{{ container.Name }}</el-text>
                            <br />
                            <el-text style="font-weight:100" truncated><i class="bi-ethernet"
                                    style="margin-right: 4px;"></i>{{ container.Net }}</el-text>
                        </el-col>
                        <el-col :span="3" style="text-align: end;">
                            <i v-if="container.State == 'exited'" class="bi-stop-fill" style="color:#f0000c"></i>
                            <i v-if="container.State == 'running'" class="bi-play-fill" style="color:#4f8a10"></i>
                            <i v-if="container.State == 'paused'" class="bi-pause-fill" style="color:#e68a00"></i>
                        </el-col>
                    </el-row>
                </template>
                <el-row justify="space-evenly" :gutter="10" align="middle">
                    <el-col :span="12">
                        <el-row justify="space-evenly" align="middle">
                            <el-col :span="8" style="font-size: 12px;">CPU</el-col>
                            <el-col :span="16"><el-progress :percentage="container.CpuLoad"
                                    :format="(p) => p.toFixed(3) + '%'"></el-progress></el-col>
                        </el-row>
                        <el-row justify="space-evenly" align="middle">
                            <el-col :span="8" style="font-size: 12px;">MEM</el-col>
                            <el-col :span="16"><el-progress :percentage="container.MemLoad"
                                    :format="(p) => p.toFixed(3) + '%'"></el-progress></el-col>
                        </el-row>
                    </el-col>
                    <el-col :span="12" style="text-align: end;">
                        <el-button text circle
                            @click="() => { data.current_container = container; data.show_container_detail = true }"><i
                                class="bi-list"></i>
                        </el-button>
                        <el-button text circle
                            @click="() => { data.current_container = container; data.show_container_control = true }"><i
                                class="bi-gear"></i></el-button>
                    </el-col>
                </el-row>
                <div v-if="data.containers_in_option.has(container.ID)"
                    style="position: absolute; width: 100%; height: 100%; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(122, 122, 122, 0.8)">
                    <el-progress :indeterminate="true" :percentage="50" :show-text="false" :duration="1"
                        :stroke-width="10"
                        style="position: absolute; width: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%);" />
                </div>
            </el-card>
        </el-col>

        <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="4">
            <div class="el-card-div">
                <el-button size="large" style="padding: 20px;" @click="addNewContainer()">
                    <el-icon :size="25" color="rgb(0, 0, 0, 0.5)">
                        <Plus />
                    </el-icon>
                </el-button>
            </div>
        </el-col>
    </el-row>

    <el-dialog v-model="data.show_container_detail" :title="data.current_container.Name" align-center
        :width="store.isMobile ? '96%' : '65%'">
        <el-row>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <div style="font-size: 18px;margin-bottom: 16px;margin-top: 16px;">Port</div>
                <el-table :data="data.current_container.Ports">
                    <el-table-column prop="IP" label="ip"></el-table-column>
                    <el-table-column prop="PublicPort" label="host"></el-table-column>
                    <el-table-column prop="PrivatePort" label="container"></el-table-column>
                    <el-table-column prop="Type" label="type"></el-table-column>
                </el-table>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                <div style="font-size: 18px;margin-bottom: 16px;margin-top: 16px;">Volume</div>
                <!-- <div v-for="volume in current_container.Volumes">{{ volume }}</div> -->
                <el-table :data="data.current_container.Volumes">
                    <el-table-column prop="Source" label="host"></el-table-column>
                    <el-table-column prop="Destination" label="container"></el-table-column>
                    <el-table-column prop="Type" label="type"></el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </el-dialog>
    <el-dialog v-model="data.show_container_control" :title="data.current_container.Name" align-center
        :width="store.isMobile ? '96%' : '50%'">
        <el-button-group>
            <el-button v-if="data.current_container.State == 'exited'"
                @click="controlContainer(data.current_container.ID, 'start')"><i class="bi-play-fill"
                    style="color:#4f8a10;margin-right: 4px;"></i>Start</el-button>
            <el-button v-if="data.current_container.State == 'paused'"
                @click="controlContainer(data.current_container.ID, 'unpause')"><i class="bi-play-fill"
                    style="color:#4f8a10;margin-right: 4px;"></i>Resume</el-button>
            <el-button v-if="data.current_container.State == 'running'"
                @click="controlContainer(data.current_container.ID, 'stop')"><i class="bi-stop-fill"
                    style="color:#f0000c;margin-right: 4px;"></i>Stop</el-button>
            <el-button v-if="data.current_container.State == 'running'"
                @click="controlContainer(data.current_container.ID, 'pause')"><i class="bi-pause-fill"
                    style="color:#e68a00;margin-right: 4px;"></i>Pause</el-button>
            <el-button v-if="data.current_container.State != 'exited'"
                @click="controlContainer(data.current_container.ID, 'restart')"><i class="bi-arrow-repeat"
                    style="margin-right: 4px;"></i>Restart</el-button>
        </el-button-group>
    </el-dialog>
    <el-dialog v-model="data.show_add_container" title="Create Container" :fullscreen="store.isMobile" width="80%">
        <el-form :model="newContainer" label-width="auto" :label-position="store.isMobile ? 'top' : 'right'"
            :style="{ width: store.isMobile ? '100%' : '80%', 'margin-left': store.isMobile ? '0' : '10%' }">
            <el-form-item label="Name">
                <el-input v-model="newContainer.name"></el-input>
            </el-form-item>
            <el-form-item label="Image">
                <el-input v-model="newContainer.image"></el-input>
            </el-form-item>
            <el-form-item label="Net">
                <el-radio-group v-model="newContainer.net">
                    <el-radio :value="0">Host</el-radio>
                    <el-radio :value="1">Bridge</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="Privileged">
                <el-switch v-model="newContainer.privileged" />
            </el-form-item>


            <el-form-item v-for="(path, idx) in newContainer.paths" :label="'Path ' + idx + ':'">
                <el-text>Host: {{ path.host }} {{ '<-->' }} Container: {{ path.container }}</el-text>
                <el-button type="danger" style="margin-left: 10px;" text icon="Delete"
                    @click="newContainer.paths.splice(idx, 1)"></el-button>
            </el-form-item>

            <el-form-item v-for="(port, idx) in newContainer.ports" :label="'Port ' + idx + ':'">
                <el-text>Host: {{ port.host }} {{ '<-->' }} Container: {{ port.container }}</el-text>
                <el-button type="danger" style="margin-left: 10px;" text icon="Delete"
                    @click="newContainer.ports.splice(idx, 1)"></el-button>
            </el-form-item>

            <el-form-item v-for="(device, idx) in newContainer.devices" :label="'Device ' + idx + ':'">
                <el-text> {{ device.value }} </el-text>
                <el-button type="danger" style="margin-left: 10px;" text icon="Delete"
                    @click="newContainer.devices.splice(idx, 1)"></el-button>
            </el-form-item>

            <el-form-item v-for="(variable, idx) in newContainer.variables" :label="'Variable ' + idx + ':'">
                <el-text>{{ variable.key }}={{ variable.value }}</el-text>
                <el-button type="danger" style="margin-left: 10px;" text icon="Delete"
                    @click="newContainer.variables.splice(idx, 1)"></el-button>
            </el-form-item>


            <el-form-item label-width="95" v-if="data.adding_new_bind" :label="'New ' + data.bind_type">
                <el-col :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
                    <el-input v-model="data.bind_value_1"><template #prepend>{{ data.bind_key_1 }}</template></el-input>
                </el-col>
                <el-col v-if="data.bind_type != 'device'" :xs="2" :sm="2" :md="2" :lg="2" :xl="2"
                    style="height: 10px;"></el-col>
                <el-col v-if="data.bind_type != 'device'" :xs="24" :sm="24" :md="11" :lg="11" :xl="11">
                    <el-input v-model="data.bind_value_2"><template #prepend>{{ data.bind_key_2 }}</template></el-input>
                </el-col>
            </el-form-item>

            <el-form-item label="Add a new">
                <el-button-group>
                    <el-button v-for="s in ['path', 'port', 'variable', 'device']" size="small" @click="addNewBind(s)"
                        :type="data.bind_type == s ? 'primary' : ''">{{ s }}</el-button>
                    <el-button v-if="data.bind_type != ''" size="small" type="success"
                        @click="cofirmAddNewBind()">Cofirm</el-button>
                </el-button-group>
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="data.show_add_container = false">Cancel</el-button>
            <el-button type="primary" @click="cofirmAddNewContainer()">
                Confirm
            </el-button>
        </template>
    </el-dialog>

</template>

<script setup>
import { ref } from 'vue'
import { store } from '../store.js'

const data = ref({
    current_container: {},
    show_container_detail: false,
    show_container_control: false,
    show_add_container: false,
    adding_new_bind: false,
    bind_type: '',
    bind_key_1: '',
    bind_value_1: '',
    bind_key_2: '',
    bind_value_2: '',
    containers_in_option: new Set()
})

const newContainer = ref({
    name: '',
    image: '',
    net: 0,
    privileged: false,
    paths: [],
    ports: [],
    variables: [],
    devices: []
})

function controlContainer(container_id, method) {
    data.value.show_container_control = false
    data.value.containers_in_option = data.value.containers_in_option.add(container_id)
    const formData = new FormData()
    formData.append('id', container_id)
    formData.append('opt', method)
    store.post("/api/control-container", { id: container_id, opt: method }, function (response) {
        ElMessage(response.data)
        if (response.data.type == 'error') {
            store.unauth()
            return
        }
        if (data.value.containers_in_option.has(container_id))
            data.value.containers_in_option.delete(container_id)
    })
}

function addNewBind(bind_type) {
    data.value.adding_new_bind = true
    data.value.bind_type = bind_type
    data.value.bind_value_1 = ''
    data.value.bind_value_2 = ''
    if (['path', 'port'].includes(bind_type)) {
        data.value.bind_key_1 = 'host'
        data.value.bind_key_2 = 'container'
    }
    if (bind_type == 'variable') {
        data.value.bind_key_1 = 'key'
        data.value.bind_key_2 = 'value'
    }
    if (bind_type == 'device') {
        data.value.bind_key_1 = 'value'
    }
}

function cofirmAddNewBind() {
    if (data.value.bind_type == 'path') {
        if (data.value.bind_value_1 == '' || data.value.bind_value_2 == '') return
        newContainer.value.paths.push({ host: data.value.bind_value_1, container: data.value.bind_value_2 })
    }
    if (data.value.bind_type == 'port') {
        if (data.value.bind_value_1 == '' || data.value.bind_value_2 == '') return
        newContainer.value.ports.push({ host: data.value.bind_value_1, container: data.value.bind_value_2 })
    }
    if (data.value.bind_type == 'variable') {
        if (data.value.bind_value_1 == '' || data.value.bind_value_2 == '') return
        newContainer.value.variables.push({ key: data.value.bind_value_1, value: data.value.bind_value_2 })
    }
    if (data.value.bind_type == 'device') {
        if (data.value.bind_value_1 == '') return
        newContainer.value.devices.push({ value: data.value.bind_value_1 })
    }
    data.value.bind_value_1 = ''
    data.value.bind_value_2 = ''
}

function addNewContainer() {
    data.value.show_add_container = true
    newContainer.value.name = ''
    newContainer.value.image = ''
    newContainer.value.net = 0
    newContainer.value.privileged = false
    newContainer.value.paths = []
    newContainer.value.ports = []
    newContainer.value.devices = []
    newContainer.value.variables
}

function cofirmAddNewContainer() {
    if (newContainer.value.name == '' || newContainer.value.image == '') return
    data.value.show_add_container = false
    console.log('add new container')
}

// export default {
//     name: 'Containers',

//     data() {
//         return {
//             current_container: {},
//             show_container_detail: false,
//             show_container_control: false,
//             container_in_option: false
//         }
//     },
//     methods: {
//         sizeFormatter: sizeFormatter,
//         controlContainer(container_id, method) {
//             this.show_container_control = false
//             this.container_in_option = true
//             let that = this
//             const formData = new FormData()
//             formData.append('id', container_id)
//             formData.append('opt', method)
//             axios.post(import.meta.env.VITE_HTTP_URL + "/api/control-container", formData)
//                 .then(function (response) {
//                     ElMessage(response.data)
//                     that.container_in_option = false
//                 }).catch(function (error) {
//                     ElMessage(error.response.data)
//                     that.container_in_option = false
//                 })

//         }
//     }
// }
</script>

<style type="text/css">
.containers-child-card .el-card {
    margin-bottom: 10px;
}

.containers-child-card .el-card__header {
    padding: 10px;
}


.containers-child-card .el-card-div {
    height: 100px;
    position: relative;
    margin-bottom: 10px;
    display: grid;
    place-items: center;
}
</style>