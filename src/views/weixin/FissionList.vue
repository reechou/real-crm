<template>
  <div class="fission">
    <div class="selectype" style="padding:10px">
      <el-row :gutter="20" style="margin-bottom:20px;">
        <el-col :span="4" :offset="20">
          <span size="small" style="color:red">{{ tie }} </span>后自动刷新列表</el-col>
      </el-row>
      <!-- <el-row :gutter="20">
                  <el-col :span="4"> -->
      <el-select v-model="lbTypenum" placeholder="请选择" @change="getliebianpool(lbTypenum)">
        <el-option v-for="item in lbType" :key="item.liebianType" :label="item.desc" :value="item.liebianType">
          <i class="el-icon-delete" @click="clickicon(item.id)"></i>&nbsp;&nbsp;
          <span style="width:80%">{{item.liebianType}}-{{ item.desc }}</span>
        </el-option>
        <el-option value="">
          <i class="el-icon-plus" style="width:100%;" @click="showaddliebian = true">&nbsp;&nbsp;
            <span>创建分组</span>
          </i>
        </el-option>
      </el-select>
      <!-- </el-col> -->
      <!-- <el-col :span="2">
                    <el-button type="primary" @click="showaddliebian = true">创建分组</el-button>
                  </el-col>  -->
      <!-- <el-col :span="2"> -->
      <el-button type="primary" @click="getweixinlist" sytle="width:100%">添加成员</el-button>
      <!-- </el-col>
                  <el-col :span="16"> -->
      <el-button type="primary" @click="confirm">批量删除</el-button>
      <el-button type="primary" @click="geterrorlist">错误信息列表</el-button>
      <el-button type="primary" v-if="!SortById" @click="sortbyid">通过id排序</el-button>
      <el-button type="primary" v-if="SortById" @click="sortbyid">通过添加人数排序</el-button>
      <!-- </el-col>
                </el-row> -->
    </div>

    <el-dialog title="新增裂变类别" v-model="showaddliebian">
      <el-row :gutter="20" style="margin-bottom:20px;">
        <el-col :span="4">
          <label>裂变类型:</label>
        </el-col>
        <el-col :span="20">
          <el-input type="number" v-model="newType"></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom:20px;">
        <el-col :span="4">
          <label>描述:</label>
        </el-col>
        <el-col :span="20">
          <el-input type="text" v-model="newDesc"></el-input>
        </el-col>2="addtype">确定</el-button>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="showaddliebian = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <el-dialog title="新增裂变成员" v-model="showaddmember">
      选择id:
      <span>{{ members }}</span>
      <el-row :gutter="20" style="margin-bottom:20px;">
        <el-col :span="3" :offset="21">
          <el-button type="primary" @click="addmember">添加</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-bottom:20px;">
        <el-col :span="6">
          <el-select v-model="typeNum" placeholder="请选择类型" @change="getresourse">
              <el-option
              v-for="item in resType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getweixinlist">显示全部微信</el-button>
        </el-col>
        <el-col :span="14">
          <el-input placeholder="请输入微信号" icon="search" v-model="searchcontent" :on-icon-click="handleIconClick" @keyup.enter.native="show($event)"></el-input>
        </el-col>
      </el-row>
      <template>
        <el-checkbox-group v-model="members">
          <input type="checkbox" @click="checkAllformember()" v-model="diabtcheckall">全选&nbsp;&nbsp; (已选人数:{{ members.length }})

          <el-table :data="weixinlist" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中" :row-class-name="tableRowClassName">
            <el-table-column label="id">
              <template scope="scope">
                <div v-if="scope.row.tipword == '' || scope.row.wxType == 1 || scope.row.wxType == 2">
                  <el-checkbox :label="scope.row.id"></el-checkbox>
                </div>
                <div v-if="scope.row.tipword != '' && typeNum == null">
                  <span>{{scope.row.id}}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="Nameoftype">
              <template scope="scope">
                {{ scope.row.nickName }}
              </template> 
            </el-table-column>
            <!-- <el-table-column  label="资源名称" v-if="typeNum != null">
              <template scope="scope">
                {{ scope.row.nickName }}
              </template>   
            </el-table-column>   -->
            <el-table-column prop="wechat" label="微信号"> </el-table-column>

            <el-table-column label="最后心跳时间">
              <template scope='scope'>
                <span v-if="scope.row.lastHeartbeat != 0">{{formate(scope.row.lastHeartbeat)}}</span>
                <span v-else>{{ 0 }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="今日添加人数" prop="todayAddContactNum"> </el-table-column>
            <el-table-column label="描述">
              <template scope="scope">
                {{scope.row.desc}}
              </template>
            </el-table-column>
            <el-table-column label="标记提示" v-if="typeNum == null">
              <template scope='scope'>
                <div v-if="scope.row.tipword == ''">
                  正常
                </div>
                <div v-if="scope.row.tipword != ''">
                  <span>{{ scope.row.tipword }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-checkbox-group>
      </template>
      <div style="margin-bottom: 40px">
        <el-pagination @size-change="memhandleSizeChange" @current-change="memhandleCurrentChange" :current-page="diacurrentPage" :page-size='diapagesize' ayout="total, prev, pager, next" :total='diatotalpage'></el-pagination>
      </div>
    </el-dialog>

    <el-dialog title="裂变错误信息列表" v-model="showerrlist">
      <template>
        <el-table :data="errlist" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">

          <el-table-column label="错误信息">
            <template scope="scope">
              {{ scope.row.msg }}
            </template>
          </el-table-column>

          <el-table-column label="发生时间" width="160px">
            <template scope="scope">
              {{ formate(scope.row.createAt) }}
            </template>
          </el-table-column>

        </el-table>
      </template>
      <div style="margin-bottom: 40px">
        <el-pagination @size-change="errhandleSizeChange" @current-change="errhandleCurrentChange" :current-page="diacurrentPage" :page-size='errpagesize' ayout="total, prev, pager, next" :total='errtotalpage'></el-pagination>
      </div>
    </el-dialog>

    <template>
      <el-checkbox-group v-model="wxIds">
        {{wxIds}}
        <input type="checkbox" @click="checkAll()" v-model="btcheckall">全选 &nbsp;&nbsp;(已选人数:{{ wxIds.length }})&nbsp;&nbsp;&nbsp;&nbsp;当前成员总数:
        <span style="color:red">{{ alllist.length}}</span>
        <el-table :data="lieBianPool" style="width:200%;margin-bottom:80px" v-loading="loading" element-loading-text="拼命加载中">
          <el-table-column label="选择" width="80px">
            <template scope="scope">
              <input type="checkbox" :id="scope.row.id" :value="scope.row.liebianid" v-model="wxIds"></input>
              <!-- <el-checkbox :label="scope.$index"></el-checkbox> -->
            </template>
          </el-table-column>

          <el-table-column label="id" align="center">
            <template scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>

          <el-table-column label="微信号">
            <template scope="scope">
              {{ scope.row.wechat }}
            </template>
          </el-table-column>

          <!-- <el-table-column label="微信id">
                      <template scope="scope">
                        {{ scope.row.wxId }}
                      </template>
                    </el-table-column>  -->

          <el-table-column label="备注">
            <template scope="scope">
              {{ scope.row.desc }}
            </template>
          </el-table-column>

          <el-table-column label="二维码">
            <template scope="scope">
              <img :src="scope.row.qrcodeUrl" width="100" height="150">
            </template>
          </el-table-column>

          <el-table-column label="最后心跳时间">
            <template scope="scope">
              {{ formate(scope.row.lastHeartbeat) }}
            </template>
          </el-table-column>

          <el-table-column label="今日添加人数">
            <template scope="scope">
              {{ scope.row.todayAddContactNum }}
            </template>
          </el-table-column>

          <!-- <el-table-column label="标记提示">
                      <template scope="scope">
                        <span v-if="scope.row.tipword != ''">{{ scope.row.tipword }}</span>
                        <span v-if="scope.row.tipword == ''">正常</span>
                      </template>
                    </el-table-column> -->
        </el-table>
      </el-checkbox-group>
    </template>
    <div style="margin-bottom: 40px">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size='pagesize' ayout="total, prev, pager, next" :total='totalpage'>
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'weixin_fission',
  data() {
    return {
      lbTypenum: null,
      lbType: [],
      wxIds: [],
      btcheckall: false,
      lieBianPool: [],
      tie: 60,

      members: [],
      weixinlist: [],
      checkallformember: false,
      diallist: [],
      diapagesize: 100,
      diacurrentPage: 1,
      diatotalpage: 1,
      diabtcheckall: false,
      searchcontent: '',
      numpack: [],

      alllist: [],
      pagesize: 100,
      currentPage: 1,
      totalpage: 1,
      loading: false,
      showaddliebian: false,
      checkall: false,
      typeormember: 1,
      newType: null,
      newDesc: '',
      liebianid: [],
      showaddtype: false,
      showaddmember: false,
      showweixinlist: false,
      timer: null,

      errlist: [],
      showerrlist: false,
      errall: [],
      errpagesize: 100,
      errcurrentPage: 1,
      errtotalpage: 1,

      guanlishuju: [],
      idd: 0,    // 记录选择的微信的序号
      SortById: false,   // 显示通过什么排序的按钮
      typeNum:null,           // 公众号类型或者群类型id
      resType:[{
        label: '公众号', value: 1
      },{
        label: '群', value:　2
      }],
      allresource: [],
      Nameoftype: '微信昵称'
    }
  },
  methods: {
    getresourse: function() {
      var self = this;
      var tipword = '';
      var nowtime = Date.now() / 1000;
      this.Nameoftype ='资源名称';
      this.axios.post('/weixin/get_resource_pool',{
        wxType: this.typeNum
      })
        .then(function(res){
          var data = res.data;
          self.diallist = [];
          self.weixinlist = [];
          if(data.code == 0){
            self.diallist = data.data.map(v => {
              v.edit = false;
              return v;
            });
            if(self.diallist == null) {
              self.weixinlist = [];
            } else {
              self.diatotalpage = self.diallist.length;
              var diacurrentSize = self.diacurrentPage * self.diapagesize;
              if (diacurrentSize > self.diallist.length) {
                diacurrentSize = self.diallist.length;
              }
              for (var i = 0; i < self.diallist.length; i++) {
                tipword = '';
                if (self.diallist[i].qrcodeUrl == '') {
                  tipword = tipword + '⑴未添加二维码;';
                }
                if (self.diallist[i].status != 0) {
                  tipword = tipword + '⑴状态不正常;';
                }
                if (nowtime - self.diallist[i].lastHeartbeat > 300) {
                  tipword = tipword + '⑴最后心跳时间超过5分钟;'
                }
                self.$set(self.diallist[i], 'tipword', tipword);
              }
              for (var i = (self.diacurrentPage - 1) * self.diapagesize; i < diacurrentSize; i++) {
                self.weixinlist.push(self.diallist[i]);
              }
              console.log(self.weixinlist)
            }
          }
        })
        .catch(function(err){
          console.log(err);
        })
    },
    sortbyid: function() {            // 通过id或者todayaddcontactNum 排序的方法
      var self = this;
      this.SortById = !this.SortById;
      if (!this.SortById) {
        self.alllist.sort(function(a, b) {
          return b.weixin.todayAddContactNum - a.weixin.todayAddContactNum;
        })
        self.totalpage = self.alllist.length;
        self.lieBianPool = [];
        var currentSize = self.currentPage * self.pagesize;
        if (currentSize > self.alllist.length) {
          currentSize = self.alllist.length;
        }
        for (var i = (self.currentPage - 1) * self.pagesize; i < currentSize; i++) {
          self.lieBianPool.push(self.alllist[i].weixin);
          // self.$set(self.lieBianPool[i], 'liebianid', self.alllist[i].liebianPool.id);
        }
      }
      else {
        self.alllist.sort(function(a, b) {
          return a.weixin.id - b.weixin.id;
        })
        self.totalpage = self.alllist.length;
        self.lieBianPool = [];
        var currentSize = self.currentPage * self.pagesize;
        if (currentSize > self.alllist.length) {
          currentSize = self.alllist.length;
        }
        for (var i = (self.currentPage - 1) * self.pagesize; i < currentSize; i++) {
          self.lieBianPool.push(self.alllist[i].weixin);
          // self.$set(self.lieBianPool[i], 'liebianid', self.alllist[i].liebianPool.id);
        }
      }
    },
    tableRowClassName: function(row, index) {
      var nowtime = Date.now() / 1000;
      if (row.qrcodeUrl == '' || row.status != 0 || nowtime - row.lastHeartbeat > 300) {
        return 'info-row';
      }
    },
    formate: function(t) {
      var d = new Date(t * 1000);
      var year = d.getFullYear();
      var day = d.getDate();
      var month = d.getMonth() + 1;
      var hour = d.getHours();
      var minute = d.getMinutes();
      var f = year + "-" + this.init(month) + "-" + this.init(day) + " " + this.init(hour) + ":" + this.init(minute);
      return f;
    },
    init: function(d) {
      return d > 9 ? d : "0" + d;
    },
    batchdelete: function() {
      var self = this;
      console.log(this.wxIds);
      if (this.wxIds == null) {
        this.$message("请选择要删除的号");
        return false;
      }
      else {
        //   var selectme = [];
        //   for(var i in this.wxIds){
        //     selectme.push(this.alllist[this.wxIds[i]].liebianPool);
        //   }
        //   console.log(selectme);
        //   for(var i in selectme){
        //   this.liebianid.push(selectme[i].id);
        // }
        // console.log(this.liebianid);
        console.log(this.wxIds);
        this.axios.post('/weixin/delete_lianbian_pool', this.wxIds)
          .then(function(res) {
            var data = res.data;
            if (data.code == 0) {
              self.$message("删除成功");
              self.getliebianpool(self.lbTypenum);
              self.wxIds = [];

              // this.$router.push('/fissionlist');
            }
            else {
              self.$message("删除失败");
            }
          })
          .catch(function(err) {
            console.log(err);
            self.$message("删除失败");
          })
        this.btcheckall = false;
        this.checkall = false;
      }
    },
    checkAll: function() {
      if (this.wxIds == '') {
        if (!this.checkall) {
          this.wxIds = [];
          for (var i = 0; i < this.lieBianPool.length; i++) {
            this.wxIds.push(this.lieBianPool[i].liebianid);
          }
          this.checkall = true;
        }
        else {
          this.wxIds = [];
          this.checkall = false;
        }
      }
      else {
        if (!this.checkall) {
          for (var i = 0; i < this.lieBianPool.length; i++) {
            this.wxIds.push(this.lieBianPool[i].liebianid);
          }
          this.checkall = true;
        }
        else {
          this.wxIds = [];
          this.checkall = false;
        }
      }
    },
    checkAllformember: function() {
      console.log(this.members);
      if (this.members.length == 0) {
        if (!this.checkallformember) {
          this.members = [];
          // this.weixinlist.forEach((item) => {
          // console.log(1111111);
          for (var i = 0; i < this.weixinlist.length; i++) {
            if (this.weixinlist[i].tipword == '') {
              this.members.push(this.weixinlist[i].id);
            }

          }
          // });
          this.checkallformember = true;
        }
        else {
          this.members = [];
          this.checkallformember = false;
        }
      }
      else {
        if (!this.checkallformember) {
          for (var i = 0; i < this.weixinlist.length; i++) {
            if (this.weixinlist[i].tipword == '') {
              this.members.push(this.weixinlist[i].id);
            }
          }
          this.checkallformember = true;
        }
        else {
          this.members = [];
          this.checkallformember = false;
        }
      }
      console.log(this.members);
    },
    addtype: function() {
      var self = this;
      if (this.newType == null || this.newDesc == '') {
        this.$message("请输入新增信息");
      }
      else {
        this.axios.post('/weixin/create_liebian_type', {
          liebianType: Number.parseInt(this.newType),
          desc: this.newDesc
        })
          .then(function(res) {
            var data = res.data;
            if (data.code == 0) {
              self.$message("创建成功");
              self.getlianbianlist();
              self.showaddliebian = false;
              self.newDesc = '';
              self.newType = null;
            }
            else {
              self.$message("创建失败");
              self.newDesc = '';
              self.newType = null;
            }
          })
          .catch(function(err) {
            self.$message("创建失败");
            self.newDesc = '';
            self.newType = null;
            console.log(err);
          })
      }
    },
    clickicon: function(val) {
      this.typeormember = 0;
      this.confirm(val);
    },
    getlianbianlist: function() {
      var self = this;
      this.axios.post('/weixin/get_liebian_type_list')
        .then(function(res) {
          var data = res.data;
          if (data.code == 0) {
            self.lbType = data.data;
            if (self.lbType == null) {
              self.lbTypenum = null;
            }
            else {
              console.log(self.lbType[0].liebianType);
              self.lbTypenum = self.lbType[0].liebianType;
            }
          }
        })
        .catch(function(err) {
          console.log(err);
        })
      this.getliebianpool(self.lbTypenum);
    },
    getliebianpool: function(type) {
      console.log(type);
      var self = this;
      this.axios.post('/weixin/get_lianbian_pool', {
        liebianType: Number.parseInt(type)
      })
        .then(function(res) {
          var data = res.data;
          if (data.code == 0) {
            self.alllist = data.data;
            if (self.alllist == null) {
              self.lieBianPool = [];
            }
            else {
              for (var k = 0; k < self.alllist.length; k++) {
                self.$set(self.alllist[k].weixin, 'liebianid', self.alllist[k].liebianPool.id);
              }
              self.alllist.sort(function(a, b) {
                return b.weixin.todayAddContactNum - a.weixin.todayAddContactNum;
              })
              console.log(self.alllist);


              self.totalpage = self.alllist.length;
              self.lieBianPool = [];
              var currentSize = self.currentPage * self.pagesize;
              if (currentSize > self.alllist.length) {
                currentSize = self.alllist.length;
              }
              for (var i = (self.currentPage - 1) * self.pagesize; i < currentSize; i++) {
                self.lieBianPool.push(self.alllist[i].weixin);
                // self.$set(self.lieBianPool[i], 'liebianid', self.alllist[i].liebianPool.id);
              }
              // for(var i in self.alllist){
              //   self.$set(self.lieBianPool[i], 'liebianid', self.alllist[i].liebianPool.id);
              // }
              // self.lieBianPool.sort(function(a, b) {
              //   return b.todayAddContactNum - a.todayAddContactNum;
              // })
              // console.log(self.lieBianPool);
            }
          }
        })
        .catch(function(err) {
          console.log(err);
        })
      this.Tmedia();
    },
    memhandleSizeChange: function() {
      var self = this;
      self.weixinlist = [];
      var j = self.diacurrentPage == Math.ceil(self.diallist.length / self.diapagesize) ? self.diallist.length : self.diacurrentPage * self.diapagesize;
      for (var i = (self.diacurrentPage - 1) * self.diapagesize; i < j; i++) {
        self.weixinlist.push(self.diallist[i]);
      }
    },
    memhandleCurrentChange: function(val) {
      var self = this;
      this.diabtcheckall = false;
      this.checkallformember = false;
      self.weixinlist = [];
      self.diacurrentPage = val;
      var j = val == Math.ceil(self.diallist.length / self.diapagesize) ? self.diallist.length : val * self.diapagesize;
      for (var i = (val - 1) * self.diapagesize; i < j; i++) {
        self.weixinlist.push(self.diallist[i]);
      }
      console.log(self.weixinlist);
    },
    handleIconClick: function() {
      if (this.searchcontent == '') {
        this.weixinlist = this.diallist;
      }
      else {
        var self = this;
        this.weixinlist = [_.find(self.diallist, function(chr) { return chr.id == self.searchcontent; })];
      }
    },
    show: function(ev) {
      if (ev.keyCode == 13) {
        if (this.searchcontent == '') {
          this.weixinlist = this.diallist;
        }
        else {
          var self = this;
          this.weixinlist = [_.find(self.diallist, function(chr) {
            return chr.id == self.searchcontent;
          })];
          if (this.members[this.idd] != this.weixinlist[0].id) {
            this.members.push(this.weixinlist[0].id);
            this.idd = this.members.length - 1;
          }
        }
      }
    },
    handleSizeChange: function() {
      var self = this
      self.lieBianPool = []
      var j = self.currentPage == Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : self.currentPage * self.pagesize
      for (var i = (self.currentPage - 1) * self.pagesize; i < j; i++) {
        self.lieBianPool.push(self.alllist[i].weixin);
        // self.$set(self.lieBianPool[i], 'liebianid', self.alllist[i].liebianPool.id);
      }
    },
    handleCurrentChange: function(val) {
      var self = this
      this.btcheckall = false;
      this.checkall = false;
      self.lieBianPool = []
      self.currentPage = val
      var j = val == Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : val * self.pagesize
      for (var i = (val - 1) * self.pagesize; i < j; i++) {
        self.lieBianPool.push(self.alllist[i].weixin);
        // self.$set(self.lieBianPool[i], 'liebianid', self.alllist[i].liebianPool.id);
      }
      console.log(self.lieBianPool);
    },
    confirm: function(val) {
      var self = this;
      this.$confirm("是否删除?", '提示', {
        bonfirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.typeormember == 0) {
          this.typedelet(val);
          console.log(this.typeormember);
        }
        else {
          self.batchdelete();
        }
      }).catch(() => {

      });
    },
    typedelet: function(val) {
      var self = this;
      this.axios.post('/weixin/delete_liebian_type', {
        id: val
      })
        .then(function(res) {
          var data = res.data;
          if (data.code == 0) {
            self.$message("删除成功");
            self.getlianbianlist();
          }
          else {
            self.$message("删除失败");
          }
        })
      this.typeormember = 1;
    },
    getweixinlist: function() {
      var self = this;
      var tipword = '';
      this.typeNum = null;
      this.Nameoftype ='微信昵称';
      var nowtime = Date.now() / 1000;
      self.loading = true;
      this.axios.post('/weixin/get_all_weixin')
        .then(function(res) {
          var data = res.data;
          self.loading = false;
          if (data.code == 0) {
            self.diallist = data.data.map(v => {
              v.edit = false;
              return v;
            });
            if (self.diallist == null) {
              self.weixinlist = [];
            }
            else {
              self.diatotalpage = self.diallist.length;
              self.weixinlist = [];
              var diacurrentSize = self.diacurrentPage * self.diapagesize;
              if (diacurrentSize > self.diallist.length) {
                diacurrentSize = self.diallist.length;
              }
              for (var i = 0; i < self.diallist.length; i++) {
                tipword = '';
                if (self.diallist[i].qrcodeUrl == '') {
                  tipword = tipword + '⑴未添加二维码;';
                }
                if (self.diallist[i].status != 0) {
                  tipword = tipword + '⑴状态不正常;';
                }
                if (nowtime - self.diallist[i].lastHeartbeat > 300) {
                  tipword = tipword + '⑴最后心跳时间超过5分钟;'
                }
                self.$set(self.diallist[i], 'tipword', tipword);
              }
              for (var i = (self.diacurrentPage - 1) * self.diapagesize; i < diacurrentSize; i++) {
                self.weixinlist.push(self.diallist[i]);
              }

              console.log(self.weixinlist);
            }
          }
        })
        .catch(function(err) {
          console.log(err);
          self.loading = false;
        })
      if (this.lbTypenum == null) {
        this.$message("请选择裂变类别")
        return false;
      }
      else {
        this.showaddmember = true;
      }
    },
    addmember: function() {
      var self = this;
      if (this.members == '') {
        this.$message("请选择好友");
        return false;
      }
      else {
        for (var i in this.members) {
          this.numpack.push({
            liebianType: Number.parseInt(this.lbTypenum),
            weixinId: Number.parseInt(this.members[i])
          });
        }
        console.log(this.numpack);
        this.axios.post('/weixin/create_lianbian_pool', this.numpack)
          .then(function(res) {
            var data = res.data;
            if (data.code == 0) {
              self.$message("创建成功");
              self.showaddmember = false;
              self.members = [];
              self.numpack = [];
              self.getliebianpool(self.lbTypenum);
            }
            else {
              self.$message("创建失败");
            }
          })
          .catch(function(err) {
            console.log(err);
            self.$message("创建失败");
          })
        this.diabtcheckall = false;
        this.checkallformember = false;
      }
    },

    Timer: function(val) {
      this.timer = setInterval(() => {
        if (this.tie == 0) {
          this.tie = 60;

          console.log(val);
          var self = this;
          var tipword = '';
          var nowtime = Date.now() / 1000;
          this.axios.post('/weixin/get_lianbian_pool', {
            liebianType: Number.parseInt(val)
          })
            .then(function(res) {
              var data = res.data;
              if (data.code == 0) {
                self.alllist = data.data;
                if (self.alllist == null) {
                  self.lieBianPool = [];
                }
                else {
                  for (var k = 0; k < self.alllist.length; k++) {
                    self.$set(self.alllist[k].weixin, 'liebianid', self.alllist[k].liebianPool.id);
                  }
                  if (!self.SortById) {
                    self.alllist.sort(function(a, b) {
                      return b.weixin.todayAddContactNum - a.weixin.todayAddContactNum;
                    })
                  } else {
                    self.alllist.sort(function(a, b) {
                      return a.weixin.id - b.weixin.id;
                    })
                  }
                  console.log(self.alllist);


                  self.totalpage = self.alllist.length;
                  self.lieBianPool = [];
                  var currentSize = self.currentPage * self.pagesize;
                  if (currentSize > self.alllist.length) {
                    currentSize = self.alllist.length;
                  }
                  for (var i = (self.currentPage - 1) * self.pagesize; i < currentSize; i++) {
                    self.lieBianPool.push(self.alllist[i].weixin);
                  }
                }
                // if (!self.SortById) {
                //   console.log(1111111111111);
                //   self.lieBianPool.sort(function(a, b) {
                //     return b.todayAddContactNum - a.todayAddContactNum;
                //   })
                // }
                // else {
                //   console.log(1111111111);
                //   self.lieBianPool.sort(function(a, b) {
                //     return a.id - b.id;
                //   })
                // }
              }
            })
            .catch(function(err) {
              console.log(err);
            })
        }
        else {
          this.tie--;
          // console.log(this.lbTypenum);
        }
      }, 1000)
    },
    Tmedia: function() {
      var media = null;
      if (media != this.lbTypenum) {
        clearInterval(this.timer);           // .clearInterval();
        media = this.lbTypenum;

        this.Timer(media);
      }
    },
    geterrorlist: function() {
      var self = this;
      this.axios.post('/weixin/get_liebian_error_msg', {
        liebianType: Number.parseInt(this.lbTypenum)
      })
        .then(function(res) {
          var data = res.data;
          if (data.code == 0) {
            self.errall = data.data;
            self.errtotalpage = self.errall.length;
            self.errlist = [];
            var errcurrentSize = self.errcurrentPage * self.errpagesize;
            if (errcurrentSize > self.errall.length) {
              errcurrentSize = self.errall.length;
            }
            for (var i = (self.errcurrentPage - 1) * self.errpagesize; i < errcurrentSize; i++) {
              self.errlist.push(self.errall[i]);
            }
          }
        })
        .catch(function(err) {
          console.log(err);
        })
      this.showerrlist = true;
    },
    errhandleSizeChange: function() {
      var self = this;
      self.errlist = [];
      var j = self.errcurrentPage == Math.ceil(self.errllist.length / self.errpagesize) ? self.errall.length : self.errcurrentPage * self.errpagesize;
      for (var i = (self.errcurrentPage - 1) * self.errpagesize; i < j; i++) {
        self.errlist.push(self.errall[i]);
      }
    },
    errhandleCurrentChange: function(val) {
      var self = this;
      self.errlist = [];
      self.errcurrentPage = val;
      var j = val == Math.ceil(self.errall.length / self.errpagesize) ? self.errall.length : val * self.errpagesize;
      for (var i = (val - 1) * self.errpagesize; i < j; i++) {
        self.errlist.push(self.errall[i]);
      }
    },
  },
  created() {
    this.getlianbianlist();
  },
  beforeDestroy() {
    console.log("销毁前");
    clearInterval(this.timer);
    clearInterval(this.timer);
    clearInterval(this.timer);
    clearInterval(this.timer);
    console.log(this.timer);
  }
}
</script>

<style>
.el-table .info-row {
  background: #FFAEB9;
}

.fission {
  width: 100%;
  padding: 20px
}

select {
  width: 100%;
}

.el-icon-delete:hover {
  background-color: #20a0ff;
}






/*设置本地动画*/

.bounce-enter-active {
  animation: bounce-in 2s;
}

.bounce-leave-active {
  animation: bounce-out 2s;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(0);
  }
}
</style>