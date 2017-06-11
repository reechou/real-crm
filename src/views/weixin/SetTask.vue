<template>
  <div class="admin-userlist">
    <div class="" style="text-align: center;padding: 10px 0"></div>
    <template>
    <el-table
      :data="tasklist" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
                
      <el-table-column prop="id" label="id"></el-table-column>      
      <el-table-column label="是否默认"><template scope="scope">{{scope.row.ifDefault?"是":"否"}} </template></el-table-column>
      <el-table-column label="任务类型"><template scope="scope">{{type(scope.row.taskType)}} </template></el-table-column>      
      <el-table-column label="任务内容"> <template scope='scope'><el-button type="text" size="small" @click="getreply(scope.row.data, scope.row.taskType)">查看</el-button></template></el-table-column>
      <el-table-column label="创建日期"> <template scope='scope'>{{formate(scope.row.createAt)}}</template></el-table-column>  
      <el-table-column prop="id" label="选择">
        <template scope="scope">
          <el-button type="primary" @click="open2(scope.row.id)">确认</el-button>
        </template>
      </el-table-column>      
    </el-table>
  </template>
   <el-dialog title="回复内容" v-model="dialogTableVisible4">
    <el-table :data="replylist4">
      <el-table-column property="basicInfo.city" label="城市"></el-table-column>
       <el-table-column property="basicInfo.nickname" label="昵称"> </el-table-column>
       <el-table-column property="basicInfo.province" label="地区"> </el-table-column>
       <el-table-column property="basicInfo.signature" label="内容"> </el-table-column>       
    </el-table>
  </el-dialog>
   <el-dialog title="回复内容" v-model="dialogTableVisible2">
    <el-table :data="replylist2">
      <el-table-column property="text" label="文字"></el-table-column>
       <el-table-column property="nickname" label="媒体"> 
       <template scope = "scope">
          <div v-if="scope.row.type == 'img'">
            <div v-for="item in scope.row.media">
               <img :src="item" width="100"/>              
            </div>
          </div>
          <div v-else>
            视频：
            <div v-for="item in scope.row.media">
                  {{item}}          
            </div>
          </div>
       </template>
        </el-table-column>
             
    </el-table>
  </el-dialog>
   <el-dialog title="回复内容" v-model="dialogTableVisible3">
    <el-table :data="replylist3">
      <el-table-column property="interval" label="间隔"></el-table-column>
       <el-table-column property="nickname" label="公众号列表"> 
        <template scope = "scope">
          <div v-for="item in scope.row.cards">{{item}}</div>
       </template>
       </el-table-column>
           
    </el-table>
  </el-dialog>
   <el-dialog title="回复内容" v-model="dialogTableVisible1">
    <el-table :data="replylist1">
      <el-table-column property="interval" label="时间间隔"></el-table-column>
       <el-table-column property="textMsgs" label="文本消息"> </el-table-column>
       <el-table-column property="cardMsgs" label="名片消息"> </el-table-column>
       <el-table-column property="picMsg" label="图片消息"> <template scope="scope"><img :src="scope.row.picMsg" alt="" width="100"></template></el-table-column>   
       <el-table-column label="链接消息">
          <template scope="scope">
            <div v-for="item in scope.row.linkMsgs">
              <ul>
                  <li>
                    标题：{{item.title}}
                  </li>
                  <li>
                    描述：{{item.desc}}
                  </li>
                  <li>
                    图片：<img :src="item.showPicUrl" alt="" width="100">
                  </li>
                   <li>
                    链接：<a :href="item.linkUrl" target="_blank">{{item.linkUrl}}</a>
                  </li>
              </ul>
            </div>
          </template>
       </el-table-column>                  
    </el-table>
  </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'settask',
  data() {
      return {
        tasklist: [],
        loading: false,
        dialogTableVisible1: false,
        dialogTableVisible2: false,
        dialogTableVisible3: false,
        dialogTableVisible4: false,        
        replylist1: [],
        replylist2: [],
        replylist3: [],
        replylist4: [],
        weixinId: '',
        weixinTaskId: ''
      };
    },
    methods: {
      open2(val) {
        this.weixinTaskId = val
        var self = this
        this.$confirm('确认操作, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.queren()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      queren: function () {  
          var self = this
           this.axios.post('/weixin/create_weixin_task', {weixinId: this.weixinId, weixinTaskId: this.weixinTaskId})
            .then(function(res){
                var data = res.data
                  
                if(data.code == 0){
                  self.$message("创建成功")
                }   
                else{
                  self.$message("创建失败")                  
                } 
            })
            .catch(function(err){
                console.log(err);
                  self.$message("创建失败")                                  
            })
      },
      type: function (val) {
        if(val == 1){
          return '通讯录'
        }
        else if(val == 2){
          return '朋友圈'
        }
        else if(val == 3){
          return '关注公众号'
        }
        else if(val == 4){
          return '修改个人信息'
        }
      },
      getreply: function (val, type) {
        if(type == 1){
           this.replylist1 = [JSON.parse(val)]
           this.dialogTableVisible1 = true
        }
         else if(type == 2){
           this.replylist2 = [JSON.parse(val)]
           this.dialogTableVisible2 = true
        }
         else if(type == 3){
           this.replylist3 = [JSON.parse(val)]
           this.dialogTableVisible3 = true
        }
         else if(type == 4){
           this.replylist4 = [JSON.parse(val)]
           this.dialogTableVisible4 = true
        }
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
      gettasklist: function () {
        var self = this
        self.loading = true
        this.axios.post('/weixin/get_all_task')
          .then(function(res){
              var data = res.data
              self.loading = false
              console.log(data)    
              if(data.code == 0){
                self.tasklist = data.data
              }    
          })
          .catch(function(err){
              console.log(err);
              self.loading = false
          })
      }
    },
    created: function () {
      this.weixinId = Number.parseInt(this.$route.query.id)
      this.gettasklist()
    }
}
</script>

<style>
  .admin-userlist{width: 100%;padding: 20px}
</style>
