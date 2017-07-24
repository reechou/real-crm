<template>
  <div class="admin-userlist">
    <div style="width: 400px;padding: 10px">
          <el-button type="primary" size="small" @click="goset()" style="margin-bottom: 10px">设置新微信</el-button>                                                                        
    
        <el-input placeholder="请输入微信号" icon="search" v-model="searchcontent" :on-icon-click="handleIconClick"  @keyup.enter.native="show($event)"></el-input>
    </div>
    <template>
      <el-table
        :data="weixinlist" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column prop="id" label="id"> </el-table-column>      
        <el-table-column prop="nickName" label="微信昵称"> </el-table-column>
         <!-- <el-table-column prop="wxId" label="微信id"></el-table-column>  -->
        <el-table-column prop="wechat" label="微信号"> </el-table-column>
        <!-- <el-table-column label="是否已执行默认任务"> <template scope='scope'>{{ifExecDefaultTask(scope.row.ifExecDefaultTask)}}</template></el-table-column>
        <el-table-column label="创建日期"> <template scope='scope'>{{formate(scope.row.createAt)}}</template></el-table-column>   -->
        <el-table-column label="最后心跳时间"> <template scope='scope'>{{formate(scope.row.lastHeartbeat)}}</template></el-table-column>  
        <el-table-column label="今日添加人数" prop="todayAddContactNum"> </el-table-column>  
        <el-table-column label="描述"> <template scope="scope">{{scope.row.desc}} <el-button type="text" size="small" @click="updatedec(scope.row.id, scope.row.desc)">修改</el-button></template></el-table-column>                                                                  
        <el-table-column label="操作" > <template scope='scope'>
          <!-- <el-button type="text" size="small" @click="settask(scope.row.id)">创建任务</el-button>
          <el-button type="text" size="small" @click="gosetting(scope.row.id)">查看设置</el-button>  
          <el-button type="text" size="small" @click="confirm(scope.row.id)">删除</el-button>
          <el-button type="text" size="small" @click="gofriendslsit(scope.row.id)">查看好友</el-button>  -->
           <select :id="scope.row.id" @change="selectevent(scope.row.id)" v-model="selected">
             <option selected>请选择</option>
              <option>创建任务</option>
              <option>查看设置</option>
              <option>删除</option>
              <option>查看好友</option>
              <option>定时任务</option>
          </select> 
        </template></el-table-column>               
      </el-table>
    </template>
    <div style="margin-bottom: 40px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size = 'pagesize' ayout="total, prev, pager, next" :total = 'totalpage'></el-pagination>
       </div>
       <el-dialog title="修改" v-model="dialogVisible" size="small">
        <el-input type="textarea" :rows="3" placeholder="请输入描述" v-model="desc"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updatedeschttp()">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'weixinlist',
  data() {
      return {
        weixinlist: [],
        loading: false,
        searchcontent: '',
        allweixinlist: [],
        pagesize: 100,
        totalpage: 8,
        currentPage: 1,
        dialogVisible: false,
        desc: '',
        id: '',
        selected: '请选择'
      };
    },
    methods: {
      selectevent: function(val) {
        if(this.selected == "创建任务"){
          this.settask(val);
        }
        else if(this.selected == "查看设置"){
          this.gosetting(val);
        }
        else if(this.selected == "删除"){
          this.confirm(val);
        }
        else if(this.selected == "查看好友"){
          this.gofriendslsit(val);
        }
        else{
          this.gotiminglist(val)
        }
      },
      goset: function (val) {
          this.$router.push("/setweixin?id="+val)
      },
      confirm(val) {
        var self = this
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.delet(val)
        }).catch(() => {
                    
        });
      },
      updatedec: function (id, desc){
          this.dialogVisible = true
          this.desc = desc
          this.id = id
          // this.updatedeschttp()
      },
      updatedeschttp: function () {
          var self = this
          this.axios.post('/weixin/update_weixin_desc', {id: this.id, desc: this.desc})
          .then(function(res){
              var data = res.data
              self.dialogVisible = false
              self.id = ''
              self.desc = ""
              if(data.code == 0){
                self.$message("修改成功")
                self.getweixinlist()
              }  
              else{
                self.$message("修改失败")                
              }  
          })
          .catch(function(err){
              self.dialogVisible = false            
              console.log(err);
              self.$message("修改失败")                              
          })
      },
      delet: function (val) {
          var self = this
          this.axios.post('/weixin/delete_weixin', {id: val})
          .then(function(res){
              var data = res.data
              if(data.code == 0){
                self.$message("删除成功")
              }  
              else{
                self.$message("删除失败")                
              }  
          })
          .catch(function(err){
              console.log(err);
              self.$message("删除失败")                              
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
          self.currentPage = val
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
      show: function(ev){
        if(ev.keyCode == 13){
          if(this.searchcontent == ''){
            this.weixinlist = this.allweixinlist;
          }
          else{
            var self = this;
            this.weixinlist = [_.find(self.allweixinlist, function(chr) {return chr.id == self.searchcontent;})]
          }
        }
      },
      gosetting: function (val) {
        this.$router.push('/querysetting?id='+val)          
      },
      settask: function (val) {
        this.$router.push('/settask?id='+val)
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
                self.weixinlist = []
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
      },
      gofriendslsit: function(val) {
        this.$router.push('/friendslist?id=' + val);
      },
      gotiminglist: function(val) {
        this.$router.push('/timinglist?id=' + val);
      }
    },
    created: function () {
      this.getweixinlist()
    }
}
</script>

<style>
  .admin-userlist{width: 100%;padding: 20px}
select{
  width: 100px;
  height: 30px;
  border-radius: 5px;
}
</style>
