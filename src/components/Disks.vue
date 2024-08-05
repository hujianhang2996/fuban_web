<template>
    <el-row class="disks-child-card" :gutter="10" align="middle">
        <el-col v-for="disk in ws_5s.Disks" :xs="24" :sm="12" :md="6" :lg="6" :xl="4">
            <el-card>
                <template #header>
                    <el-row justify="space-between">
                        <el-col :span="20" style="font-weight: bold;"><el-text truncated>{{ disk.Name
                                }}</el-text></el-col>
                        <el-col :span="3" style="text-align: end;">{{ disk.Temp }}°C</el-col>
                    </el-row>
                </template>
                <el-row justify="space-evenly" :gutter="10" align="middle">
                    <el-col :span="12">
                        <el-text truncated line-clamp="2">
                            R: <br /> W:
                        </el-text>
                        <el-text truncated line-clamp="2" style="margin-left: 10px; text-align: end;">
                            {{ disk.ReadCount }} <br /> {{ disk.WriteCount }}
                        </el-text>
                    </el-col>
                    <el-col :span="12" style="text-align: right;">
                        <el-progress :percentage="((disk.TotalSize - disk.UsedSize) / disk.TotalSize * 100)"
                            :format="(p) => p.toFixed(0) + '%'" />
                        <el-text>{{ `(${sizeFormatter(disk.TotalSize -
                            disk.UsedSize,
                            'size')}/${sizeFormatter(disk.TotalSize,
                                'size')})` }}</el-text>
                    </el-col>
                </el-row>

            </el-card>
        </el-col>
    </el-row>
</template>

<script>
import { sizeFormatter } from '../utils.js'
export default {
    name: 'Disks',
    props: {
        ws_5s: Object
    },
    methods: {
        sizeFormatter: sizeFormatter
    }
}
</script>

<style type="text/css">
.disks-child-card .el-card {
    height: 130px;
    margin-bottom: 10px;
    position: relative;
}
</style>