<template>
    <el-row class="containers-child-card" :gutter="10" align="middle">
        <el-col v-for="container in ws_5s.Containers" :xs="24" :sm="12" :md="6" :lg="6" :xl="4">
            <el-card>
                <template #header>
                    <el-row justify="space-between">
                        <el-col :span="20">
                            <div>
                                <span style="margin-right: 10px;font-weight: bold;">{{ container.Name }}</span>
                                <i class="bi-ethernet" style="margin-right: 4px;"></i>
                                <span style="font-weight:100">{{ container.HostNet ? 'host' : 'bridge' }}</span>
                            </div>
                        </el-col>
                        <el-col :span="3" style="text-align: end;">
                            <i v-if="container.Status == 0" class="bi-stop-fill" style="color:#f0000c"></i>
                            <i v-if="container.Status == 1" class="bi-play-fill" style="color:#4f8a10"></i>
                            <i v-if="container.Status == 2" class="bi-pause-fill" style="color:#e68a00"></i>
                            <i v-if="container.Status == 3" class="bi-arrow-repeat" style="color:#e68a00"></i>
                        </el-col>
                    </el-row>
                </template>
                <el-row justify="space-evenly" :gutter="10" align="middle">
                    <el-col :span="12" style="overflow:hidden">
                        <el-link @click="() => { current_container = container; dialogVisible = true }">
                            <el-text type="primary" truncated line-clamp="2">
                                {{ container.Port }} <br /> {{ container.Volume }}
                            </el-text>
                        </el-link>
                    </el-col>
                    <el-col :span="12" style="overflow:hidden">
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
                </el-row>
            </el-card>
        </el-col>
    </el-row>

    <el-dialog v-model="dialogVisible" title="Port and Volume" align-center>
        <div>{{ current_container.Port }}</div>
        <div>{{ current_container.Volume }}</div>
    </el-dialog>
</template>

<script>
import { sizeFormatter } from '../utils.js'
export default {
    name: 'Containers',
    props: {
        ws_5s: Object
    },
    data() {
        return {
            current_container: null,
            dialogVisible: false
        }
    },
    methods: {
        sizeFormatter: sizeFormatter
    }
}
</script>

<style type="text/css">
.containers-child-card .el-card {
    height: 130px;
    margin-bottom: 10px;
}
</style>