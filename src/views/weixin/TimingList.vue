<template>
  <div class="admin-timelist">
    <div style="width: 100%; padding: 10px">
      <span style="padding-right:40px">当前微信id:{{ WeiXinID }}</span>
      <span style="padding-right:40px">选择任务id: {{ outtaskIds }}</span>
      <span style="padding-right:40px">选择标签id: {{ value }}</span>
      <span>选择时间范围id: {{ time }}</span>
      <br/><br/>
      <el-select v-model="value" placeholder="请选择">
        <el-option
        v-for="item in taglist"
        :key="item.tagType"
        :label="item.groupName"
        :value="item.tagType">
        </el-option>
      </el-select>
      <el-button @click="getreply">任务选择</el-button>
      <el-select v-model="time" placeholder="请选择">
        <el-option
        v-for="item in options"
        :key="item.label"
        :label="item.value"
        :value="item.label">
        </el-option>
      </el-select>
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </div>
    <template>
        <el-table :data="timetasklist" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
          <el-table-column label="id">
            <template scope="scope">{{ scope.row.id }}</template>
          </el-table-column>
          <el-table-column label="标签id">
            <template scope="scope">{{scope.row.tagId }} </template>
          </el-table-column>
          <el-table-column label="时间段">
            <template scope="scope">{{scope.row.timeId}} </template>
          </el-table-column>
          <el-table-column label="任务内容">
            <template scope="scope">
              <el-button type="text" size="small" @click="getupdateset(scope.row.taskId)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template scope="scope"><el-button @click="confirm(scope.row.id)">删除</el-button></template>
          </el-table-column>
        </el-table>
    </template>
      <div style="margin-bottom: 40px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size = 'pagesize' ayout="total, prev, pager, next" :total = 'totalpage'></el-pagination>
      </div>
    <el-dialog title="任务列表" v-model="dialogTableVisible" style="height: 100%">
        <p>选择的任务：{{ intaskIds }}</p>
        <el-row :gutter="20">
          <el-col :span="6" :offset="21"><el-button @click="selecttask(intaskIds)">确定</el-button></el-col>
        </el-row>
        <el-checkbox-group v-model="intaskIds">
        <el-table :data="tasklistby1" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
          <el-table-column label="选择">
            <template scope="scope">
              <el-checkbox :label="scope.row.id"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="id"></el-table-column>
          <el-table-column label="是否默认">
            <template scope="scope">{{scope.row.ifDefault?"是":"否"}} </template>
          </el-table-column>
          <el-table-column label="任务类型">
            <template scope="scope">{{type(scope.row.taskType)}} </template>
          </el-table-column>
          <el-table-column label="任务内容">
            <template scope='scope'> 
              <el-tooltip placement="bottom">
                 <div slot="content" style="width:400px;" >{{ scope.row.data | linkjiexi }}</div> 
                 <div slot="content" style="width:400px;" >{{ scope.row.data | textjiexi }}</div> 
                 <div slot="content" style="width:400px;" ><img :src="scope.row.data | picjiexi" alt="" width="100"></div>  
                <el-button type="text">查看</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        </el-checkbox-group>
        <el-row :gutter="20">
          <el-col :span="6" :offset="6"><div></div></el-col>
          <el-col :span="6" :offset="18"><el-button @click="selecttask(intaskIds)">确定</el-button></el-col>
        </el-row>

    </el-dialog>
   <el-dialog title="回复内容" v-model="dialogTableVisible1">
    <el-table :data="replylist1">
      <el-table-column property="interval" label="时间间隔"></el-table-column>
       <el-table-column property="textMsgs" label="文本消息"> </el-table-column>
       <el-table-column property="cardMsgs" label="名片消息"> </el-table-column>
       <el-table-column property="picMsg" label="图片消息"> <template scope="scope"><img :src="scope.row.picMsg" alt="" width="100"></template></el-table-column>
       <el-table-column property="dataUrl" label="资源文件链接"></el-table-column>  
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
  data() {
    return{
      taglist:[],
      tasklist:[],
      tasklistby1:[],
      intaskIds:[],
      outtaskIds:[],
      timetasklist:[],
      alltimetask:[],
      replylist1: [],
      value: null,
      time:null,
      pagesize: 100,
      totalpage: 8,
      currentPage: 1,
      WeiXinID: null,
      dialogTableVisible: false,
      dialogTableVisible1: false,
      loading: false,
      ispic:false,
      options:[{
        label:1,value:'提前半小时到一个半小时'
      },{
        label:2,value:'提前一个半小时到两个半小时'
      },{
        label:3,value:'提前两个半小时到三个半小时'
      },{
        label:4,value:'提前三个半小时到四个半小时'
      },{
        label:5,value:'提前四个半小时到五个半小时'
      },{
        label:6,value:'提前五个半小时到六个半小时'
      },{
        label:7,value:'提前六个半小时到七个半小时'
      },{
        label:8,value:'提前七个半小时到八个半小时'
      },{
        label:9,value:'提前八个半小时到九个半小时'
      },{
        label:10,value:'提前九个半小时到十个半小时'
      },{
        label:11,value:'提前十个半小时到十一个半小时'
      },{
        label:12,value:'提前十一个半小时到十二个半小时'        
      }]
    }
  },
  filters:{
    textjiexi: function(val){
      var d = JSON.parse(val);
        return d.textMsgs;
    },
    picjiexi: function(val){
      var d = JSON.parse(val);
      return d.picMsg;
    },
    linkjiexi: function(val){
      var d = JSON.parse(val);
      return d.linkMsgs;
    }
  },
  methods:{
    selecttask: function(val) {
      if(val.length >1){
        this.$message("只能选择一个任务");
        return false;
      }
      else{
        for(var i = 0 ; i < val.length; i++){
           this.outtaskIds = val[i];
        }
        console.log(this.outtaskIds)
        this.dialogTableVisible = false;
      }
    },
    getreply: function() {
        this.dialogTableVisible = true;
    },
    checktask:function(val) {
      console.log(val);
      console.log(11111111)
      this.replylist1 = [JSON.parse(val)];
      this.dialogTableVisible1 = true;
    },
    type: function(val) {
      if(val == 1){
        return '通讯录好友群发';
      }
    },
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
      handleSizeChange: function (){
        var self = this
        self.timetasklist = []
        var j = self.currentPage == Math.ceil(self.alltimetask.length/self.pagesize) ? self.alltimetask.length : self.currentPage*self.pagesize
        for(var i = (self.currentPage-1)*self.pagesize; i < j; i++){
            self.timetasklist.push(self.alltimetask[i])             
          }
      },
      handleCurrentChange: function (val){
          var self = this
          self.timetasklist = []
          self.currentPage = val
        var j = val == Math.ceil(self.alltimetask.length/self.pagesize) ? self.alltimetask.length : val * self.pagesize  
        for(var i = (val-1)*self.pagesize; i < j; i++){
            self.timetasklist.push(self.alltimetask[i])             
          }
      },
    confirm: function(val){
      var self = this;
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.delete(val);
      }).catch((err) => {
        console.log(err)
      })
    },
    delete: function(val) {
      var self = this;
      this.axios.post('/weixin/delete_timer_task',{id: val})
          .then(function(res){
            var data = res.data;
            if(data.code == 0){
              self.$message("删除成功");
              self.gettimetasklist();
            }
            else{
              self.$message("删除失败");
            }
          })
          .catch(function(err){
            console.log(err);
            self.$message("删除失败");
          })
    },
    gettaglist: function() {
      var self = this;
      this.axios.get('/weixin/get_weixin_friends_tags')
          .then(function(res){
            var data = res.data;
            if(data.code == 0){
              self.taglist = data.data;
            }
          })
    },
    gettacklist: function() {
      var self = this;
      self.loading = true;
      this.axios.post('/weixin/get_all_task')
          .then(function(res){
            var data = res.data;
            self.loading = false;
            self.tasklist = [];
            console.log(data);
            if(data.code == 0){
              self.tasklist = data.data;
            }
            for(var i = 0; i < self.tasklist.length; i++){
              if(self.tasklist[i].taskType == 1){
                self.tasklistby1.push(self.tasklist[i]);
              }
            }
          })
          .catch(function(err){
            self.loading = false;
          })
    },
    gettimetasklist: function() {
      var self = this;
      self.loading = true;
      var Id = Number.parseInt(this.$route.query.id)
      this.axios.post('/weixin/get_timer_task_list',{
        weixinId: Id
      })
          .then(function(res){
            var data = res.data;
            self.loading = false;
            if(data.code == 0){
              self.alltimetask = data.data;
              self.totalpage = self.alltimetask.length;
              self.timetasklist = [];
              var currentSize = self.currentPage*self.pagesize;
              if(currentSize > self.alltimetask.length){
                currentSize = self.alltimetask.length;
              }
              for(var i=(self.currentPage-1)*self.pagesize; i<currentSize; i++){
                self.timetasklist.push(self.alltimetask[i]);
              }
            }
          })
          .catch(function(err){
            console.log(err)
            self.loading = false;
          })
    },
    getupdateset: function (val) {
      var self = this
      this.axios.post('/weixin/get_task_from_id', { id: val })
        .then(function (res) {
          var data = res.data;
          console.log(data);
          if (data.code == 0) {
            self.checktask(data.data.data);
          }
        })
        .catch(function (err) {
          console.log(err);
        })
    },
    onSubmit:function() {
      var self = this;
      // console.log(self.value);
      // console.log(self.time);
      // console.log(self.outtaskIds);
      // console.log(this.WeiXinID);
      this.axios.post('/weixin/create_timer_task',{
        weixinId: this.WeiXinID,
        tagId:  self.value,
        timeId: self.time,
        taskId: self.outtaskIds
      })
      .then(function(res){
        var data = res.data;
        if(data.code == 0){
          self.$message("创建成功");
          self.gettimetasklist();
        }
        else{
          self.$message("创建失败");
        }
      })
       .catch(function (err){
         console.log(err);
         self.$message("创建失败");
       })
    }
  },
  created(){
    this.gettimetasklist();
    this.gettaglist();
    this.gettacklist();
    this.WeiXinID = Number.parseInt(this.$route.query.id)
    console.log(this.WeiXinID)
  }
}
</script>

<style>
.admin-timelist {
  width: 100%;
  padding: 20px;
}
</style>
