<template>
  <div style="width: 100%">
   <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="微信号" prop="wechat">
        <el-input type="text" v-model="ruleForm.wechat" style="width: 400px;"></el-input>
        <el-button type="primary" @click="submitForm('ruleForm')" style="margin-bottom: 10px;">提交</el-button>

      </el-form-item>
      
    </el-form>
    <h1>选择好友通过验证设置</h1>
    <template>
     <el-table :data="verifySetting" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column label="选择"> <template scope="scope"><input type="radio" name="radio" @click="addradio(scope.row.id)"></template></el-table-column>     
        <el-table-column prop="interval" label="时间间隔"> </el-table-column>
        <el-table-column label="是否自动通过好友添加"> <template scope='scope'>{{ifAutoVerified(scope.row.ifAutoVerified)}}</template></el-table-column>
        <el-table-column label="回复内容"> 
          <template scope='scope' v-if="JSON.parse(scope.row.reply).length>0">
            <el-table :data="JSON.parse(scope.row.reply)">
              <el-table-column property="content" label="内容">
              <template scope="scope">
              <div v-if="scope.row.msgType == 3"><img v-bind:src="scope.row.content" width="100"></div>
              <div v-else>{{scope.row.content}}</div>      
              </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>   
      </el-table>
    </template>
     <h1>选择关键字设置</h1>
    <template>
       <el-checkbox-group v-model="ruleForm.keywordIds">
        <el-table :data="keywordSetting" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
          <el-table-column prop="id" label="选择"><template scope="scope">
            <el-checkbox :label="scope.row.id"></el-checkbox>
          </template></el-table-column>                
          <el-table-column prop="id" label="id"></el-table-column>      
          <el-table-column prop="interval" label="时间间隔"> </el-table-column>
          <el-table-column prop="chatType" label="chatType"> </el-table-column>            
          <el-table-column prop="keyword" label="关键字"> </el-table-column>      
          <el-table-column label="回复内容"> <template scope='scope' v-if="JSON.parse(scope.row.reply).length>0">
            <el-table :data="JSON.parse(scope.row.reply)">
              <el-table-column property="content" label="内容">
              <template scope="scope">
              <div v-if="scope.row.msgType == 3"><img v-bind:src="scope.row.content" width="100"></div>
              <div v-else>{{scope.row.content}}</div>      
              </template>
              </el-table-column>
            </el-table>
          </template></el-table-column>
        </el-table>
        </el-checkbox-group>
      </template>
     <h1>选择任务</h1>
      <template>
      <el-checkbox-group v-model="ruleForm.taskIds">
    <el-table :data="tasklist" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
       <el-table-column prop="id" label="选择"><template scope="scope">
            <el-checkbox :label="scope.row.id"></el-checkbox>
          </template></el-table-column>           
      <el-table-column prop="id" label="id"></el-table-column>      
      <el-table-column label="是否默认"><template scope="scope">{{scope.row.ifDefault?"是":"否"}} </template></el-table-column>
      <el-table-column label="任务类型"><template scope="scope">{{type(scope.row.taskType)}} </template></el-table-column>      
      <el-table-column label="创建日期"> <template scope='scope'>{{formate(scope.row.createAt)}}</template></el-table-column> 
      <el-table-column label="内容">
          <template scope="scope" v-if="scope.row.taskType == 4">
            <el-table :data="[JSON.parse(scope.row.data)]">
              <el-table-column property="basicInfo.city" label="城市"></el-table-column>
              <el-table-column property="basicInfo.nickname" label="昵称"> </el-table-column>
              <el-table-column property="basicInfo.province" label="地区"> </el-table-column>
              <el-table-column property="basicInfo.signature" label="内容"> </el-table-column>       
            </el-table>
          </template>
           <template scope="scope" v-if="scope.row.taskType == 2">
            <el-table :data="[JSON.parse(scope.row.data)]">
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
          </template>
           <template scope="scope" v-if="scope.row.taskType == 3">
            <el-table :data="[JSON.parse(scope.row.data)]">
              <el-table-column property="interval" label="间隔"></el-table-column>
              <el-table-column property="nickname" label="公众号列表"> 
                <template scope = "scope">
                  <div v-for="item in scope.row.cards">{{item}}</div>
              </template>
              </el-table-column>
                  
            </el-table>
         </template>
          <template scope="scope" v-if="scope.row.taskType == 1">
            <el-table :data="[JSON.parse(scope.row.data)]">
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
         </template>
      </el-table-column> 
    </el-table>
    </el-checkbox-group>
  </template>
  
        <el-button type="primary" @click="submitForm('ruleForm')" style="margin-bottom: 10px">提交</el-button>
      
  </div>
</template>

<script>
export default {
  name: 'setweixin',
  data() {
      return {
        ruleForm: {
          wechat: '',
          verifyId: 6,
          keywordIds: [6],
          taskIds: [1]
        },
        rules: {
          wechat: [
            { required: true, message: '请输入微信号', trigger: 'blur' }
          ]
        },
        tasklist: [],
        verifySetting: [],
        keywordSetting: [],
        loading: false
      };
    },
    methods: {
      addradio: function (val) {
          this.ruleForm.verifyId = val
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
      ifAutoVerified: function (val) {
          return val ? '是' : '否'
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
      submitForm(formName) {
        var self = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            self.axios.post('/weixin/create_weixin',{wechat: self.ruleForm.wechat, verifyId: self.ruleForm.verifyId, keywordIds: self.ruleForm.keywordIds, taskIds: self.ruleForm.taskIds})
              .then((response) => {
                var data = response.data
                if(data.code == 0){
                  self.$message("设置成功")
                }else{
                  self.$message("设置失败")
                }
                console.log(data)
              }, (response) => {
                console.log(response);
                self.$message("设置失败")
              });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getsettinglist: function () {
        var self = this
        self.loading = true
        this.axios.post('/weixin/get_all_verify')
          .then(function(res){
              var data = res.data
              self.loading = false
              console.log(data)    
              if(data.code == 0){
                self.verifySetting = data.data
              }    
          })
          .catch(function(err){
              console.log(err);
              self.loading = false
          })
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
                self.keywordSetting = data.data
              }    
          })
          .catch(function(err){
              console.log(err);
              self.loading = false
          })
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
      this.ruleForm.wechat = this.$route.query.id
      this.getsettinglist()
      this.getkeywordlist()
      this.gettasklist()
    }
}
</script>

<style scoped>
  .text{font-size: 14px;overflow: hidden;padding: 10px 0}
  .input{width: 300px}
</style>
