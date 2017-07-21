<template>
  <div class="admin-userlist">
    <!-- 选中任务id:{{ taskIds }}
    <div class="" style="padding: 10px 0">
      <el-button type="primary" @click="onSubmit">提交</el-button>
       <el-button @click="gotags">选择标签</el-button> 
    </div> -->
    <div class="task">
    <el-row :gutter="20">
      <el-col :span="18"><p>选中任务id:{{ taskIds }}</p></el-col>
      <el-col :span="6" align="center"><el-button type="primary" @click="onSubmit">提交</el-button></el-col>
    </el-row>
    <template>
      <el-checkbox-group v-model="taskIds">
        <input type="checkbox" @click="checkAll">全选
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
              <el-button type="text" size="small" @click="getreply(scope.row.data, scope.row.taskType)">查看</el-button>
            </template>
          </el-table-column>
          <el-table-column label="创建日期">
            <template scope='scope'>{{formate(scope.row.createAt)}}</template>
          </el-table-column>
        </el-table>
      </el-checkbox-group>
    </template>
    <el-dialog title="回复内容" v-model="dialogTableVisible1">
      <el-table :data="replylist1">
        <el-table-column property="interval" label="时间间隔"></el-table-column>
        <el-table-column property="textMsgs" label="文本消息"> </el-table-column>
        <el-table-column property="cardMsgs" label="名片消息"> </el-table-column>
        <el-table-column property="picMsg" label="图片消息">
          <template scope="scope">
            <img :src="scope.row.picMsg" alt="" width="100">
          </template>
        </el-table-column>
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
                  图片：
                  <img :src="item.showPicUrl" alt="" width="100">
                </li>
                <li>
                  链接：
                  <a :href="item.linkUrl" target="_blank">{{item.linkUrl}}</a>
                </li>
              </ul>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'settask',
  data() {
    return {
      taskIds: [],
      tasklist: [],
      tasklistby1: [],
      loading: false,
      dialogTableVisible1: false,
      replylist1: [],
      weixinId: 0,
      weixinTaskId: '',
      checkall: false,
      weixinids: [],
      selectfriends:[]
    };
  },
  methods: {
    checkAll: function () {//全选
      if (!this.checkall) {
        this.taskIds = []
        this.tasklistby1.forEach((item) => {
          this.taskIds.push(item.id);
        });
        this.checkall = true
      }
      else {
        this.taskIds = []
        this.checkall = false
      }
    },
    type: function (val) {
      if (val == 1) {
        return '通讯录好友群发'
      }
    },
    getreply: function (val, type) {
      if (type == 1) {
        this.replylist1 = [JSON.parse(val)]
        this.dialogTableVisible1 = true
      }
    },
    ifAutoVerified: function (val) {
      return val ? '是' : '否'
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
    gettasklist: function () {
      var self = this;
      self.loading = true;
      this.axios.post('/weixin/get_all_task')
        .then(function (res) {
          var data = res.data;
          self.loading = false;
          self.tasklistby1 = [];
          console.log(data)
          if (data.code == 0) {
            self.tasklist = data.data;
          }
          for (var i = 0; i < self.tasklist.length; i++) {
            if (self.tasklist[i].taskType == 1) {
              self.tasklistby1.push(self.tasklist[i]);
            }
          }
        })
        .catch(function (err) {
          console.log(err);
          self.loading = false
        })
    },
    onSubmit: function () {
      var self = this;
      this.selectfriends = this.$route.query.selectfri;
      console.log(this.selectfriends);
      this.axios.post('/weixin/create_selected_friends_task', {
        weixinId: self.weixinId,
        weixinTaskId: Number.parseInt(this.taskIds),
        friends: this.selectfriends
      })
        .then(function (res) {
          var data = res.data;
          if (data.code == 0) {
            self.$message("创建成功");
          }
          else {
            self.$message("创建失败");
          }
        })
        .catch(function (err) {
          console.log(err);
          self.$message("创建失败");
        })
    },
  },
  created: function () {
    this.weixinId = Number.parseInt(this.$route.query.id)
    this.gettasklist()
  }
}
</script>

<style>
.admin-userlist {
  width: 100%;
  padding: 20px
}
</style>
