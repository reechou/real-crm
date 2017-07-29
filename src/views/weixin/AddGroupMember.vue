<template>
  <div class="admin-userlist">
    <div style="width: 400px;padding: 10px">
      <el-button  type="primary" @click="getweixinlist" style="margin-bottom: 10px">显示全部微信</el-button>
      <el-input placeholder="请输入微信号" icon="search" v-model="searchcontent" :on-icon-click="handleIconClick" @keyup.enter.native="show($event)"></el-input>
    </div>

      <div class="addgroup" style="padding:20px">
        <el-row :gutter="20">
          <el-col :span="2">
            <label>组名:</label>
          </el-col>
          <el-col :span="6">
            <el-select v-model="groupNum" placeholder="请选择" @onchange="getgroupmember(groupNum)" style="padding:0;margin:0">
                <el-option
                v-for="item in wxgroup"
                :key="item.id"
                :label="item.groupName"
                :value="item.id">
                </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" @click="addmember">确定</el-button>
          </el-col>
        </el-row>
      </div>

    <template>
      <el-checkbox-group v-model="wxIds">
        <input type="checkbox" @click="checkAll()" v-model="btcheckall">全选
        <p align="right">已选人数:{{ wxIds.length }}</p>
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
            <template scope="scope">{{scope.row.desc}}
                <el-button type="text" size="small" @click="updatedec(scope.row.id, scope.row.desc)">修改</el-button>
            </template>
            </el-table-column>

        </el-table>
      </el-checkbox-group>
    </template>
    <div style="margin-bottom: 40px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size='pagesize' ayout="total, prev, pager, next" :total='totalpage'></el-pagination>
    </div>
    <el-dialog title="修改" v-model="dialogVisible" size="small">
      <el-input type="textarea" :rows="3" placeholder="请输入描述" v-model="desc"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatedeschttp()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'weixinlist',
  data() {
    return {
      wxIds:[],
      btcheckall:false,
      checkall: false,
      weixinlist: [],
      wxgroup:[],
      numpack:[],
      groupNum:null,
      loading: false,
      searchcontent: '',
      allweixinlist: [],
      pagesize: 100,
      totalpage: 8,
      currentPage: 1,
      dialogVisible: false,
      desc: '',
      id: '',
      selected: '请选择',
      token: '',           // 获取七牛token
      shows: true,          // 是否显示图片选择按钮
      qrcodeUrl: '',
      status:[{
        label:'正常', value:0
        },{
          label:'满好友', value:1
        },{
          label: '被封号', value: 2
        }]
    };
  },
  methods: {
    checkAll: function(){
       if(this.wxIds == null){
         if(!this.checkall){
             this.wxIds = [];
             this.weixinlist.forEach((item) => {
                 this.wxIds.push(item.id);
             });
             this.checkall = true;
         }
         else{
             this.wxIds = [];
             this.checkall = false;
         }
       }
       else{
           if(!this.checkall){
               this.weixinlist.forEach((item) => {
                   this.wxIds.push(item.id);
               });
               this.checkall = true;
           }
           else{
               this.wxIds = [];
               this.checkall = false;
           }
       }
       console.log(this.wxIds);
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
    updatedec: function (id, desc) {
      this.dialogVisible = true
      this.desc = desc
      this.id = id
      // this.updatedeschttp()
    },
    updatedeschttp: function () {
      var self = this
      this.axios.post('/weixin/update_weixin_desc', { id: this.id, desc: this.desc })
        .then(function (res) {
          var data = res.data
          self.dialogVisible = false
          self.id = ''
          self.desc = ""
          if (data.code == 0) {
            self.$message("修改成功")
            self.getweixinlist()
          }
          else {
            self.$message("修改失败")
          }
        })
        .catch(function (err) {
          self.dialogVisible = false
          console.log(err);
          self.$message("修改失败")
        })
    },
    handleSizeChange: function () {
      var self = this;
      self.weixinlist = [];
      var j = self.currentPage == Math.ceil(self.allweixinlist.length / self.pagesize) ? self.allweixinlist.length : self.currentPage * self.pagesize
      for (var i = (self.currentPage - 1) * self.pagesize; i < j; i++) {
        self.weixinlist.push(self.allweixinlist[i]);
      }
    },
    handleCurrentChange: function (val) {
      var self = this;
      this.btcheckall = false;
      this.checkall = false;
      self.weixinlist = [];
      self.currentPage = val;
      var j = val == Math.ceil(self.allweixinlist.length / self.pagesize) ? self.allweixinlist.length : val * self.pagesize
      for (var i = (val - 1) * self.pagesize; i < j; i++) {
        self.weixinlist.push(self.allweixinlist[i]);
      }
    },
    handleIconClick: function () {
      if (this.searchcontent == '') {
        this.weixinlist = this.allweixinlist;
      }
      else {
        var self = this;
        this.weixinlist = [_.find(self.allweixinlist, function (chr) { return chr.id == self.searchcontent; })]
      }
    },
    show: function (ev) {
      if (ev.keyCode == 13) {
        if (this.searchcontent == '') {
          this.weixinlist = this.allweixinlist;
        }
        else {
          var self = this;
          this.weixinlist = [_.find(self.allweixinlist, function (chr) { return chr.id == self.searchcontent; })]
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
      this.axios.post('/weixin/get_all_weixin')
        .then(function (res) {
          var data = res.data
          self.loading = false
          console.log(data)
          if (data.code == 0) {
            self.allweixinlist = data.data.map(v => {
              v.edit = false;
              return v
            });
            console.log(self.allweixinlist);
            self.totalpage = self.allweixinlist.length
            self.weixinlist = []
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
    addmember: function(){
        if(this.wxIds == ''){
            this.$message("请选择好友");
            return false;
        }
        else{
            for(var i in this.wxIds){
                this.numpack.push({
                    groupId: Number.parseInt(this.groupNum),
                    weixinId: Number.parseInt(this.wxIds[i])
                })
            }
            this.axios.post('/weixin/create_weixin_group_member_list',this.numpack)
            .then(function(res){
                var data = res.data;
                if(data.code == 0){
                    self.$message("创建成功");
                    self.$router.push('/weixingroup');
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
    }
  },
  created: function () {
    this.getweixinlist();
    this.getweixingroup();
  }
}
</script>

<style>
.admin-userlist {
  width: 100%;
  padding: 20px
}

select {
  width: 100px;
  height: 30px;
  border-radius: 5px;
}
</style>