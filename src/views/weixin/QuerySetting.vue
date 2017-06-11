<template>
  <div class="admin-userlist">
    <h1>好友通过验证设置</h1>
    <template>
     <el-table
        :data="verifySetting" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column prop="interval" label="时间间隔"> </el-table-column>
        <el-table-column label="是否自动通过好友添加"> <template scope='scope'>{{ifAutoVerified(scope.row.ifAutoVerified)}}</template></el-table-column>
        <el-table-column label="回复内容"> 
          <template scope='scope'>
            <el-table :data="scope.row.reply">
              <el-table-column property="content" label="内容">
              <template scope="scope">
              <div v-if="scope.row.msgType == 3"><img v-bind:src="scope.row.content" width="100"></div>
              <div v-else>{{scope.row.content}}</div>      
              </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>   
        <el-table-column label="操作"> <template scope='scope'><el-button type="text" size="small" @click="confirmvertify(scope.row.bindId)">删除</el-button></template></el-table-column>                   
      </el-table>
    </template>
    <h1>关键字设置</h1>
    <template>
      <el-table
        :data="keywordSetting" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column prop="id" label="id"></el-table-column>      
        <el-table-column prop="interval" label="时间间隔"> </el-table-column>
        <el-table-column prop="chatType" label="chatType"> </el-table-column>            
        <el-table-column prop="keyword" label="关键字"> </el-table-column>      
        <el-table-column label="回复内容"> <template scope='scope'>
          <el-table :data="scope.row.reply">
            <el-table-column property="content" label="内容">
            <template scope="scope">
            <div v-if="scope.row.msgType == 3"><img v-bind:src="scope.row.content" width="100"></div>
            <div v-else>{{scope.row.content}}</div>      
            </template>
            </el-table-column>
          </el-table>
        </template></el-table-column>
        <el-table-column label="操作"> <template scope='scope'><el-button type="text" size="small" @click="confirmkeyword(scope.row.bindId)">删除</el-button></template></el-table-column>                           
      </el-table>
    </template>
  </div>
</template>

<script>
export default {
  name: 'querysetting',
  data() {
      return {
        weixinlist: [],
        loading: false,
        verifySetting: [],
        keywordSetting: [],
        id: ''
      };
    },
    methods: {
      confirmvertify(val) {
        var self = this
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.deletverify(val)
        }).catch(() => {
                    
        });
      },
      deletverify: function (val) {
          var self = this
          this.axios.post('/weixin/delete_verify', {id: this.id})
          .then(function(res){
              var data = res.data
              if(data.code == 0){
                self.$message("删除成功")
                self.getweixinlist()
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
      confirmkeyword(val) {
        var self = this
        this.$confirm('是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.deletkeyword(val)
        }).catch(() => {
                    
        });
      },
      deletkeyword: function (val) {
          var self = this
          this.axios.post('/weixin/delete_keyword', {id: this.id})
          .then(function(res){
              var data = res.data
              if(data.code == 0){
                self.$message("删除成功")
                self.getweixinlist()
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
      ifExecDefaultTask: function (val) {
          return val ? '是' : '否'
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
      getweixinlist: function () {
        var self = this
        self.loading = true
        this.axios.post('/weixin/get_setting_from_id', {id: this.id})
          .then(function(res){
              var data = res.data
              self.loading = false
              console.log(data)    
              if(data.code == 0){
                self.verifySetting = [data.data.verifySetting]
                self.keywordSetting = data.data.keywordSetting                
              }    
          })
          .catch(function(err){
              console.log(err);
              self.loading = false
          })
      }
    },
    created: function () {
      this.id = Number.parseInt(this.$route.query.id)
      this.getweixinlist()
    }
}
</script>

<style>
  .admin-userlist{width: 100%;padding: 20px}
  h1{font-size: 16px;margin-bottom: 10px}
</style>
