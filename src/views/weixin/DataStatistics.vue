<template>
  <div class="statistics">
      <div class="block" style="margin-bottom:20px;">
          <span>选择时间范围</span>
        <el-date-picker v-model="start" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始日期时间"></el-date-picker>-
        <el-date-picker v-model="end" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束日期时间"></el-date-picker>
        <el-button type="primary" @click="getdata" >查询</el-button>
      </div>
      <div id="myChart" :style="{width:'1200px', height:'600px'}"></div> 
  </div>
</template>

<script>
// let echarts = require('echarts/lib/echarts');      // 引入基本模块
// require('echarts/lib/chart/line');                 // 引入折线图组件
// require('echarts/lib/component/tooltip');          // 提示框
// require('echarts/lib/component/toolbox');
// require('echarts/lib/component/title');            // title组件
import echarts from 'echarts'

export default {
    name: 'data_statistics',
    data() {
        return {
            start: null,
            end: null,
            startN:null,
            endN:null,
            friendlist:[],
            friendid:[],
            sharelist:[],
            alllist:[],
            myChart:null,
            _init:0,
            friendsmul:0,
            sharemul:0
            // data2:['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24']
        }
    },
    mounted() {
        this.drawLine();
    },
    methods: {
      formate:function(t){
        var d = new Date(t*1000);
        var year = d.getFullYear();
        var day = d.getDate();
        var month = d.getMonth()+1;
        var hour = d.getHours();
        var minute = d.getMinutes();
        var f = year + "-" +this.init(month) + "-" + this.init(day) + " " + this.init(hour) + ":" + this.init(minute);
        return f;
      },
      init: function(d){
        return d>9?d:"0"+d;
      },
        getdata:function (){
            var self = this;
            if(this._init == 0){
                self.startN = Math.floor(new Date(this.start).getTime() / 1000);
                self.endN = Math.floor(new Date(this.end).getTime() / 1000);
                console.log(self.startN);
                console.log(self.endN);
            }

            if(self.endN - self.startN > 2678400){
                self.$message("请选择一个月内时间段");
                return false;
            }
            else if((self.start == null || self.start == null) && self._init == 0){
                self.$message("请选择时间");
                return false;
            }
            else{
            this.axios.post('/monitor/get_data',{
                typeId: 0,
                startTime: self.startN,
                endTime: self.endN
            })
            .then(function (res){
                var data = res.data;
                self.friendlist = [];
                self.friendid = [];
                self.friendsmul = 0;
                if(data.code == 0){
                    self.alllist = data.data;
                    for( var i in self.alllist){
                        self.friendlist.push(self.alllist[i].data);
                        self.friendid.push(self.formate(self.alllist[i].timeSeries));
                        self.friendsmul = self.friendsmul + self.alllist[i].data;
                    }
                    self.myChart.setOption({
                        xAxis: {
                            data: self.friendid
                        },
                        series:[{
                            name:'每小时新加好友数',
                            data: self.friendlist
                        }]
                    })
                    self.getdatapic();
                    console.log(self.friendlist);
                }
                else{
                    self.$message("获取失败");
                }
            })
            }
        },
        getdatapic: function(){
            var self = this;
            // self.startN = Math.floor(new Date(this.start).getTime() / 1000);
            // self.endN = Math.floor(new Date(this.end).getTime() / 1000);

            this.axios.post('/monitor/get_data',{
                typeId: 1,
                startTime: self.startN,
                endTime: self.endN
            })
            .then(function(res){
                self.alllist = [];
                self.sharelist = [];
                self.sharemul = 0;
                var data = res.data;
                if(data.code == 0){
                    self.alllist = data.data;
                    for(var i in self.alllist){
                        self.sharelist.push(self.alllist[i].data);
                        self.sharemul = self.sharemul + self.alllist[i].data;
                    }
                    self.myChart.setOption({
                        title:{
                            subtext:'截图分享总数'+ self.sharemul + '\n' + '新加好友总数:'+ self.friendsmul
                        },
                        xAxis: {
                            data: self.friendid
                        },
                        series:[{
                            name:'每小时用户截图分享数',
                            data: self.sharelist
                        }]
                    })
                }
            })
        },
        drawLine: function () {
            var self = this;
            this. myChart = echarts.init(document.getElementById('myChart'));
            this.myChart.setOption({
                backgroundColor: '#eef1f6',
                title:{
                    text: '新加好友相关数据统计' ,
                    textAlign:'left',
                    textBaseline:'top',
                    subtext:'',
                    left:'80%',
                    subtextStyle:{
                        fontSize: 16
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },
                legend:{
                    data:['每小时新加好友数', '每小时用户截图分享数']
                },
                toolbox:{
                    show: false,
                    feature: {
                        mark: {show: true},
                        dataView: {show:true, readOnly:false},
                        magicType: {show:true, type:['line', 'bar']},
                        restore: {show: true}
                    }
                },
                calculable: true,
                xAxis:[{
                    name:'时间',
                    type:'category',
                    show: true,
                    boundaryGap: false,
                    nameTextStyle:{
                        color: '#636363'
                    },
                    axisLabel:{
                        textStyle:{
                            color:'#636363'
                        }
                    },
                    data:[]
                }],
                yAxis:[{
                    name: '数量',
                    type:'value',
                    axisLabel:{
                        formatter: '{value}'
                    },
                    splitLine: {
                        lineStyle:{
                            color:['rgba(230, 230, 230, 0.2)']
                        }
                    },
                    axiosLabel: {
                        textStyle: {
                            color: 'white',
                            fontSize: 14
                        }
                    },
                    nameTextStyle:{
                        color: '#636363'
                    }
                }],
                series: [
                    {
                        name:'每小时新加好友数',
                        type:'line',
                        data:[],
                        markPoint: {
                            data:[
                                {type:'max', name:'最大数'},
                                {type:'min', name:'最小数'}
                            ]
                        },
                        markLine:{
                            data:[
                                {type:'average', name:'平均值'}
                            ]
                        }
                    },
                    {
                        name:'每小时用户截图分享数',
                        type:'line',
                        data:[],
                        markPoint: {
                            data:[
                                {type:'max', name:'最大数'},
                                {type:'min', name:'最小数'}
                            ]
                        },
                        markLine:{
                            data:[
                                {type:'average', name:'平均值'}
                            ]
                        }
                    }
                ]
            })
        },
        fortime:function(t){
            var d = new Date(t*1000);
            var year = d.getFullYear();
            var day = d.getDate();
            var month = d.getMonth()+1;
            var hour = d.getHours();
            var minute = d.getMinutes();
            var f = year + "-" +this.initime(month) + "-" + this.initime(day);
            return f;
        },
        initime:function (num) { 
        return num > 0 ? (num + "") : ("0" + num); 
        },
    },
    created(){
        var time = Date.now() / 1000;
        console.log(this.fortime(time));
        var today = new Date(this.fortime(time)).getTime() / 1000;
        console.log(today);
        this.startN = today;
        this.endN = Number.parseInt(time);
        this._init = 1;
        this.getdata();
        // this.creatdata(today,Number.parseInt(time));
        // this.creatshare(today,Number.parseInt(time));

    }
}
</script>

<style>

</style>
