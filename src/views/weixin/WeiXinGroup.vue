<template>
  <div class="weixingroup">
    <div class="selectgroup" style="padding:10px">
      <el-row :gutter="20" style="margin-bottom:20px;">
        <el-col :span="4" :offset="20"><span size="small" style="color:red" >{{ tie }} </span>后自动刷新列表</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="3">
          <el-select v-model="groupNum" placeholder="请选择" @change="getgroupmember(groupNum)" style="padding:0;margin:0">
            <el-option
            v-for="item in wxgroup"
            :key="item.id"
            :label="item.groupName"
            :value="item.id">
            <i class="el-icon-delete" @click="clickicon(item.id)"></i>&nbsp;&nbsp;<span style="width:80%">{{ item.groupName }}</span>
            </el-option>
            <el-option value=""><i class="el-icon-plus" style="width:100%;" @click="showaddgroup = true">&nbsp;&nbsp;<span>创建分组</span></i></el-option>
          </el-select>
        </el-col>
        <!-- <el-col :span="2">
          <el-button type="primary" @click="showaddgroup = true">创建分组</el-button>
        </el-col> -->
        <el-col :span="3">
          <el-button type="primary" @click="getweixinlist">添加分组成员</el-button>
        </el-col>
      </el-row>
    </div>

    <el-dialog title="新增微信分组" v-model="showaddgroup">
      <el-row :gutter="20" style="margin-bottom:20px;">
        <el-col :span="4">
          <label>新组组名:</label>
        </el-col>
        <el-col :span="20">
           <el-input type="text" v-model="newName"></el-input>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="6"><el-button type="primary" @click="addgroup">确定</el-button></el-col>
        <el-col :span="6"><el-button type="primary" @click="showaddgroup = false">取消</el-button></el-col>
      </el-row>
    </el-dialog>

    <el-dialog title="新增裂变成员" v-model="showaddmember">
      <el-row :gutter="20" style="margin-bottom:20px;">
        <el-col :span="3" :offset="21">
          <el-button type="primary" @click="addmember">添加</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom:20px;">
        <el-col :span="4">
          <el-button type="primary" @click="getweixinlist" >显示全部微信</el-button>
        </el-col>
        <el-col :span = "20">
          <el-input placeholder="请输入微信号" icon="search" v-model="searchcontent" :on-icon-click="handleIconClick" @keyup.enter.native="show($event)"></el-input>
        </el-col>
      </el-row>
      <template>
        <el-checkbox-group v-model="members">
          <input type="checkbox" @click="checkAllformember()" v-model="diabtcheckall">全选
          &nbsp;&nbsp;(已选人数:{{ members.length }})
          <el-table :data="weixinlist" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
              <el-table-column label="id">
                  <template scope="scope">
                      <el-checkbox :label="scope.row.id"></el-checkbox>
                  </template>
              </el-table-column>
              <el-table-column prop="nickName" label="微信昵称"> </el-table-column>
              <!-- <el-table-column prop="wxId" label="微信id"></el-table-column>  -->
              <el-table-column prop="wechat" label="微信号"> </el-table-column>

              <el-table-column label="最后心跳时间">
              <template scope='scope'>{{formate(scope.row.lastHeartbeat)}}</template>
              </el-table-column>
              <el-table-column align="center" label="今日添加人数" prop="todayAddContactNum"> </el-table-column>
              <el-table-column label="描述">
              <template scope="scope">
                {{scope.row.desc}}
              </template>
              </el-table-column>

          </el-table>
        </el-checkbox-group>
      </template>
      <div style="margin-bottom: 40px">
        <el-pagination @size-change="memhandleSizeChange" @current-change="memhandleCurrentChange" :current-page="diacurrentPage" :page-size='diapagesize' ayout="total, prev, pager, next" :total='diatotalpage'></el-pagination>
      </div>
    </el-dialog>   

    <template>
      <el-table :data="weixingroup" style="width:100%;margin-bottom:80px" v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column label="id">
          <template scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>

        <el-table-column label="微信号">
          <template scope="scope">
            {{ scope.row.wechat}}
          </template>
        </el-table-column>

        <el-table-column label="微信id">
          <template scope="scope">
            {{ scope.row.wxId }}
          </template>
        </el-table-column>
        
        <el-table-column label="昵称">
          <template scope="scope">
            {{ scope.row.nickName }}
          </template>
        </el-table-column>

        <el-table-column label="最后心跳时间">
          <template scope="scope">
            {{ formate(scope.row.lastHeartbeat) }}
          </template>
        </el-table-column>

        <el-table-column label="今日添加人数">
          <template scope="scope">
            {{ scope.row.todayAddContactNum }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="text" size="small" v-model="groupormember" @click="confirm(scope.$index),groupormember=1">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <div style="margin-bottom:40px">
      <el-pagination 
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange" 
      :current-page="currentPage" 
      :page-size='pagesize' 
      ayout="total, prev, pager, next" 
      :total='totalpage'>
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'weixin_group',
  data(){
    return {
      groupNum: null,
      wxgroup:[],
      weixingroup:[],
      tie:60,
      timer:null,

      members:[],      
      weixinlist: [],
      checkallformember: false,
      diallist:[],
      diapagesize:100,
      diacurrentPage:1,
      diatotalpage:1,
      diabtcheckall: false,
      searchcontent: '',
      numpack:[],
      showaddmember: false,

      alllist:[],
      pagesize:100,
      currentPage:1,
      totalpage:1,
      loading: false,
      isshowgroup: false,
      groupormember:0,
      showaddgroup:false,
      newName:''

    }
  },
  methods:{
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
    addgroup:function(){
      var self = this;
      if(this.newName == ''){
        this.$message("请输入新建组名");
        return false;
      }
      else{
        this.axios.post('/weixin/create_weixin_group',{
          groupName: this.newName
        })
        .then(function(res){
          var data = res.data;
          if(data.code == 0){
            self.$message("创建成功");
            self.getweixingroup();
            self.showaddgroup = false;
          }
          else{
            self.$message("创建失败");
            console.log(11111);
          }
        })
        .catch(function(err){
          self.$message("创建失败");
          console.log(22222);
          console.log(err);
        })
      }
    },
    checkAllformember: function(){
      if(this.members == null){
        if(!this.checkallformember){
          this.members = [];
          this.weixinlist.forEach((item) => {
            this.members.push(item.id);
          });
          this.checkallformember = true;
        }
        else{
          this.members = [];
          this.checkallformember = false;
        }
      }
      else{
        if(!this.checkallformember){
          this.weixinlist.forEach((item) => {
            this.members.push(item.id);
          });
          this.checkallformember = true;
        }
        else{
          this.members = [];
          this.checkallformember = false;
        }
      }
      console.log(this.members);
    },
    clickicon:function(val){
      this.groupormember = 0;
      this.confirm(val);
    },
    getweixingroup:function(){
      var self = this;
      this.axios.post('/weixin/get_weixin_group_list')
          .then(function(res){
            var data = res.data;
            if(data.code == 0){
              self.wxgroup = data.data;
              if(self.wxgroup == null){
                self.groupNum = null;
              }
              else{
                console.log(self.wxgroup);
                self.groupNum = self.wxgroup[0].id;
                console.log(self.groupNum);
              }
            }
          })
          .catch(function(err){
            console.log(err);
          })
          this.getgroupmember(self.groupNum);
    },
    getgroupmember:function(groupid){
      var self = this;
      console.log(groupid);
      this.axios.post('/weixin/get_weixin_group_member_list',{
        groupId: groupid
      })
      .then(function(res){
        var data = res.data;
        if(data.code == 0){
          self.alllist = data.data;
          if(self.alllist == null){
            self.weixingroup = [];
          }
          else{
            self.totalpage = self.alllist.length;
            self.weixingroup = [];
            var currentSize = self.currentPage * self.pagesize;
            if(currentSize > self.alllist.length){
              currentSize = self.alllist.length;
            }
            for(var i=(self.currentPage -1) * self.pagesize; i< currentSize; i++){
              self.weixingroup.push(self.alllist[i].weixin);
            }
          }
        }
      })
      .catch(function(err){
        console.log(err);
      })

      this.Tmedia();
    },
    memhandleSizeChange: function(){
      var self = this;
      self.weixinlist = [];
      var j = self.diacurrentPage == Math.ceil(self.diallist.length / self.diapagesize) ? self.diallist.length : self.diacurrentPage * self.diapagesize;
      for(var i = (self.diacurrentPage - 1) * self.diapagesize; i < j; i++) {
        self.weixinlist.push(self.diallist[i]);
      }
    },
    memhandleCurrentChange: function (val) {
      var self = this;
      this.diabtcheckall  = false;
      this.checkallformember = false;
      self.weixinlist = [];
      self.diacurrentPage = val;
      var j = val == Math.ceil(self.diallist.length / self.diapagesize) ? self.diallist.length : val * self.diapagesize;
      for (var i = (val - 1) * self.diapagesize; i < j; i++) {
        self.weixinlist.push(self.diallist[i]);
      }
    },
    handleIconClick: function() {
      if(this.searchcontent == '') {
        this.weixinlist = this.diallist;
      }
      else {
        var self = this;
        this.weixinlist = [_.find(self.diallist, function(chr){return chr.id == self.searchcontent; })];
      }
    },
    show: function(ev){
      if(ev.keyCode == 13) {
        if(this.searchcontent == '') {
          this.weixinlist = this.diallist;
        }
        else {
          var self = this;
          this.weixinlist = [_.find(self.diallist, function(chr){
            return chr.id == self.searchcontent;
          })]
        }
      }
    },
    handleSizeChange: function () {
      var self = this
      self.weixingroup = []
      var j = self.currentPage == Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : self.currentPage * self.pagesize
      for (var i = (self.currentPage - 1) * self.pagesize; i < j; i++) {
        self.weixingroup.push(self.alllist[i].weixin)
      }
    },
    handleCurrentChange: function (val) {
      var self = this
      self.weixingroup = []
      self.currentPage = val
      var j = val == Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : val * self.pagesize
      for (var i = (val - 1) * self.pagesize; i < j; i++) {
        self.weixingroup.push(self.alllist[i].weixin)
      }
    },
    confirm: function(val){
      var self = this;
      this.$confirm("是否删除?","提示",{
        bonfirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(() =>{
        if(this.groupormember == 0){
          this.groupdelet(val);
          console.log(this.groupormember);
        }
        else{
          self.memberdelet(val);
          console.log(11111);
        }
      }).catch(() =>{

      });
    },
    groupdelet:function(val){
      var self = this;
      this.axios.post('/weixin/delete_weixin_group',{
        id:val                  // 微信分组唯一id
      })
      .then(function(res){
        var data = res.data;
        if(data.code == 0){
          self.$message("删除成功");
          self.getweixingroup();
        }
        else{
          self.$message("删除失败");
        }
      })
      .catch(function(err){
        self.$message("删除失败");
        console.log(err);
      })
    },
    memberdelet: function(val){
      
      var self = this;
      console.log(this.alllist[val].weixinGroupMember.id );
      this.axios.post('/weixin/delete_weixin_group_member',{
        id: this.alllist[val].weixinGroupMember.id                // 微信分组成员唯一id
      })
      .then(function(res){
        var data = res.data;
        if(data.code == 0){
          self.$message("删除成功");
          self.getgroupmember(self.groupNum);
        }
        else{
          self.$message("删除失败");
        }
      })
      .catch(function(err){
        self.$message("删除失败");
        console.log(err);
      })
    },
    getweixinlist: function() {
      var self = this;
      self.loading = true;
      this.axios.post('/weixin/get_all_weixin')
          .then(function (res) {
            var data = res.data;
            self.loading = false;
            if(data.code == 0){
              self.diallist = data.data.map(v => {
                v.edit = false;
                return v;
              });
              if(self.diallist == null){
                self.weixinlist = [];
              }
              else{
                self.diatotalpage = self.diallist.length;
                self.weixinlist = [];
                var diacurrentSize = self.diacurrentPage * self.diapagesize;
                if(diacurrentSize > self.diallist.length) {
                  diacurrentSize = self.diallist.length;
                }
                for(var i = (self.diacurrentPage - 1) * self.diapagesize; i < diacurrentSize; i++) {
                  self.weixinlist.push(self.diallist[i]);
                }
              }
            }
          })
          .catch(function (err) {
            console.log(err);
            self.loading = false;
          })
          if(this.groupNum == null)
          {
            this.$message("请选择组别")
            return false;
          }
          else{
            this.showaddmember = true;
          }
    },
    addmember: function() {
      var self = this;
      if(this.members == ''){
        this.$message("请选择好友");
        return false;
      }
      else{
        console.log(this.members);
        for(var i in this.members){
          this.numpack.push({
            groupId: Number.parseInt(this.groupNum),
            weixinId: Number.parseInt(this.members[i])
          })
        }
        console.log(this.members);
        console.log(this.numpack)
        this.axios.post('/weixin/create_weixin_group_member_list', this.numpack)
            .then(function(res){
              var data = res.data;
              if(data.code == 0){
                self.$message("创建成功");
                self.showaddmember = false;
                self.members = [];
                self.numpack = [];
                self.getgroupmember(self.groupNum);
              }
              else{
                self.$message("创建失败");
              }
            })
            .catch(function(err){
              console.log(err);
              self.$message("创建失败");
            })
      }
    },
    Timer:function(val) {
      this.timer = setInterval(() => {
        if(this.tie == 0){
          this.tie = 60;

          var self = this;
          console.log(val);
          this.axios.post('/weixin/get_weixin_group_member_list',{
            groupId: val
          })
          .then(function(res){
            var data = res.data;
            if(data.code == 0){
              self.alllist = data.data;
              self.totalpage = self.alllist.length;
              self.weixingroup = [];
              var currentSize = self.currentPage * self.pagesize;
              if(currentSize > self.alllist.length){
                currentSize = self.alllist.length;
              }
              for(var i=(self.currentPage -1) * self.pagesize; i< currentSize; i++){
                self.weixingroup.push(self.alllist[i].weixin);
              }
            }
          })
          .catch(function(err){
            console.log(err);
          })
        }
        else{
          this.tie--;
        }
      }, 1000)
    },
    Tmedia: function(){
      var media = null;
      if(media != this.groupNum){
        clearInterval(this.timer);
        media = this.groupNum;
        this.Timer(media);
      }
    }
  },
  created(){
    this.getweixingroup();
  },
  beforeDestroy() {            
    console.log("销毁前");   
    clearInterval(this.timer);      // 确保万一生成多个定时器，多执行几次清除指令
    clearInterval(this.timer);
    clearInterval(this.timer);
    clearInterval(this.timer);
    console.log(this.timer);                   
  }
}
</script>

<style>
  .weixingroup{
    width:100%;
    padding:20px;
  }
  select{
    width:100%;
  }
  .el-icon-delete:hover{
    background-color: #20a0ff;
  }

  /*设置本地动画*/
 .bounce-enter-active {
  animation: bounce-in 2s;
}
.bounce-leave-active {
  animation: bounce-out 2s;
}
@keyframes bounce-in{
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes bounce-out{
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(0);
  }
} 
</style>
