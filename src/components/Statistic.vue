<template>
    <el-row class="statistic-child-card" :gutter="10" align="middle">
        <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2">
            <el-card>
                <el-button text @click="show_cpu_detail = true" style="position: absolute;top: 0;right: 0;"><i
                        class="bi-list"></i></el-button>
                <el-statistic title="CPU" :value="ws_5s.CpuTemp">
                    <template #prefix>
                        <i class="bi-thermometer-half"></i>
                    </template>
                    <template #suffix>
                        <span style="font-size:12px">°C</span>
                    </template>
                </el-statistic>
                <el-progress style="margin-right: 10px;" :percentage="ws_1s.CpuLoad" />
            </el-card>
        </el-col>
        <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2">
            <el-card>
                <el-statistic title="MEM" :value="ws_1s.MemLoad">
                    <template #prefix>
                        <i class="bi-memory"></i>
                    </template>
                </el-statistic>
                <el-progress style="margin-right: 10px;" :percentage="ws_1s.MemLoad" />
            </el-card>
        </el-col>
        <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2">
            <el-card>
                <el-button text @click="show_net_setting = true" style="position: absolute;top: 0;right: 0;"><i
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
                <el-button text @click="show_net_setting = true" style="position: absolute;top: 0;right: 0;"><i
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
                <el-statistic title="MbTemp" :value="ws_5s.MbTemp">
                    <template #prefix>
                        <i class="bi-thermometer-half"></i>
                    </template>
                    <template #suffix>
                        <span style="font-size:12px">°C</span>
                    </template>
                </el-statistic>
            </el-card>
        </el-col>
        <el-col v-for="fan in ws_5s.Fans" :xs="12" :sm="6" :md="4" :lg="3" :xl="2">
            <el-card>
                <el-statistic :title="fan.Name" :value="fan.Speed">
                    <template #prefix>
                        <i class="bi-fan" style="font-size: 16px;"></i>
                    </template>
                    <template #suffix>
                        <span style="font-size: 12px;">RPM</span>
                    </template>
                </el-statistic>
            </el-card>
        </el-col>

        <el-dialog v-model="show_cpu_detail" align-center :width="isMobile ? '100%' : '50%'">
            <el-row>
                <el-col :span="12" v-for="l in ws_1s.CpuCoreLoads">
                    <el-progress :percentage="l" style="margin-bottom: 10px;" />
                </el-col>
            </el-row>
        </el-dialog>

        <el-dialog v-model="show_net_setting" align-center :width="isMobile ? '100%' : '500px'">
            <div v-for="speed, net in ws_1s.NetInfos">
                <el-checkbox :checked="!unselected_nets.includes(net)" @change="v => {
                    if (v) { unselected_nets = unselected_nets.filter(e => e !== net) } else { unselected_nets.push(net) } console.log(unselected_nets)
                }">
                    <template #default>
                        <el-text :style="isMobile ? 'width: 110px;' : ''" truncated>{{ net }} </el-text>
                        <el-divider direction="vertical" /><i class="bi-arrow-up"></i>{{
                            sizeFormatter(speed.UpSpeed,
                                'speed', false) }} <i class="bi-arrow-down"></i> {{
                            sizeFormatter(speed.DownSpeed,
                                'speed',
                                false) }}
                    </template>
                </el-checkbox>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>
import { sizeFormatter } from '../utils.js'
export default {
    name: 'Statistic',
    props: {
        ws_1s: Object,
        ws_5s: Object,
        isMobile: false,
    },
    data() {
        return { show_cpu_detail: false, unselected_nets: [], show_net_setting: false }
    },
    mounted() {
        console.log(this.ws_1s)
    },
    computed: {
        total_up_speed() {
            var res = 0
            if (this.ws_1s.NetInfos) {
                for (var k in this.ws_1s.NetInfos) {
                    if (this.unselected_nets.includes(k)) continue
                    res += this.ws_1s.NetInfos[k].UpSpeed
                }
            }
            return res
        },
        total_down_speed() {
            var res = 0
            if (this.ws_1s.NetInfos) {
                for (var k in this.ws_1s.NetInfos) {
                    if (this.unselected_nets.includes(k)) continue
                    res += this.ws_1s.NetInfos[k].DownSpeed
                }
            }
            return res
        }
    },
    methods: {
        sizeFormatter: sizeFormatter,
    }
}
</script>

<style type="text/css">
.statistic-child-card .el-card {
    position: relative;
    height: 110px;
    margin-bottom: 10px;
}
</style>