<template>
  <div class="admin-userlist">
    <div><label for="">所选id：</label><span v-for="item in weixinids">{{item}}, </span></div>
    <div style="width: 400px;padding: 10px">
        <el-input placeholder="请输入微信号" icon="search" v-model="searchcontent" :on-icon-click="handleIconClick"  @keyup.enter.native="show($event)"></el-input>
    
        <el-button type="primary" @click="settask()">确定</el-button>
    </div>
    <template>
     <el-checkbox-group v-model="weixinids">
         <input type="checkbox" @click="checkAll()">全选
      <el-table
        :data="weixinlist" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
         <el-table-column prop="id" label="选择"><template scope="scope">
            <el-checkbox :label="scope.row.id"></el-checkbox>
          </template></el-table-column> 
        <el-table-column prop="id" label="id"> </el-table-column>      
        <el-table-column prop="nickName" label="微信昵称"> </el-table-column>
        <el-table-column prop="wxId" label="微信id"></el-table-column>
        <el-table-column prop="wechat" label="微信号"> </el-table-column>
        <el-table-column label="是否已执行默认任务"> <template scope='scope'>{{ifExecDefaultTask(scope.row.ifExecDefaultTask)}}</template></el-table-column>
        <el-table-column label="创建日期"> <template scope='scope'>{{formate(scope.row.createAt)}}</template></el-table-column>                 
      </el-table>
      </el-checkbox-group>
    </template>
    <div style="margin-bottom: 40px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size = 'pagesize' ayout="total, prev, pager, next" :total = 'totalpage'></el-pagination>
       </div>
  </div>
</template>

<script>
export default {
  name: 'weixinlist1',
  data() {
      return {
        weixinlist: [],
        loading: false,
        searchcontent: '',
        allweixinlist: [],
        pagesize: 100,
        totalpage: 8,
        currentPage: 1,
        weixinids: [],
        taskids: [],
        checkall: false,
        idd: 0   // 记录选择的微信的序号
      };
    },
    methods: {
      checkAll: function () {//全选
	     if (!this.checkall) {
  			this.weixinids = []         
	       this.allweixinlist.forEach((item) => {
	         this.weixinids.push(item.id);
	       });
         this.checkall = true
	     }
       else{
  			this.weixinids = [] 
         this.checkall = false                
       }
  		},
      settask: function () {
        var self = this
        for(var i in this.taskids){
          this.taskids[i] = Number.parseInt(this.taskids[i])
        }
        this.axios.post('/weixin/batch_create_weixin_task', {taskIds: this.taskids, weixins: this.weixinids})
          .then(function(res){
              var data = res.data
              console.log(data)    
              if(data.code == 0){
                self.$message("生成任务成功")
                self.weixinids = []
              } 
              else{
                self.$message("生成任务失败")                
              }   
          })
          .catch(function(err){
              console.log(err);
                self.$message("生成任务失败")                             
          })
      },
      handleSizeChange: function (){
        var self = this
        self.weixinlist = []
        var j = self.currentPage == Math.ceil(self.allweixinlist.length/self.pagesize) ? self.allweixinlist.length : self.currentPage*self.pagesize
        for(var i = (self.currentPage-1)*self.pagesize; i < j; i++){
            self.weixinlist.push(self.allweixinlist[i])             
          }
      },
      handleCurrentChange: function (val){
          var self = this
          self.weixinlist = []
        var j = val == Math.ceil(self.allweixinlist.length/self.pagesize) ? self.allweixinlist.length : val * self.pagesize  
        for(var i = (val-1)*self.pagesize; i < j; i++){
            self.weixinlist.push(self.allweixinlist[i])             
          }
      },
      handleIconClick: function () {
        if(this.searchcontent == ''){
          this.weixinlist = this.allweixinlist
        }
        else{
          var self = this
          this.weixinlist = [_.find(self.allweixinlist, function(chr) {return chr.id == self.searchcontent;})]
        }
      },
    show: function (ev) {
      if (ev.keyCode == 13) {
        if (this.searchcontent == '') {
          this.weixinlist = this.allweixinlist;
        }
        else {
          var self = this;
          this.weixinlist = [_.find(self.allweixinlist, function (chr) { return chr.id == self.searchcontent; })]
          if(this.weixinids[this.idd] != this.weixinlist[0].id){
            this.weixinids.push(this.weixinlist[0].id);
            this.idd = this.weixinids.length - 1;
          }
        }
      }
    },
      ifExecDefaultTask: function (val) {
          return val ? '是' : '否'
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
      getweixinlist: function () {
        var self = this
        self.loading = true
        this.axios.post('/weixin/get_all_weixin')
          .then(function(res){
              var data = res.data
              self.loading = false
              console.log(data)    
              if(data.code == 0){
                self.allweixinlist = data.data
                self.totalpage = self.allweixinlist.length
				var currentSize = self.currentPage*self.pagesize
				if(currentSize > self.allweixinlist.length) {
					currentSize = self.allweixinlist.length
				}
                for(var i = (self.currentPage-1)*self.pagesize; i < currentSize; i++){
                  self.weixinlist.push(self.allweixinlist[i])             
                }
              }    
          })
          .catch(function(err){
              console.log(err);
              self.loading = false
          })
      }
    },
    created: function () {
      this.getweixinlist()
      this.taskids = (this.$route.query.ids).split(',')
    }
}
</script>

<style>
  .admin-userlist{width: 100%;padding: 20px}
</style>