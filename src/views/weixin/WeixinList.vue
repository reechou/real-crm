<template>
  <div class="admin-userlist">
    <div style="width: 400px;padding: 10px">
      <el-button type="primary" size="small" @click="showaddweixin = true" style="margin-bottom: 10px">设置新微信</el-button>

      <el-input placeholder="请输入微信号" icon="search" v-model="searchcontent" :on-icon-click="handleIconClick" @keyup.enter.native="show($event)"></el-input>
    </div>
    <template>
      <el-table :data="weixinlist" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column label="id">
          <template scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>
        <el-table-column prop="nickName" label="微信昵称"> </el-table-column>
        <!-- <el-table-column prop="wxId" label="微信id"></el-table-column>  -->
        <el-table-column prop="wechat" label="微信号"> </el-table-column>
        <!-- <el-table-column label="是否已执行默认任务"> <template scope='scope'>{{ifExecDefaultTask(scope.row.ifExecDefaultTask)}}</template></el-table-column>
                  <el-table-column label="创建日期"> <template scope='scope'>{{formate(scope.row.createAt)}}</template></el-table-column>   -->
        <el-table-column label="最后心跳时间">
          <template scope='scope'>{{formate(scope.row.lastHeartbeat)}}</template>
        </el-table-column>
        <el-table-column label="今日添加人数" prop="todayAddContactNum"> </el-table-column>
        <el-table-column label="描述">
          <template scope="scope">{{scope.row.desc}}
            <el-button type="text" size="small" @click="updatedec(scope.row.id, scope.row.desc)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column label="二维码" align="center">
          <template scope="scope">
            <div class="am-form-group an-form-file" :id="scope.$index" v-show="scope.row.edit">
              <label type="button" class="btn btn-default" :for="scope.$index + 'img'">
                <i class="glyphicon glyphicon-open-file"></i>
                <p>点击选图</p>
                <input type="file" :id="scope.$index + 'img'" style="display:none;" />
              </label>
              <img :src="qrcodeUrl" alt="" width="100">
              <el-row :gutter="20">
              <el-col :span="12"><el-button type="primary" @click="updateQR(scope.row.id),scope.row.edit=false" size="small" v-show="qrcodeUrl != ''">確定</el-button></el-col>
              <el-col :span="12"><el-button type="primary" @click="scope.row.edit=false,qrcodeUrl = ''" size="small" v-show="qrcodeUrl != ''">取消</el-button></el-col>
              </el-row>
            </div>
            <el-button type="text" size="small" @click="scope.row.edit=true" v-if="!scope.row.edit">更新</el-button>
            <el-tooltip placement="bottom" v-if="!scope.row.edit">
              <div slot="content" style="width:200px;height:300px;"><img :src="scope.row.qrcodeUrl" style="width:200px;height:300px"></div>
              <el-button type="text">查看</el-button>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center">
          <template scope="scope">
            <select v-model="scope.row.status" @change="StatusSelect(scope.row.status,scope.row.id)" placeholder="请选择" :id="scope.row.id">
              <option v-for="item in status" :key="item.value" :label="item.label" :value="item.value">
              </option>
            </select>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope='scope'>
            <!-- <el-button type="text" size="small" @click="settask(scope.row.id)">创建任务</el-button>
                    <el-button type="text" size="small" @click="gosetting(scope.row.id)">查看设置</el-button>  
                    <el-button type="text" size="small" @click="confirm(scope.row.id)">删除</el-button>
                    <el-button type="text" size="small" @click="gofriendslsit(scope.row.id)">查看好友</el-button>  -->
            <select :id="scope.row.id" @change="selectevent(scope.row.id, scope.row.operat)" v-model="scope.row.operat">
              <option v-for="item in operate" :key="item.value" :label="item.label" :value="item.value">
              </option>
            </select>
          </template>
        </el-table-column>
      </el-table>
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

    <el-dialog title="添加新微信" v-model="showaddweixin">
      <el-form ref="ruleForm" :model="ruleForm" :rules = "rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="微信号" prop="newWeixin">
          <el-input v-model="ruleForm.newWeixin"></el-input>
        </el-form-item>
        <el-form-item label="关键字id">
          <el-select v-model="ruleForm.keywordid" filterable multiple placeholder="请选择或搜索ID/多选">
            <el-option v-for="item in keywordSetting" :key="item.id" :label="item.id" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="好友验证id">
          <el-select v-model="ruleForm.verifyid" filterable placeholder="请选择或搜索ID">
            <el-option v-for="item in verifySetting" :key="item.id" :label="item.id" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务id">
          <el-select v-model="ruleForm.tasks" filterable multiple placeholder="请选择或搜索ID/多选">
            <el-option v-for="item in tasklist" :key="item.id" :label="item.id" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">提交</el-button>

        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'weixinlist',
  data() {
    return {
      ruleForm: {
        newWeixin: null,
        keywordid: [],
        verifyid: null,
        tasks: []
      },
      rules: {
        newWeixin: [
          { required: true, message: '请输入微信号', trigger: 'blur' }
        ]
      },
      showaddweixin: false,

      weixinlist: [],
      loading: false,
      searchcontent: '',
      allweixinlist: [],
      pagesize: 100,
      totalpage: 8,
      currentPage: 1,
      dialogVisible: false,
      desc: '',
      id: '',
      selected: 0,
      token: '',           // 获取七牛token
      shows: true,          // 是否显示图片选择按钮
      qrcodeUrl: '',
      operate: [{
        label: '请选择', value: 0
      }, {
        label: '创建任务', value: 1
      }, {
        label: '查看设置', value: 2
      }, {
        label: '删除', value: 3
      }, {
        label: '查看好友', value: 4
      }, {
        label: '定时任务', value: 5
      }],
      status: [{
        label: '正常', value: 0
      }, {
        label: '满好友', value: 1
      }, {
        label: '被封号', value: 2
      }],
      verifySetting: [],
      keywordSetting: [],
      tasklist: []

    };
  },
  methods: {
    submitForm() {
      var self = this;
      // console.log(self.ruleForm.newWeixin);
      // console.log(self.ruleForm.verifyid);
      // console.log(self.ruleForm.keywordid);
      // console.log(self.ruleForm.tasks);
      this.axios.post('/weixin/create_weixin', {
         wechat: self.ruleForm.newWeixin,
         verifyId: self.ruleForm.verifyid, 
         keywordIds: self.ruleForm.keywordid, 
         taskIds: self.ruleForm.tasks 
         })
        .then((response) => {
          var data = response.data
          if (data.code == 0) {
            self.$message("设置成功");
            self.getweixinlist();
            // self.showaddweixin = false;
            // self.ruleForm.newWeixin = null;
            // self.ruleForm.verifyid = null;
            // self.ruleForm.keywordid = [];
            // self.ruleForm.tasks = [];
          } else {
            self.$message("设置失败")
          }
          console.log(data)
        }, (response) => {
          console.log(response);
          self.$message("设置失败")
        });

    },
    gettasklist: function () {
      var self = this
      this.axios.post('/weixin/get_all_task')
        .then(function (res) {
          var data = res.data
          console.log(data)
          if (data.code == 0) {
            self.tasklist = data.data
          }
        })
        .catch(function (err) {
          console.log(err);
          self.loading = false
        })
    },
    getsettinglist: function () {
      var self = this
      this.axios.post('/weixin/get_all_verify')
        .then(function (res) {
          var data = res.data
          console.log(data)
          if (data.code == 0) {
            self.verifySetting = data.data
          }
        })
        .catch(function (err) {
          console.log(err);
        })
    },
    getkeywordlist: function () {
      var self = this
      this.axios.post('/weixin/get_all_keyword')
        .then(function (res) {
          var data = res.data
          console.log(data)
          if (data.code == 0) {
            self.keywordSetting = data.data
          }
        })
        .catch(function (err) {
          console.log(err);
        })
    },
    StatusSelect: function (val, id) {
      var self = this;
      console.log(val);
      console.log(id);
      this.axios.post("/weixin/update_weixin_status", {
        id: id,
        status: val
      })
        .then(function (res) {
          var data = res.data;
          if (data.code == 0) {
            self.$message("更新成功");
            self.getweixinlist();
          }
          else {
            self.$message("更新失败");
          }
        })
        .catch(function (err) {
          self.$message("上传失败");
          console.log(err);
        })

    },
    updateQR: function (val) {
      var self = this;
      console.log(val);
      console.log(this.qrcodeUrl);
      this.axios.post('/weixin/update_weixin_qrcode', {
        id: val,
        qrcodeUrl: this.qrcodeUrl
      })
        .then(function (res) {
          var data = res.data;
          if (data.code == 0) {
            self.$message("上传成功");
            self.getweixinlist();
            self.$router.go(0);
          }
          else {
            self.$message("上传失败");
          }
        })
        .catch(function (err) {
          self.$message("上传失败");
          console.log(err);
          self.qrcodeUrl = '';
        })
      // 获取上传的图片url 上传
    },
    selectevent: function (val, sls) {
      console.log(sls);
      if (sls == 1) {
        this.settask(val);
      }
      else if (sls == 2) {
        this.gosetting(val);
      }
      else if (sls == 3) {
        this.confirm(val);
      }
      else if (sls == 4) {
        this.gofriendslsit(val);
      }
      else if (sls == 5) {
        this.gotiminglist(val)
      }
      else {
        return false;
      }
    },
    // goset: function (val) {
    //   this.$router.push("/setweixin?id=" + val)
    // },
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
    delet: function (val) {
      var self = this
      this.axios.post('/weixin/delete_weixin', { id: val })
        .then(function (res) {
          var data = res.data
          if (data.code == 0) {
            self.$message("删除成功");
            self.getweixinlist();
          }
          else {
            self.$message("删除失败")
          }
        })
        .catch(function (err) {
          console.log(err);
          self.$message("删除失败")
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
      self.currentPage = val
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
          this.weixinlist = this.allweixinlist;
        }
        else {
          var self = this;
          this.weixinlist = [_.find(self.allweixinlist, function (chr) { return chr.id == self.searchcontent; })]
        }
      }
    },
    gosetting: function (val) {
      this.$router.push('/querysetting?id=' + val)
    },
    settask: function (val) {
      this.$router.push('/settask?id=' + val)
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
              v.operat = 0;
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

          self.gettoken();
          self.qrcodeUrl = '';

        })
        .catch(function (err) {
          console.log(err);
          self.loading = false
        })
    },
    gofriendslsit: function (val) {
      this.$router.push('/friendslist?id=' + val);
    },
    gotiminglist: function (val) {
      this.$router.push('/timinglist?id=' + val);
    },
    upload: function (val) {             /// 通过qiniu上传图片函数
      var self = this;
      var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: val + 'img', //上传选择的点选按钮，**必需**
        uptoken: this.token,
        //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
        // uptoken : '<Your upload token>',
        //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
        // unique_names: true,
        // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
        save_key: true,
        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
        domain: 'http://7xld1x.com1.z0.glb.clouddn.com/',
        //bucket 域名，下载资源时用到，**必需**
        container: val, //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '5mb', //最大文件体积限制
        flash_swf_url: 'qiniu/Moxie.swf', //引入flash,相对路径
        max_retries: 3, //上传失败最大重试次数
        dragdrop: true, //开启可拖曳上传
        drop_element: val, //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb', //分块上传时，每片的体积
        auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters: {
          mime_types: [{
            title: "Image files",
            extensions: "jpg,png,x-icon,gif,jpeg"
          } // 限定flv后缀上传格式上传
          ]
        },
        multi_selection: true,
        init: {
          'UploadProgress': function (up, file) { //上传中
          },
          'FileUploaded': function (up, file, info) {
            var domain = up.getOption('domain');
            var res = JSON.parse(info);
            var urlImg = 'http://7xld1x.com1.z0.glb.clouddn.com/' + res.key;
            // console.log("img="+urlImg);
            file.imgUrl = urlImg;
            console.log(urlImg);
            self.qrcodeUrl = urlImg;
            console.log(self.qrcodeUrl)
            // console.log(self.files[0].imgUrl)
          },
          'Error': function (up, err, errTip) {
            //上传出错时，处理相关的事情
            console.log("上传出错，请刷新重新上传");
          }
        }
      });
    },
    gettoken: function () {
      var self = this;
      this.axios.get('http://wxmp.gatao.cn/mypic/gettoken')
        .then((response) => {
          var data = response.data;
          this.token = data.token;
          console.log(this.token);
          for (var i in self.allweixinlist) {
            self.upload(i);
          }
        }, (response) => {
          // error callback   错误回调
        })
    }
  },
  created: function () {
    this.getweixinlist();
    this.getsettinglist();
    this.getkeywordlist();
    this.gettasklist();
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
