<template>
  <div class="admin-userlist">
    <div style="padding: 10px">
      <el-button type="primary" @click="go()">添加关键字</el-button>
    </div>
    <template>
    <el-table
      :data="keywordlist" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
      <el-table-column prop="id" label="id"></el-table-column>      
      <el-table-column prop="interval" label="时间间隔"> </el-table-column>
      <el-table-column prop="chatType" label="chatType"> </el-table-column>            
      <el-table-column prop="keyword" label="关键字"> </el-table-column>      
      <el-table-column label="回复内容"> <template scope='scope'><el-button type="text" size="small" @click="getreply(scope.row.reply)">查看</el-button></template></el-table-column>
      <el-table-column label="创建日期"> <template scope='scope'>{{formate(scope.row.createAt)}}</template></el-table-column>    
      <el-table-column label="操作"> <template scope='scope'>
      <el-button type="text" size="small" @click="confirm(scope.row.id)">删除</el-button>
      <el-button type="text" size="small" @click="goupdate(scope.row.id)">修改</el-button>      
      </template></el-table-column>                
    </el-table>
  </template>
   <el-dialog title="回复内容" v-model="dialogTableVisible">
    <el-table :data="replylist">
      <el-table-column property="content" label="内容">
      <template scope="scope">
      <div v-if="scope.row.msgType == 3"><img v-bind:src="scope.row.content" width="100"></div>
      <div v-else>{{scope.row.content}}</div>      
      </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'keywordlist',
  data() {
      return {
        keywordlist: [],
        loading: false,
        dialogTableVisible: false,
        replylist: []
      };
    },
    methods: {
      goupdate: function (val) {
        this.$router.push("/updatekeyword?id="+val)
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
      delet: function (val) {
          var self = this
          this.axios.post('/weixin/delete_keyword_setting', {id: val})
          .then(function(res){
              var data = res.data
              if(data.code == 0){
                self.$message("删除成功")
                self.getkeywordlist()
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
      go: function () {
        this.$router.push("/addkeyword")
      },
      getreply: function (val) {
        this.replylist = JSON.parse(val)
        this.dialogTableVisible = true
      },
      ifAutoVerified: function (val) {
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
      getkeywordlist: function () {
        var self = this
        self.loading = true
        this.axios.post('/weixin/get_all_keyword')
          .then(function(res){
              var data = res.data
              self.loading = false
              console.log(data)    
              if(data.code == 0){
                self.keywordlist = data.data
              }    
          })
          .catch(function(err){
              console.log(err);
              self.loading = false
          })
      }
    },
    created: function () {
      this.getkeywordlist()
    }
}
</script>

<style>
  .admin-userlist{width: 100%;padding: 20px}
</style>
