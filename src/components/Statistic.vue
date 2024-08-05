<template>
    <el-row class="statistic-child-card" :gutter="10" align="middle">
        <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2">
            <el-card>
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
                <el-statistic title="UPLOAD" :formatter="(v) => sizeFormatter(v, 'speed')" :value="ws_1s.NetUpSpeed">
                    <template #prefix>
                        <i class="bi-arrow-up"></i>
                    </template>
                </el-statistic>
            </el-card>
        </el-col>
        <el-col :xs="12" :sm="6" :md="4" :lg="3" :xl="2">
            <el-card>
                <el-statistic title="DOWNLOAD" :formatter="(v) => sizeFormatter(v, 'speed')"
                    :value="ws_1s.NetDownSpeed">
                    <template #prefix>
                        <i class="bi-arrow-down"></i>
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
    </el-row>
</template>

<script>
import { sizeFormatter } from '../utils.js'
export default {
    name: 'Statistic',
    props: {
        ws_1s: Object,
        ws_5s: Object
    },
    methods: {
        sizeFormatter: sizeFormatter
    }
}
</script>

<style type="text/css">
.statistic-child-card .el-card {
    height: 110px;
    margin-bottom: 10px;
}
</style>