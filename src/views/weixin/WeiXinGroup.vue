<template>
  <div class="weixingroup">
    <div class="selectgroup" style="padding:10px">
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
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button @click="showaddgroup = !showaddgroup">创建分组</el-button>
        </el-col>
        <el-col :span="3">
          <el-button @click="goaddmember">添加分组成员</el-button>
        </el-col>
      </el-row>
    </div>

    <transition name="bounce">
      <div class="addgroup" style="padding:20px" v-show="showaddgroup">
        <el-row :gutter="20">
          <el-col :span="3">
            <label>新组组名:</label>
          </el-col>
          <el-col :span="12">
            <el-input type="text" v-model="newName"></el-input>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="addgroup">确定</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>

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
      wxgroup:[{
        id:1, groupName:"one"
      },{
        id:2, groupName:"two"
      },{
        id:3, groupName:"three"
      },{
        id:4, groupName:"four"
      }],
      weixingroup:[],
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
    addgroup:function(){
      var self = this;
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
            }
          })
          .catch(function(err){
            console.log(err);
          })
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
    goaddmember:function(){
      this.$router.push('/addgroupmember');
    }
  },
  created(){
    this.getweixingroup();
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
  .el-icon-delete{
    background-color: #eef1f6;
  }
  .el-icon-delete:hover{
    background-color: cyan;
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
