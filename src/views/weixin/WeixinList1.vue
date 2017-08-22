<template>
  <div class="admin-userlist">
    <div style="width: 100%; padding: 10px">
      <el-row>
        <el-col :span="21">
          <el-button type="primary" @click="showWeixinlist=true" style="margin-top: 10px;">获取好友</el-button>
          <el-button type="primary" @click="reset()" style="margin-right: 30px;">重置</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" size="large" @click="onSubmit()">提交</el-button>
        </el-col>
      </el-row>
    </div>
    <div style="width: 100%;padding: 10px">
      <label>标签列表: </label>
      <el-button type="primary" v-for="item in alltagslist" @click="getfbytag(item.id),color2(0)" v-bind:style="{background:tbuttoncolor}">{{ item.groupName }}</el-button>
    </div>
    <div style="width:100%; padding:10px">
      <label>具体时间段查询:</label>
      <el-date-picker v-model="startTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始日期时间"></el-date-picker> -
      <el-date-picker v-model="endTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束日期时间"></el-date-picker>
      <el-button type="primary" @click="Issearch()">搜索</el-button>
    </div>
    <div style="width:100%; padding: 10px">
      <label>以当前时间为起点查询:</label>
      <el-button type="primary" @click="getfribytat(1,0.5),color(0)" v-bind:style="{background:backcolor0}">0.5-1小时</el-button>
      <el-button type="primary" @click="getfribytat(2,1),color(1)" v-bind:style="{background:backcolor1}">1-2小时</el-button>
      <el-button type="primary" @click="getfribytat(6,2),color(2)" v-bind:style="{background:backcolor2}">2-6小时</el-button>
      <el-button type="primary" @click="getfribytat(12,6),color(3)" v-bind:style="{background:backcolor3}">6-12小时</el-button>
      <el-button type="primary" @click="getfribytat(24,12),color(4)" v-bind:style="{background:backcolor4}">12-24小时</el-button>
    </div>

    <el-dialog title="选取微信号" v-model="showWeixinlist">
      <div>
        <label for="">所选id：</label>
        <span v-for="item in weixinids">{{item.id}}, </span>
      </div>
      <div style="width: 400px;padding: 10px">
        <el-input placeholder="请输入微信号" icon="search" v-model="searchcontent" :on-icon-click="handleIconClick" @keyup.enter.native="show($event)"></el-input>
      </div>
      <div style="padding: 10px;">
        <el-button type="primary" @click="getweixinlist()">显示全部微信</el-button>
        <el-button type="primary" @click="showWeixinlist = false, getfriendslist(1)">确定</el-button>
        <el-button type="primary" @click="showWeixinlist=false, weixinids=[]">取消</el-button>
      </div>
      <template>
        <el-checkbox-group v-model="weixinids">
          <input type="checkbox" @click="checkAll()">全选
          <el-table :data="weixinlist" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
            <el-table-column prop="id" label="选择">
              <template scope="scope">
                <el-checkbox :label="scope.row"></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="id"> </el-table-column>
            <el-table-column prop="nickName" label="微信昵称"> </el-table-column>
            <el-table-column prop="wxId" label="微信id"></el-table-column>
            <el-table-column prop="wechat" label="微信号"> </el-table-column>
            <el-table-column label="是否已执行默认任务">
              <template scope='scope'>{{ifExecDefaultTask(scope.row.ifExecDefaultTask)}}</template>
            </el-table-column>
            <el-table-column label="创建日期">
              <template scope='scope'>{{formate(scope.row.createAt)}}</template>
            </el-table-column>
          </el-table>
        </el-checkbox-group>
      </template>
      <div style="margin-bottom: 40px">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size='pagesize' ayout="total, prev, pager, next" :total='totalpage'></el-pagination>
      </div>
    </el-dialog>

    <template>
      <el-checkbox-group v-model="selectwx">
      <el-table :data="weixinids" style="width: 100%">
        <el-table-column type="expand">
          <template scope="scope">
            <el-table :data="friendpack[scope.$index]" style="width: 100%">
              <el-table-column label="id">
                <template scope="scope">
                  <span>{{ scope.row.id }}</span>
                </template>
              </el-table-column>

              <el-table-column label="昵称">
                <template scope="scope">
                  <span>{{ scope.row.nickName }}</span>
                </template>
              </el-table-column>

              <el-table-column label="添加时间">
                <template scope="scope">
                  <span>{{ formate(scope.row.addContactTime) }}</span>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="微信id">
          <template scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="wxId">
          <template scope="scope">
            <span>{{ scope.row.wxId }}</span>
          </template>
        </el-table-column>

        <el-table-column label="微信号">
          <template scope="scope">
            <span>{{ scope.row.wechat }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建日期">
          <template scope="scope">
            <span>{{ formate(scope.row.createAt) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template scope="scope">
            <el-button @click="confirm(scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
      </el-checkbox-group>
    </template>
  </div>
</template>

<script>
export default {
  name: 'weixinlist1',
  data() {
    return {
      selectwx: [],
      weixinlist: [],
      loading: false,
      searchcontent: '',
      allweixinlist: [],
      pagesize: 100,
      totalpage: 8,
      currentPage: 1,
      weixinids: [],
      taskids: [],
      checkall: false,

      tagfrilist: [],       // 根据标签得到的好友列表
      istag: false,  // 标记是否为根据tag查询得到的列表,
      tagid: null,         // 获取tagID
      startT: null,       // 开始时间的时间戳过渡变量
      endT: null,          // 结束时间的时间戳过渡变量
      startTime: null,       // 通过时间选择器选择到的开始时间（中国标准时间格式）
      endTime: null,        // 通过时间选择器选择到的结束时间（中国标准时间格式）
      isTimelist: false,    //  用来判断当前显示的是否为以时间为条件显示的列表， 如果是 则分页功能需在客户端进行  为否 则在后端进行分页功能了 前端不用调用分页方法
      wxIds: [],             //　用来存放通过checkbox选择到的列表的微信ID
      friendslist: [],        // 用来再页面显示的好友列表
      frilistbytime: [],
      alltagslist: [],
      showWeixinlist: false,
      a: Date.now(),          // 获取当前时间点
      time: null,
      Clicktime: 0,           // 用来记录点击时间快捷键的次数
      firstclick: {            // 用来记录第一次点击时间快捷键后得到的时间戳
        startTime: null,
        endTime: null
      },
      twoclick: {               // 用来记录第二次点击时间快捷键后得到的时间戳
        startTime: null,
        endTime: null
      },
      backcolor0: '#20a0ff',      // 几个时间快捷键按钮的初始背景颜色
      backcolor1: '#20a0ff',
      backcolor2: '#20a0ff',
      backcolor3: '#20a0ff',
      backcolor4: '#20a0ff',
      tbuttoncolor: '#20a0ff',      // 标签按钮的背景颜色
      issearch: false,              // 用来判断是否是通过时间选择器选择时间后搜索得到的好友列表
      istaskpage: true,             // 判断是否显示任务列表页面的信息
      taskIds: [],                  //　用来存放通过checkbox选择的任务id
      tasklist: [],                  // 存放任务的列表
      tasklistby1: [],                  //  将任务显示出来的任务列表存放载体
      dialogTableVisible1: false,     // 判断是否显示弹窗
      replylist1: [],                 // 获得弹窗要显示的信息
      weixinId: 0,                     //  当前操作者的微信id
      weixinTaskId: '',
      btcheckall: false,              // 控制全选checkbox的选择框是否选中
      friendpack: []
    };
  },
  methods: {
    confirm:function(val){
      var self = this;
      this.$confirm("是否移除?",'提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>{
        self.weixinids.splice(val, 1);
      }).catch(() =>{

      });
    },
    reset: function () {
      // 点击重置后， 时间快捷按钮全部初始化
      this.weixinids = [];
      this.friendpack = [];
      this.backcolor0 = '#20a0ff';
      this.backcolor1 = '#20a0ff';
      this.backcolor2 = '#20a0ff';
      this.backcolor3 = '#20a0ff';
      this.backcolor4 = '#20a0ff';
      this.tbuttoncolor = '#20a0ff';
      this.firstclick.startTime = null;
      this.firstclick.endTime = null;
      this.twoclick.startTime = null;
      this.twoclick.endTime = null;
      this.tagid = null;
      this.istag = false;
      this.isTimelist = false;
    },
    // 标签列表的按钮的点击选中后的颜色变化（暂时只有一个 等有其他标签还要加 或者通过css 优化）
    color2: function (val) {
      if (val == 0) {
        this.tbuttoncolor = (this.tbuttoncolor == '#20a0ff' ? '#005494' : '#20a0ff');
      }
    },
    // 获取标签列表的函数
    gettaglist: function () {
      var self = this;
      this.axios.get('/weixin/get_weixin_friends_tags')
        .then(function (res) {
          var data = res.data;
          if (data.code == 0) {
            self.alltagslist = data.data;
            console.log(self.alltagslist);
          }
        })
    },
    // 按钮点击后background-color的变化
    color: function (val) {
      if (this.Clicktime == 1) {
        this.backcolor0 = '#20a0ff';
        this.backcolor1 = '#20a0ff';
        this.backcolor2 = '#20a0ff';
        this.backcolor3 = '#20a0ff';
        this.backcolor4 = '#20a0ff';
      }
      if (val == 0) {
        this.backcolor0 = (this.backcolor0 == '#20a0ff' ? '#005494' : '#20a0ff');
      }
      else if (val == 1) {
        this.backcolor1 = (this.backcolor1 == '#20a0ff' ? '#005494' : '#20a0ff');
      }
      else if (val == 2) {
        this.backcolor2 = (this.backcolor2 == '#20a0ff' ? '#005494' : '#20a0ff');
      }
      else if (val == 3) {
        this.backcolor3 = (this.backcolor3 == '#20a0ff' ? '#005494' : '#20a0ff');
      }
      else if (val == 4) {
        this.backcolor4 = (this.backcolor4 == '#20a0ff' ? '#005494' : '#20a0ff');
      }
    },
    // 通过标签筛选得到的好友列表
    getfbytag: function (val) {
      var self = this;
      this.tagid = val;
      this.istag = true;           // 有标签筛选
      this.isTimelist = false;    // 与时间筛选无关
      var guodu = [];
      let request = new XMLHttpRequest();
      self.startT = Math.floor(new Date(this.startTime).getTime() / 1000);   // 将标准时间 转换为时间戳
      self.endT = Math.floor(new Date(this.endTime).getTime() / 1000);

      if (this.twoclick.startTime == 0 && this.twoclick.endTime == 0) {    // 判断是第一次点击时间快捷按钮
        console.log(111);
        for (var i = 0; i < self.weixinids.length; i++) {
          // console.log(self.startT);
          // console.log(self.endT);
          // this.axios.post('/weixin/get_weixin_friends_from_tag', {
          //   weixinId: self.weixinids[i].id,
          //   tagId: val,
          //   startTime: self.startT,
          //   endTime: self.endT
          // })
          //   .then(function (res) {
          //     var data = res.data;
          //     if (data.code == 0) {
          //       self.friendpack[i] = data.data;
          //     }
          //   })
          request.open('POST', 'http://weixinx.djtaoke.com/weixin/get_weixin_friends_from_tag', false);
          // request.setRequestHeader('Accept', 'application/json');
          request.setRequestHeader('Content-Type', 'application/json');
          request.send(JSON.stringify({
            weixinId: self.weixinids[i].id,
            tagId: val,
            startTime: self.startT,
            endTime: self.endT
          }))
          console.log(request);
          if (request.status == 200) {
            var contactlist = [];
            var guodu = JSON.parse(request.responseText).data;
            for (var k = 0; k < guodu.length; k++) {
              contactlist.push(guodu[k].contact)
            }
            self.friendpack[i] = contactlist;
          }
        }
        console.log(this.friendpack);
      }
      else {                                                        // 点击了连个时间快捷按钮
        this.istag = true;
        for (var i = 0; i < self.weixinids.length; i++) {
          // this.axios.post('/weixin/get_weixin_friends_from_tag', {
          //   weixinId: self.weixinids[i].id,
          //   tagId: this.tagid,
          //   startTime: this.twoclick.startTime,
          //   endTime: this.twoclick.endTime
          // })
          //   .then(function (res) {
          //     var data = res.data;
          //     if (data.code == 0) {
          //       self.friendpack[i] = data.data;

          //     }
          //   });
          request.open('POST', 'http://weixinx.djtaoke.com/weixin/get_weixin_friends_from_tag', false);
          // request.setRequestHeader('Accept', 'application/json');
          request.setRequestHeader('Content-Type', 'application/json');
          request.send(JSON.stringify({
            weixinId: self.weixinids[i].id,
            tagId: this.tagid,
            startTime: this.twoclick.startTime,
            endTime: this.twoclick.endTime
          }))
          console.log(request);
          if (request.status == 200) {
            var contactlist = [];
            var guodu = JSON.parse(request.responseText).data;
            for (var k = 0; k < guodu.length; k++) {
              contactlist.push(guodu[k].contact)
            }
            self.friendpack[i] = contactlist;
          }
        }
        console.log(this.friendpack);
      }
    },
    getfriendslist: function (val) {
      console.log(this.isTimelist);
      var self = this;
      this.tagid = null;
      this.istag = false;        // 确定不是通过标签筛选
      var offval = (val - 1) * self.pagesize;
      console.log(offval);
      self.loading = true;
      let request = new XMLHttpRequest();
      for (var i = 0; i < self.weixinids.length; i++) {

        request.open('POST', 'http://weixinx.djtaoke.com/weixin/get_weixin_friends', false);
        // request.setRequestHeader('Accept', 'application/json');
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({
          weixinId: self.weixinids[i].id,
          offset: offval,
          num: self.pagesize
        }))
        console.log(request);
        if (request.status == 200) {
          console.log(JSON.parse(request.responseText).data.list);
          self.friendpack[i] = JSON.parse(request.responseText).data.list;
        }
      }
      console.log(self.friendpack);
      // 点击显示全部好友后， 时间快捷按钮全部初始化
      this.backcolor0 = '#20a0ff';
      this.backcolor1 = '#20a0ff';
      this.backcolor2 = '#20a0ff';
      this.backcolor3 = '#20a0ff';
      this.backcolor4 = '#20a0ff';
      this.tbuttoncolor = '#20a0ff';
      this.firstclick.startTime = null;
      this.firstclick.endTime = null;
      this.twoclick.startTime = null;
      this.twoclick.endTime = null;
      this.tagid = null;
      this.istag = false;
      this.isTimelist = false;
    },

    // 通过时间筛选得到的好友
    getfribytat: function (st, ed) {
      console.log(this.issearch);
      var self = this;
      var datae = new Date();
      let request = new XMLHttpRequest();
      this.isTimelist = true;
      this.Clicktime = this.Clicktime + 1;
      var Id = Number.parseInt(this.$route.query.id);
      if (this.issearch == false) {
        self.endT = Math.floor(datae.getTime() / 1000) - 3600 * ed;   // 按钮点击后获取的结束时间点 用当前时间减去时间点
        self.startT = Math.floor(datae.getTime() / 1000) - 3600 * st;    // 按钮点击后获取的开始时间点， 用当前时间减去时间点
      }
      else {
        self.startT = Math.floor(new Date(this.startTime).getTime() / 1000);
        self.endT = Math.floor(new Date(this.endTime).getTime() / 1000);
      }
      if (this.Clicktime == 1) {                            // 判断点击了时间快捷按钮几次
        this.firstclick.startTime = self.startT;
        this.firstclick.endTime = self.endT;
        console.log(self.endT);
        console.log(self.startT);
        console.log(this.firstclick);
      }
      else {
        if (self.startT > this.firstclick.startTime) {
          self.startT = this.firstclick.startTime;
        }
        else {
          self.endT = this.firstclick.endTime;
        }
        this.Clicktime = 0;
        console.log(self.endT);
        console.log(self.startT);
        console.log(this.Clicktime);
      }
      this.twoclick.startTime = self.startT;        // 第二次点击后处理后的初始时间
      this.twoclick.endTime = self.endT;               // 第二次点击后处理后的结束时间
      if (this.tagid == null) {                      // 判断时候有点击标签按钮
        // console.log(111111);
        for (var i = 0; i < self.weixinids.length; i++) {
          // this.axios.post('/weixin/get_weixin_friends_from_time', {
          //   weixinId: self.weixinids[i].id,
          //   startTime: self.startT,
          //   endTime: self.endT
          // })
          //   .then(function (res) {
          //     var data = res.data;
          //     if (data.code == 0) {
          //       self.friendpack[i] = data.data;
          //     }
          //     console.log(self.friendpack)
          //   })
          //   .catch(function (err) {
          //     console.log(err);
          //     self.friendpack[i] = [];
          //   })
          request.open('POST', 'http://weixinx.djtaoke.com/weixin/get_weixin_friends_from_time', false);
          // request.setRequestHeader('Accept', 'application/json');
          request.setRequestHeader('Content-Type', 'application/json');
          request.send(JSON.stringify({
            weixinId: self.weixinids[i].id,
            startTime: self.startT,
            endTime: self.endT
          }))
          console.log(request);
          if (request.status == 200) {
            console.log(JSON.parse(request.responseText).data);
            self.friendpack[i] = JSON.parse(request.responseText).data;
          }
        }
      }
      else {
        console.log(2222222);
        console.log(this.tagid);
        this.istag = true;
        for (var i = 0; i < self.weixinids.length; i++) {
          // this.axios.post('/weixin/get_weixin_friends_from_tag', {
          //   weixinId: self.weixinids[i].id,
          //   tagId: this.tagid,
          //   startTime: self.startT,
          //   endTime: self.endT
          // })
          //   .then(function (res) {
          //     var data = res.data;
          //     if (data.code == 0) {
          //       self.friendpack[i] = data.data;
          //     }
          //   })
          request.open('POST', 'http://weixinx.djtaoke.com/weixin/get_weixin_friends_from_tag', false);
          // request.setRequestHeader('Accept', 'application/json');
          request.setRequestHeader('Content-Type', 'application/json');
          request.send(JSON.stringify({
            weixinId: self.weixinids[i].id,
            tagId: this.tagid,
            startTime: self.startT,
            endTime: self.endT
          }))
          console.log(request);
          if (request.status == 200) {
            var contactlist = [];
            var guodu = JSON.parse(request.responseText).data;
            for (var k = 0; k < guodu.length; k++) {
              contactlist.push(guodu[k].contact)
            }
            self.friendpack[i] = contactlist;
          }
        }
      }
      this.issearch = false;      // 如果是通过搜索时间的 则得到好友列表后重新初始化为false    
    },

    // 判断是否时通过时间选择器选择的时间 来获得好友列表
    Issearch: function () {
      this.issearch = true;
      this.backcolor0 = '#20a0ff';
      this.backcolor1 = '#20a0ff';
      this.backcolor2 = '#20a0ff';
      this.backcolor3 = '#20a0ff';
      this.backcolor4 = '#20a0ff';
      this.tbuttoncolor = '#20a0ff';
      this.firstclick.startTime = null;
      this.firstclick.endTime = null;
      this.twoclick.startTime = null;
      this.twoclick.endTime = null;
      this.tagid = null;
      this.istag = false;
      this.isTimelist = false;
      this.getfribytat(this.startTime, this.endTime);
    },

    // 通过时间选择器选择时间获取好友列表
    searchbyTime: function () {
      var self = this;
      let request = new XMLHttpRequest();
      this.isTimelist = true;
      if (this.startTime == null || this.endTime == null) {
        this.$message("请选择时间范围");
        return false;
      }
      // var Stime = self.timeChange(this.startTime);
      // var Etime = self.timeChange(this.endTime);
      self.startT = Math.floor(new Date(this.startTime).getTime() / 1000);
      self.endT = Math.floor(new Date(this.endTime).getTime() / 1000);

      for (var i = 0; i < self.weixinids.length; i++) {
        // this.axios.post('/weixin/get_weixin_friends_from_time', {
        //   weixinId: self.weixinids[i].id,
        //   startTime: self.startT,
        //   endTime: self.endT
        // })
        //   .then(function (res) {
        //     var data = res.data;
        //     if (data.code == 0) {
        //       self.friendpack[i] = data.data;
        //     }
        //   })
        //   .catch(function (err) {
        //     console.log(err);
        //   })
        request.open('POST', 'http://weixinx.djtaoke.com/weixin/get_weixin_friends_from_time', false);
        // request.setRequestHeader('Accept', 'application/json');
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({
          weixinId: self.weixinids[i].id,
          startTime: self.startT,
          endTime: self.endT
        }))
        console.log(request);
        if (request.status == 200) {
          console.log(JSON.parse(request.responseText).data);
          self.friendpack[i] = JSON.parse(request.responseText).data;
        }
      }
    },

    // 提交任务
    onSubmit: function () {
      var self = this;
      var wxid = [];
      var friends = [];
      var packnum = [];
      for (var i in this.taskids) {
        this.taskids[i] = Number.parseInt(this.taskids[i])
      }
      for (var i = 0; i < this.weixinids.length; i++) {
        wxid.push(this.weixinids[i].id);
      }
      if (this.friendpack.length == 0 || this.weixinids.length == 0) {
        this.$message("请选择完整信息");
        return false;
      }
      else {
        for(let i = 0; i< this.weixinids.length; i++){
          var friendid = [];
          var packnum = [];
          for(let j = 0 ;j < this.friendpack[i].length; j++){
            friendid.push(this.friendpack[i][j].userName)
          }
          for(let k=0; k< this.taskids.length; k++){
            packnum.push({
              weixinId: wxid[i],
              weixinTaskId: this.taskids[k],
              friends: friendid
            })
          }
          console.log(packnum);
          //   console.log(this.taskids);
          //   console.log(wxid[i]);
          //   console.log(friendid);
          this.axios.post('/weixin/batch_create_selected_friends_task', packnum)
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
        }
      }
    },
    //---------------------------------------------------------------
    getfriends: function () {
      for (var i in this.taskids) {
        this.taskids[i] = Number.parseInt(this.taskids[i])
      }
      this.$router.push({ name: '设置好友任务', params: { taskid: this.taskids, weixins: this.weixinids } })
    },
    checkAll: function () {//全选
      if (!this.checkall) {
        this.weixinids = []
        this.weixinlist.forEach((item) => {
          this.weixinids.push(item);
        });
        this.checkall = true
      }
      else {
        this.weixinids = []
        this.checkall = false
      }
    },
    settask: function () {
      var self = this
      for (var i in this.taskids) {
        this.taskids[i] = Number.parseInt(this.taskids[i])
      }
      this.axios.post('/weixin/batch_create_weixin_task', { taskIds: this.taskids, weixins: this.weixinids })
        .then(function (res) {
          var data = res.data
          console.log(data)
          if (data.code == 0) {
            self.$message("生成任务成功")
            self.weixinids = []
            self.$router.push('/tasklist');
          }
          else {
            self.$message("生成任务失败")
          }
        })
        .catch(function (err) {
          console.log(err);
          self.$message("生成任务失败")
        })
    },
    handleSizeChange: function () {
      var self = this
      self.weixinlist = []
      var j = self.currentPage == Math.ceil(self.allweixinlist.length / self.pagesize) ? self.allweixinlist.length : self.currentPage * self.pagesize
      for (var i = (self.currentPage - 1) * self.pagesize; i < j; i++) {
        self.weixinlist.push(self.allweixinlist[i])
      }
    },
    handleCurrentChange: function (val) {
      var self = this
      self.weixinlist = []
      var j = val == Math.ceil(self.allweixinlist.length / self.pagesize) ? self.allweixinlist.length : val * self.pagesize
      for (var i = (val - 1) * self.pagesize; i < j; i++) {
        self.weixinlist.push(self.allweixinlist[i])
      }
    },
    handleIconClick: function () {
      if (this.searchcontent == '') {
        this.weixinlist = this.allweixinlist
      }
      else {
        var self = this
        this.weixinlist = [_.find(self.allweixinlist, function (chr) { return chr.id == self.searchcontent; })]
      }
    },
    show: function (ev) {
      if (ev.keyCode == 13) {
        if (this.searchcontent == '') {
          this.weixinlist = this.allweixinlist
          // alert("空的")
        }
        else {
          var self = this
          this.weixinlist = [_.find(self.allweixinlist, function (chr) { return chr.id == self.searchcontent; })]
          // alert("有值的")
        }
      }
    },
    ifExecDefaultTask: function (val) {
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
    getweixinlist: function () {
      var self = this
      self.loading = true
      self.weixinlist = [];
      this.axios.post('/weixin/get_all_weixin')
        .then(function (res) {
          var data = res.data
          self.loading = false
          console.log(data)
          if (data.code == 0) {
            self.allweixinlist = data.data
            self.totalpage = self.allweixinlist.length
            var currentSize = self.currentPage * self.pagesize
            if (currentSize > self.allweixinlist.length) {
              currentSize = self.allweixinlist.length
            }
            for (var i = (self.currentPage - 1) * self.pagesize; i < currentSize; i++) {
              self.weixinlist.push(self.allweixinlist[i])
            }
          }
        })
        .catch(function (err) {
          console.log(err);
          self.loading = false
        })
    }
  },
  created: function () {
    this.gettaglist();
    this.getweixinlist()
    this.taskids = (this.$route.query.ids).split(',')
  }
}
</script>

<style>
.admin-userlist {
  width: 100%;
  padding: 20px
}
</style>
