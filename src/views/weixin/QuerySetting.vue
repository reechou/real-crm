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
            <!-- <el-table :data="scope.row.reply">
              <el-table-column property="content" label="内容">
              <template scope="scope">
              <div v-if="scope.row.msgType == 3"><img v-bind:src="scope.row.content" width="100"></div>
              <div v-else>{{scope.row.content}}</div>      
              </template>
              </el-table-column>
            </el-table> -->
            <el-button type="text" @click="showcontentlist = true">查看</el-button>
          </template>
        </el-table-column>   
        <el-table-column label="操作"> <template scope='scope'><el-button type="text" size="small" @click="confirmvertify(scope.row.bindId)">删除</el-button></template></el-table-column>                   
      </el-table>
    </template>

    
    
    <el-row :gutter="20" style="margin-bottom:10px;">
      <el-col :span="3"><h1>关键字设置</h1></el-col>
      <el-col :span="6"><el-button type="primary" size="small" @click="showerrlist = true">新增关键字</el-button></el-col>
    </el-row>
    <template>
      <el-table
        :data="keywordSetting" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column prop="bindId" label="id"></el-table-column>      
        <el-table-column prop="interval" label="时间间隔"> </el-table-column>
        <el-table-column prop="chatType" label="chatType"> </el-table-column>            
        <el-table-column prop="keyword" label="关键字"> </el-table-column>      
        <el-table-column label="回复内容"> <template scope='scope'>
          <!-- <el-table :data="scope.row.reply">
             <el-table-column property="content" label="内容">
            <template scope="scope">
            <div v-if="scope.row.msgType == 3"><img v-bind:src="scope.row.content" width="100"></div>
            <div v-else>{{scope.row.content}}</div>      
            </template>
            </el-table-column>
          </el-table>  -->
          <el-button type="text" @click="getkeycontent(scope.row.reply),showkeylist = true">查看</el-button>
        </template></el-table-column>
        <el-table-column label="操作"> <template scope='scope'><el-button type="text" size="small" @click="confirmkeyword(scope.row.bindId)">删除</el-button></template></el-table-column>                           
      </el-table>
    </template>

    <el-dialog title="好友通过验证回复内容" v-model="showcontentlist">
      <template>
          <el-table :data="contentlist" style="width: 100%;margin-bottom: 80px" >

            <el-table-column label="内容" align="center">
              <template scope="scope">
                <div v-if="scope.row.msgType == 3">
                  <img :src="scope.row.content" width="100">
                </div>
                <div v-else>
                  <span>{{ scope.row.content }}</span>
                </div>
                
              </template>
            </el-table-column>

          </el-table>
      </template>
    </el-dialog>

    <el-dialog title="关键字回复内容" v-model="showkeylist">
      <template>
          <el-table :data="keycontent" style="width: 100%;margin-bottom: 80px" >

            <el-table-column label="内容" align="center">
              <template scope="scope">
                <div v-if="scope.row.msgType == 3">
                  <img :src="scope.row.content" width="100">
                </div>
                <div v-else>
                  <span>{{ scope.row.content }}</span>
                </div>
                
              </template>
            </el-table-column>

          </el-table>
      </template>
    </el-dialog>

    <el-dialog title="关键字设置列表" v-model="showerrlist">
      选择设置{{keywords}}
      <div style="margin-bottom:20px;">
        
        
        
        <el-row type="flex" class="row-bg">
          <el-col :span="20">
            <el-select v-model="chatTypeNum" placeholder="请选择" @change="keytype">
              <el-option
              v-for="item in chatType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
            </el-select>
            <el-button type="primary" @click="onsubmit()">提 交</el-button>
            <el-button @click="showerrlist = false">取 消</el-button>
          </el-col>

          <el-col :span="3"><el-button type="primary" @click="go()">新增关键字回复</el-button></el-col>
        </el-row>
      </div>
      <template>
        <el-checkbox-group v-model="keywords">
          <input type="checkbox" @click="checkAll()"> 全选 &nbsp;&nbsp;
          (已选人数:{{ keywords.length }})
          <el-table :data="keywordlist" style="width: 100%;margin-bottom: 80px" >
            <el-table-column label="id">
              <template scope="scope">
                <el-checkbox :label="scope.row.id"></el-checkbox>
              </template>
            </el-table-column>

            <el-table-column label="时间间隔">
              <template scope="scope">
                {{ scope.row.interval }}
              </template>
            </el-table-column>

            <el-table-column label="chatType">
              <template scope="scope">
                {{ scope.row.chatType }}
              </template>
            </el-table-column>

            <el-table-column label="内容" width="300px">
              <template scope="scope">
                <el-table :data="scope.row.replly">
                  <el-table-column property="content" label="内容详情">
                  <template scope="scope">
                  <div v-if="scope.row.msgType == 3"><img v-bind:src="scope.row.content" width="100"></div>
                  <div v-else>{{scope.row.content}}</div>      
                  </template>
                  </el-table-column>
                </el-table>
              </template>
            </el-table-column>

          </el-table>
        </el-checkbox-group>
      </template>
    </el-dialog>

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
        contentlist: [],
        showcontentlist:false,
        showerrlist: false,
        showkeylist:false,
        keywordlist:[],
        allkeywordlist:[],
        people:[],
        group:[],
        keycontent:[],
        id: '',
        checkall: false,
        keywords: [],
        chatType:[{
          label:'people', value: 0
        },{
          label:'group', value:1
        }],
        chatTypeNum: 0
      };
    },
    methods: {
      keytype:function(){
        if(this.chatTypeNum == 0){
          this.keywordlist = this.people;
        }
        else{
          this.keywordlist = this.group;
        }
      },
      go: function () {
        this.$router.push("/addkeyword")
      },
      getkeycontent:function(val){
        this.keycontent = val;
      },
      checkAll:function(){
        if(!this.checkall){
          this.keywords = [];
          this.keywordlist.forEach((item) =>{
            this.keywords.push(item.id);
          });
          this.checkall = true;
        }
        else{
          this.keywords = [];
          this.checkall = false;
        }
      },
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
          this.axios.post('/weixin/delete_verify', {id: val})
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
          this.axios.post('/weixin/delete_keyword', {id: val})
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
              self.contentlist = [];
              self.keycontent = [];   
              if(data.code == 0){
                self.verifySetting = [data.data.verifySetting]
                self.contentlist = data.data.verifySetting.reply;
                self.keywordSetting = data.data.keywordSetting;             
              }    
          })
          .catch(function(err){
              console.log(err);
              self.loading = false
          })
      },
      getkeywordlist: function () {
        var self = this
        this.axios.post('/weixin/get_all_keyword')
          .then(function(res){
              var data = res.data  
              self.people = [];
              self.group = [];
              self.allkeywordlist = [];
              if(data.code == 0){
                self.allkeywordlist = data.data
              }    
              for(var i=0; i < self.allkeywordlist.length; i++){
                self.$set(self.allkeywordlist[i], 'replly', JSON.parse(self.allkeywordlist[i].reply));
              }
              for(var i=0; i< self.allkeywordlist.length; i++){
                if(self.allkeywordlist[i].chatType == 'people'){
                  self.people.push(self.allkeywordlist[i]);
                }
                else{
                  self.group.push(self.allkeywordlist[i]);
                }
              }
              console.log(self.people)
              self.keytype();
          })
          .catch(function(err){
              console.log(err);
          })
      },
      onsubmit:function(){
        var self = this;
        var weixinid = Number.parseInt(this.$route.query.id)
        if(this.keywords.length == 0){
          self.$message("请选择关键字设置");
        }
        else{
          for(var i=0; i < this.keywords.length; i++){
            this.axios.post('/weixin/create_keyword',{
              weixinId: weixinid,
              weixinKeywordSettingId: this.keywords[i]
            })
              .then(function(res){
                var data = res.data;
                if(data.code == 0){
                  self.$message("创建成功");
                  self.showerrlist = false;
                  self.getweixinlist();
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
          self.keywords = [];
        }
      }
    },
    created: function () {
      this.id = Number.parseInt(this.$route.query.id)
      this.getweixinlist();
      this.getkeywordlist();
    }
}
</script>

<style>
  .admin-userlist{width: 100%;padding: 20px}
  h1{font-size: 16px;margin-bottom: 10px}
</style>
