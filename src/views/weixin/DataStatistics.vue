<template>
    <div class="statistics">
        <el-row :gutter="20">
            <el-col :span="20">
                <div class="block" style="margin-bottom:20px;">
                    <span>选择时间范围</span>
                    <el-date-picker v-model="start" type="datetime" placeholder="选择起始日期时间"></el-date-picker>-
                    <el-date-picker v-model="end" type="datetime" placeholder="选择结束日期时间"></el-date-picker>
                    <el-button type="primary" @click="isinit(0),limitbt()" :disabled="stopbt">查询</el-button>
                </div>
            </el-col>
            <el-col :span="4">
                <span style="color:red">{{ tie }}</span>后刷新
            </el-col>
        </el-row>
        <div class="quickbtn" style="margin-bottom:20px;">
            <el-select v-model="lbTypenum" placeholder="请选择" @change="getdata()">
                <el-option 
                v-for="item in lbType" 
                :key="item.liebianType" 
                :label="item.desc" 
                :value="item.liebianType">
                </el-option>
            </el-select>
            <el-button type="primary" @click="isinit(1)">距当前一天</el-button>
            <el-button type="primary" @click="isinit(3)">距当前三天</el-button>
            <el-button type="primary" @click="isinit(7)">距当前七天</el-button>
            <el-button type="primary" @click="realtime">实时</el-button>
        </div>
        <div id="myChart" :style="{width:'1200px', height:'400px'}"></div>
        <div style="background:#eef1f6;margin-top:20px;">
            <el-button type="text" @click="getcomplete(1)" v-bind:style="{background:backcolor1}">与前一天比较</el-button>
            <el-button type="text" @click="getcomplete(7)" v-bind:style="{background:backcolor7}">与前一周比较</el-button>
        </div>
        <el-row>
            <el-col :span="12">
                <CNewadd :startN="startN" :endN="endN" :tiee="tie" :complete="completeNum" :typenum="lbTypenum"></CNewadd>
            </el-col>
            <el-col :span="12">
                <Sharepic :startN="startN" :endN="endN" :tiee="tie" :complete="completeNum" :typenum="lbTypenum"></Sharepic>
            </el-col>
        </el-row>
         <el-row>
            <el-col :span="12">
                <PVss :startN="startN" :endN="endN" :tiee="tie" :complete="completeNum" :typenum="lbTypenum"></PVss>
            </el-col>
            <el-col :span="12">
                <UVss :startN="startN" :endN="endN" :tiee="tie" :complete="completeNum" :typenum="lbTypenum"></UVss>
            </el-col>
        </el-row> 
        <!-- <CNewadd :startN="startN" :endN="endN" :tiee="tie" :complete="completeNum"></CNewadd>
          <Sharepic :startN="startN" :endN="endN" :tiee="tie" :complete="completeNum"></Sharepic> -->
    </div>
</template>

<script>
// let echarts = require('echarts/lib/echarts');      // 引入基本模块
// require('echarts/lib/chart/line');                 // 引入折线图组件
// require('echarts/lib/component/tooltip');          // 提示框
// require('echarts/lib/component/toolbox');
// require('echarts/lib/component/title');            // title组件
import echarts from 'echarts'
import CNewadd from './NewaddComplete'
import Sharepic from './SharePicComplete'
import PVss from './PVComplete'
import UVss from './UVComplete'

export default {
    name: 'data_statistics',
    data() {
        return {
            start: null,
            end: null,
            startN: null,
            endN: null,
            friendlist: [],
            friendtime: [],
            sharelist: [],
            alllist: [],
            myChart: null,
            _init: 0,
            friendsmul: 0,
            sharemul: 0,
            stopbt: false,
            tie: 60,
            timer: null,
            proportion: [],
            completeNum: 1,   // 通过这个变量来判断是比较一天数据还是一周数据
            backcolor1: '#005494',
            backcolor7: null,
            lbTypenum: 0,
            lbType: [],
            PVlist:[],
            PVmul:0,
            UVlist:[],
            UVmul:0,
            numPack:[]
        }
    },
    components: {
        CNewadd,
        Sharepic,
        PVss,
        UVss
    },
    mounted() {
        this.drawLine();
    },
    methods: {
        otherchart:function(){
            var self = this;
            var alllist= null;
            var PVtime = [];
            this.axios.post('/monitor/get_data', {
                typeId: 2,
                startTime: self.startN,
                endTime: self.endN,
                liebianType: self.lbTypenum
            })
                .then(function (res) {
                    self.PVlist = [];
                    self.PVmul = 0;
                    var data = res.data;
                    if (data.code == 0) {
                        alllist = data.data;
                        for (var i in alllist) {
                            self.PVlist.push(alllist[i].data);
                            PVtime.push(self.formate(alllist[i].timeSeries));
                            self.PVmul = self.PVmul + alllist[i].data;
                        }
                            self.myChart.setOption({
                                xAxis: {
                                    data: PVtime
                                },
                                series: [{
                                    name: 'PV',
                                    data: self.PVlist
                                }]
                            })
                            self.otherUV();

                    }
                })
        },
        otherUV:function(){
            var self = this;
            var alllist= null;
            var UVtime = [];
            this.axios.post('/monitor/get_data', {
                typeId: 3,
                startTime: self.startN,
                endTime: self.endN,
                liebianType: self.lbTypenum
            })
                .then(function (res) {
                    self.UVlist = [];
                    self.UVmul = 0;
                    var data = res.data;
                    if (data.code == 0) {
                        alllist = data.data;
                        for (var i in alllist) {
                            self.UVlist.push(alllist[i].data);
                            UVtime.push(self.formate(alllist[i].timeSeries));
                            self.UVmul = self.UVmul + alllist[i].data;
                        }
                            self.myChart.setOption({
                                title: {
                                    subtext: '截图分享总数: ' + self.sharemul + '\n' + '新加好友总数: ' + self.friendsmul + '\n' + 'PV: ' + self.PVmul + '\n' + 'UV: ' + self.UVmul
                                },
                                xAxis: {
                                    data: UVtime
                                },
                                series: [{
                                    name: 'UV',
                                    data: self.UVlist
                                }]
                            })

                    }
                })  
        },
        getcomplete: function (val) {      // 判断是比较一天数据还是一周数据的函数
            if (val == 1) {
                this.completeNum = val;
                this.backcolor1 = '#005494';
                this.backcolor7 = null;
            }
            else {
                this.completeNum = val;
                this.backcolor1 = null;
                this.backcolor7 = '#005494';
            }
        },
        realtime: function () {         // 实时按钮
            this._init = 1;
            var time = Date.now() / 1000;
            var today = new Date(this.fortime(time)).getTime() / 1000;
            this.start = this.formate(today);
            this.end = this.formate(Number.parseInt(time));
            this.startN = today;
            this.endN = Number.parseInt(time);
            this.getdata();
        },
        isinit: function (val) {    // 当按具体时间段查询时
            this._init = 0;
            var time = Date.now() / 1000;
            if (val == 0) {
                this.getdata();
            }
            else if (val == 1) {
                this.startN = new Date(this.fortime(time - 86400)).getTime() / 1000;
                this.start = this.formate(this.startN);
                this.endN = Number.parseInt(time);
                this.end = this.formate(this.endN);
                this.getdata();
            }
            else if (val == 3) {
                this.startN = new Date(this.fortime(time - 259200)).getTime() / 1000;
                this.start = this.formate(this.startN);
                this.endN = Number.parseInt(time);
                this.end = this.formate(this.endN);
                this.getdata();
            }
            else {
                this.startN = new Date(this.fortime(time - 604800)).getTime() / 1000;
                this.start = this.formate(this.startN);
                this.endN = Number.parseInt(time);
                this.end = this.formate(this.endN);
                this.getdata();
            }
        },
        limitbt: function () {
            var self = this;
            console.log(this.stopbt);
            this.stopbt = true;
            // console.log(this.stopbt);
            setTimeout(function () {
                self.stopbt = false;
            }, 3000);
            // this.getdata();
        },
        formate: function (t) {
            var d = new Date(t * 1000);
            var year = d.getFullYear();
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var hour = d.getHours();
            var minute = d.getMinutes();
            var f = year + "-" + this.init(month) + "-" + this.init(day) + " " + this.init(hour) + ":" + this.init(minute);
            return f;
        },
        init: function (d) {
            return d > 9 ? d : "0" + d;
        },
        getdata: function () {

            var self = this;
            if (this._init == 0) {
                this.start = this.fortime(new Date(this.start).getTime() / 1000);
                console.log(this.start);
                self.startN = Math.floor(new Date(this.start).getTime() / 1000);
                self.endN = Math.floor(new Date(this.end).getTime() / 1000);
                console.log(self.startN);
                console.log(self.endN);
            }

            if (self.endN - self.startN > 2678400) {
                self.$message("请选择一个月内时间段");
                return false;
            }
            else if ((self.start == null || self.start == null) && self._init == 0) {
                self.$message("请选择时间");
                return false;
            }
            else {
                this.axios.post('/monitor/get_data', {
                    typeId: 0,
                    startTime: self.startN,
                    endTime: self.endN,
                    liebianType: self.lbTypenum
                })
                    .then(function (res) {
                        var data = res.data;
                        self.friendlist = [];
                        self.friendtime = [];
                        self.friendsmul = 0;
                        self.sharemul = 0;
                        if(data.data == null){
                            self.otherchart();
                            return false;
                        }
                        else{
                            if (data.code == 0) {
                                self.alllist = data.data;
                                for (var i in self.alllist) {
                                    self.friendlist.push(self.alllist[i].data);
                                    self.friendtime.push(self.formate(self.alllist[i].timeSeries));
                                    self.friendsmul = self.friendsmul + self.alllist[i].data;
                                }
                                self.myChart.setOption({
                                    xAxis: {
                                        data: self.friendtime
                                    },
                                    series: [{
                                        name: '每小时新加好友数',
                                        data: self.friendlist
                                    }]
                                })
                                self.getdataPV();

                                console.log(self.friendlist);
                            }
                            else {
                                self.$message("获取失败");
                            }
                        }
                    })
            }
        },
        getdatapic: function () {
            var self = this;
            // self.startN = Math.floor(new Date(this.start).getTime() / 1000);
            // self.endN = Math.floor(new Date(this.end).getTime() / 1000);

            this.axios.post('/monitor/get_data', {
                typeId: 1,
                startTime: self.startN,
                endTime: self.endN,
                liebianType: self.lbTypenum
            })
                .then(function (res) {
                    self.alllist = [];
                    self.sharelist = [];
                    self.proportion = [];
                    self.sharemul = 0;
                    var data = res.data;
                    if (data.code == 0) {
                        self.alllist = data.data;
                        for (var i in self.alllist) {
                            self.sharelist.push(self.alllist[i].data);
                            self.sharemul = self.sharemul + self.alllist[i].data;
                            // self.proportion.push(Number((self.alllist[i].data/self.friendlist[i]).toString().match(/^\d+(?:\.\d{0,2})?/)));
                            self.proportion.push(Math.floor((self.alllist[i].data / self.friendlist[i] * 100) * 100) / 100);
                        }
                        self.myChart.setOption({
                            title: {
                                subtext: '截图分享总数: ' + self.sharemul + '\n' + '新加好友总数: ' + self.friendsmul + '\n' + 'PV: ' + self.PVmul + '\n' + 'UV: ' + self.UVmul
                            },
                            tooltip: {
                                formatter: '时间: {b0}<br />{a0}: {c0}<br />{a1}: {c1}<br />分享占比: {c2}%<br />{a3}: {c3}<br />{a4}: {c4}'
                            },
                            xAxis: {
                                data: self.friendtime
                            },
                            series: [{
                                name: '每小时用户截图分享数',
                                data: self.sharelist
                            }, {
                                name: '占比',
                                data: self.proportion
                            }]
                        })
                    }
                })
        },
        getdataPV: function () {
            var self = this;
            var alllist= null;
            var PVtime = [];
            this.axios.post('/monitor/get_data', {
                typeId: 2,
                startTime: self.startN,
                endTime: self.endN,
                liebianType: self.lbTypenum
            })
                .then(function (res) {
                    self.PVlist = [];
                    self.PVmul = 0;
                    var data = res.data;
                    if (data.code == 0) {
                        alllist = data.data;
                        for (var i in alllist) {
                            // self.PVlist.push(alllist[i].data);
                            PVtime.push(self.formate(alllist[i].timeSeries));
                            self.PVmul = self.PVmul + alllist[i].data;
                        }
                        for(var i=0; i< self.friendlist.length; i++){
                            self.PVlist.push(0);
                        }
                        for(var i=0; i< self.friendtime.length; i++){
                            for(var j=0; j< PVtime.length; j++){
                                if(self.friendtime[i] == PVtime[j]){
                                    self.PVlist[i] = alllist[j].data;
                                    continue; 
                                }
                            }
                        }
                        console.log(self.PVlist);
                        console.log(self.friendlist);
                            self.myChart.setOption({
                                xAxis: {
                                    data: self.friendtime
                                },
                                series: [{
                                    name: 'PV',
                                    data: self.PVlist
                                }]
                            })
                            self.getdataUV();

                    }
                })
        },
        getdataUV: function () {
            var self = this;
            var alllist= null;
            var UVtime = [];
            this.axios.post('/monitor/get_data', {
                typeId: 3,
                startTime: self.startN,
                endTime: self.endN,
                liebianType: self.lbTypenum
            })
                .then(function (res) {
                    self.UVlist = [];
                    self.UVmul = 0;
                    var data = res.data;
                    if (data.code == 0) {
                        alllist = data.data;
                        for (var i in alllist) {
                            // self.UVlist.push(alllist[i].data);
                            UVtime.push(self.formate(alllist[i].timeSeries));
                            self.UVmul = self.UVmul + alllist[i].data;
                        }
                        for(var i=0; i< self.friendlist.length; i++){
                            self.UVlist.push(0);
                        }
                        for(var i=0; i< self.friendtime.length; i++){
                            for(var j=0; j< UVtime.length; j++){
                                if(self.friendtime[i] == UVtime[j]){
                                    self.UVlist[i] = alllist[j].data;
                                    continue; 
                                }
                            }
                        }
                        console.log(self.UVlist);
                        console.log(self.friendlist);
                            self.myChart.setOption({
                                xAxis: {
                                    data: self.friendtime
                                },
                                series: [{
                                    name: 'UV',
                                    data: self.UVlist
                                }]
                            })
                            self.getdatapic();
                    }
                })
        },
        drawLine: function () {
            var self = this;
            this.myChart = echarts.init(document.getElementById('myChart'));
            this.myChart.setOption({
                backgroundColor: '#eef1f6',
                title: {
                    text: '新加好友相关数据统计',
                    textAlign: 'left',
                    textBaseline: 'top',
                    subtext: '',
                    left: '84%',
                    subtextStyle: {
                        fontSize: 16
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['每小时新加好友数', '每小时用户截图分享数','PV','UV']
                },
                toolbox: {
                    show: false,
                    feature: {
                        mark: { show: true },
                        dataView: { show: true, readOnly: false },
                        magicType: { show: true, type: ['line', 'bar'] },
                        restore: { show: true }
                    }
                },
                calculable: true,
                xAxis: [{
                    name: '时间',
                    type: 'category',
                    show: true,
                    boundaryGap: false,
                    nameTextStyle: {
                        color: '#636363'
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#636363'
                        }
                    },
                    data: []
                }],
                yAxis: [{
                    name: '数量',
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}'
                    },
                    splitLine: {
                        lineStyle: {
                            color: ['rgba(230, 230, 230, 0.2)']
                        }
                    },
                    axiosLabel: {
                        textStyle: {
                            color: 'white',
                            fontSize: 14
                        }
                    },
                    nameTextStyle: {
                        color: '#636363'
                    }
                }],
                series: [
                    {
                        name: '每小时新加好友数',
                        type: 'line',
                        data: [],
                        markPoint: {
                            data: [
                                { type: 'max', name: '最大数' },
                                { type: 'min', name: '最小数' }
                            ]
                        },
                        markLine: {
                            data: [
                                { type: 'average', name: '平均值' }
                            ]
                        }
                    },
                    {
                        name: '每小时用户截图分享数',
                        type: 'line',
                        data: [],
                        markPoint: {
                            data: [
                                { type: 'max', name: '最大数' },
                                { type: 'min', name: '最小数' }
                            ]
                        },
                        markLine: {
                            data: [
                                { type: 'average', name: '平均值' }
                            ]
                        }
                    },
                    {
                        name: '占比',
                        type: 'line',
                        lineStyle: {
                            normal: {
                                width: 0
                            }
                        },
                        symbolSize: 0,
                        data: []
                    },
                    {
                        name: 'PV',
                        type: 'line',
                        data: [],
                        markPoint: {
                            data: [
                                { type: 'max', name: '最大数' },
                                { type: 'min', name: '最小数' }
                            ]
                        },
                        markLine: {
                            data: [
                                { type: 'average', name: '平均值' }
                            ]
                        }
                    },
                    {
                        name: 'UV',
                        type: 'line',
                        data: [],
                        markPoint: {
                            data: [
                                { type: 'max', name: '最大数' },
                                { type: 'min', name: '最小数' }
                            ]
                        },
                        markLine: {
                            data: [
                                { type: 'average', name: '平均值' }
                            ]
                        }
                    }
                ]
            })
        },
        getlianbianlist: function () {
            var self = this;
            var alllist = null;
            this.lbType = [{liebianType: 0, desc: '全部渠道'}]
            this.axios.post('/weixin/get_liebian_type_list')
                .then(function (res) {
                    var data = res.data;
                    if (data.code == 0) {
                        alllist = data.data;
                        if (alllist == null) {
                            self.lbTypenum = null;
                        }
                        else {
                            for(var i =0; i< alllist.length; i++){
                                self.lbType.push(alllist[i])
                            }
                            console.log(self.lbType);
                            self.lbTypenum = 0;
                        }
                    }
                })
                .catch(function (err) {
                    console.log(err);
                })
            // this.getliebianpool(self.lbTypenum);
        },
        fortime: function (t) {
            var d = new Date(t * 1000);
            var year = d.getFullYear();
            var day = d.getDate();
            var month = d.getMonth() + 1;
            var hour = d.getHours();
            var minute = d.getMinutes();
            var f = year + "-" + this.initime(month) + "-" + this.initime(day);
            return f;
        },
        initime: function (num) {
            return num > 0 ? (num + "") : ("0" + num);
        },
        Tmedia: function () {
            var smedia = null;
            var emedia = null;
            if (smedia != this.startN || emedia != this.endN) {
                clearInterval(this.timer);
                smedia = this.startN;
                emedia = this.endN;
                console.log(smedia);
                console.log(emedia);
                this.Timer(smedia, emedia);
            }

        },
        Timer: function () {
            // sstart, eend
            this.timer = setInterval(() => {
                if (this.tie == 0) {
                    this.tie = 60;
                    var self = this;
                    if (self._init == 1) {
                        self.endN = Number.parseInt(Date.now() / 1000);
                        self.end = this.formate(Number.parseInt(self.endN));
                        console.log(self.end);
                    }
                    this.axios.post('/monitor/get_data', {
                        typeId: 0,
                        startTime: self.startN,
                        endTime: self.endN,
                        liebianType: self.lbTypenum
                    })
                        .then(function (res) {
                            var data = res.data;
                            self.friendlist = [];
                            self.friendtime = [];
                            self.friendsmul = 0;
                            if(data.data == null){
                                self.otherchart();
                            }
                            else{
                                if (data.code == 0) {
                                    self.alllist = data.data;
                                    for (var i in self.alllist) {
                                        self.friendlist.push(self.alllist[i].data);
                                        self.friendtime.push(self.formate(self.alllist[i].timeSeries));
                                        self.friendsmul = self.friendsmul + self.alllist[i].data;
                                    }
                                    self.myChart.setOption({
                                        xAxis: {
                                            data: self.friendtime
                                        },
                                        series: [{
                                            name: '每小时新加好友数',
                                            data: self.friendlist
                                        }]
                                    })
                                    self.getdataPV();
                                    console.log(self.friendlist);
                                }
                                else {
                                    self.$message("获取失败");
                                }
                            }
                        })
                }
                else {
                    this.tie--;
                }
            }, 1000)
        }
    },
    created() {
        this.getlianbianlist();
        var time = Date.now() / 1000;
        console.log(this.fortime(time));
        var today = new Date(this.fortime(time)).getTime() / 1000;
        console.log(today);
        this.start = this.formate(today);
        this.end = this.formate(Number.parseInt(time));
        this.startN = today;
        this.endN = Number.parseInt(time);
        this._init = 1;
        this.getdata();
        this.Tmedia();
        // this.creatdata(today,Number.parseInt(time));
        // this.creatshare(today,Number.parseInt(time));

    },
    beforeDestroy() {
        console.log("销毁前");
        clearInterval(this.timer);
        clearInterval(this.timer);
        clearInterval(this.timer);
        clearInterval(this.timer);
    }
}
</script>

<style>

</style>
