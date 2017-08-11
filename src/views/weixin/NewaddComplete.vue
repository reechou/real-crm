<template>
  <div class="charts1">
       <div id="appendChart" :style="{width:'600px',height:'400px'}">
       </div> 
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
    name:'add-echarts',
    props:{
        startN: Number,
        endN: Number,
        tiee: [Number,String],
        complete: Number
    },
    data(){
        return{
            friendlist:[],
            friendid:[],
            alllist:[],
            completelist:[],
            completeid:[],
            clllist:[],
            startC:null,
            endC:null
        }
    },
    mounted() {
        this.drawLine();
    },
    watch:{
        complete(value,oldval){
            this.getcompletedata();
        }
    },
    methods: {
      isupdate:function(){
        if(this.tiee == 0){
            this.getdata();
        }
      },
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
        getdata:function(){
            var self = this;
            this.axios.post('/monitor/get_data',{
                typeId: 0,
                startTime: self.startN,
                endTime: self.endN
            })
                .then(function(res){
                    var data = res.data;
                    self.friendlist = [];
                    self.friendid = [];
                    if(data.code == 0){
                        self.alllist = data.data;
                        for (var i in self.alllist){
                            self.friendlist.push(self.alllist[i].data);
                            self.friendid.push(self.formate(self.alllist[i].timeSeries));
                        }
                        self.myChart.setOption({
                            tooltip:{
                                axisPointer:{
                                    lineStyle:{
                                        color:'#FFC125'
                                    }
                                }
                            },
                            xAxis: {
                                data:self.friendid
                            },
                            series:[{
                                name:'当天每小时新加好友数',
                                data: self.friendlist
                            }]
                        })
                    }
                    else{
                        self.$message('获取失败')
                    }
                })
        },
        getcompletedata:function(){
            var self = this;
            self.startC = this.startN - (this.complete*86400);
            self.endC = this.endN - (this.complete*86400);
            console.log(self.startC);
            console.log(self.endC);
            this.axios.post('/monitor/get_data',{
                typeId: 0,
                startTime: self.startC,
                endTime: self.endC
            })
                .then(function(res){
                    var data = res.data;
                    self.completelist = [];
                    self.completeid = [];
                    if(data.code == 0){
                        self.clllist = data.data;
                        for (var i in self.clllist){
                            self.completelist.push(self.clllist[i].data);
                            self.completeid.push(self.formate(self.clllist[i].timeSeries));
                        }
                        console.log(self.completeid);
                        self.myChart.setOption({
                            series:[{
                                name:'比较线',
                                data: self.completelist
                            }]
                        })
                    }
                    else{
                        self.$message('获取失败')
                    }
                })
        },
        drawLine: function() {
            var self = this;
            this.myChart = echarts.init(document.getElementById('appendChart'));
            this.myChart.setOption({
                backgroundColor: '#eef1f6',
                title: {
                    text: '新增好友比较',
                    textAlign: 'left',
                    textBaseline:'top',
                    subtext: '',
                    left: '80%',
                    subtextStyle:{
                        fontSize: 16
                        }
                    },
                    tooltip:{
                        trigger: 'axis'
                    },
                    legend:{
                        data:['当天每小时新加好友数','比较线']
                    },
                    toolbox:{
                        show: false,
                        feature: {
                            mark: { show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show:true, type:['line','bar']},
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
                            name:'当天每小时新加好友数',
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
                            name:'比较线',
                            type:'line',
                            itemStyle : {  
                                normal : {  
                                     color:'#00CD66',
                                    lineStyle:{  
                                        color:'#00CD66'  
                                    }  
                                }  
                            },  
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
            
        }
    },
    created(){
        this.getdata();
        this.getcompletedata();
    }
}
</script>

<style>
  
</style>
