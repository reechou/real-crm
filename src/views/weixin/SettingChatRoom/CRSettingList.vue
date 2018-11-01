<template>
    <div class="addCRS">
        <div style="padding: 10px;">
            <!-- {{ BindId }} -->
            <el-button type="primary" @click="goadd">添加群设置</el-button>
            <el-button type="primary" @click="getweixinlist">批量绑定</el-button>
        </div>
        <template>
            <el-radio-group style="width: 100%; margin-bottom: 80px;" v-model="BindId">
                <el-table :data="settinglist" style="width: 100%; margin-bottom: 80px;" v-loading="Setloading" border element-loading-text="拼命加载中">
                    <el-table-column label="id" align="center" width="80">
                        <template scope="scope">
                            <!-- <span>{{ scope.row.id }}</span> -->
                            <el-radio :label="scope.row.id"></el-radio>
                        </template>
                    </el-table-column>

                    <el-table-column label="时间间隔" align="center">
                        <template scope="scope">
                            <span>{{ scope.row.setting.interval }}</span>
                        </template>
                    </el-table-column>

                    <!-- <el-table-column label="群角色">
                            <template scope="scope">
                                <span>{{ scope.row.setting.chatroomRole }}</span>
                            </template>
                        </el-table-column> -->

                    <el-table-column label="欢迎进群消息" align="center">
                        <template scope="scope">
                            <el-button type="text" @click="getmessage(scope.row.setting.welcomeReplyLoopTime,scope.row.setting.welcomeReply)">查看</el-button>
                        </template>
                    </el-table-column>

                    <el-table-column label="截图消息" align="center">
                        <template scope="scope">
                            <el-button type="text" @click="getmessage(scope.row.setting.screenshotReplyLoopTime,scope.row.setting.screenshotReply)">查看</el-button>
                        </template>
                    </el-table-column>

                    <el-table-column label="定时消息" align="center">
                        <template scope="scope">
                            <el-button type="text" @click="getmessage(scope.row.setting.sysLoopTime,scope.row.setting.sysLoopReply)">查看</el-button>
                        </template>
                    </el-table-column>

                    <el-table-column label="满群设置" align="center">
                        <template scope="scope">
                            <el-button type="text" @click="getfullgrouplist(scope.row.setting.chatroomFullSetting)">查看</el-button>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" align="center">
                        <template scope="scope">
                            <el-row>
                                <el-col :span="12">
                                    <el-button type="primary" @click="goupdate(scope.row)">更新</el-button>
                                </el-col>
                                <el-col :span="12">
                                    <el-button type="primary" @click="confirm(scope.row.id)">删除</el-button>
                                </el-col>
                            </el-row>
                        </template>
                    </el-table-column>
                </el-table>
            </el-radio-group>
        </template>
        <el-dialog title="信息详情" v-model="dialogmessage">
            <el-table :data="messagelist">
                <el-table-column label="发送间隔（/s）" align="center">
                    <template scope="scope">
                        <span>{{ scope.row.LoopTime}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="消息文本" align="center">
                    <template scope="scope">
                        <el-table :data="scope.row.Mcontent">
                            <el-table-column label="内容" align="center">
                                <template scope="scope">
                                    {{ scope.row.content }}
                                </template>
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>

        <el-dialog title="满群设置" v-model="dialogfullgroup">
            <el-table :data="FullGrouplist">
                <el-table-column label="更换群主" align="center">
                    <template scope="scope">
                        {{ scope.row.chatroomChangeOwner }}
                    </template>
                </el-table-column>

                <el-table-column label="满员人数" align="center">
                    <template scope="scope">
                        {{ scope.row.chatroomFullMemberNum }}
                    </template>
                </el-table-column>

                <el-table-column label="群公告" align="center">
                    <template scope="scope">
                        {{ scope.row.chatroomNotice }}
                    </template>
                </el-table-column>

                <el-table-column label="满群后时间" align="center">
                    <template scope="scope">
                        {{ scope.row.chatroomSetTimeAfterFull }}
                    </template>
                </el-table-column>

                <el-table-column label="开启群主邀请" align="center">
                    <template scope="scope">
                        <span v-if="scope.row.ifAutoChangeAccess == 1">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>

                <el-table-column label="同步到通讯录" align="center">
                    <template scope="scope">
                        <!-- {{ scope.row.ifAutoShowInContactBook }} -->
                        <span v-if="scope.row.ifAutoShowInContactBook == 1">是</span>
                        <span v-else>否</span>
                    </template>
                </el-table-column>

            </el-table>
        </el-dialog>

        <el-dialog title="更新设置" v-model="showUpdate">
            <el-form ref="verifysetting" label-position="left" label-width="100px" :model="singlegroupmessage">
                <div class="title-Message">
                    <label>进群欢迎消息:</label>
                </div>
                <div class="border_CRS">
                    <el-form-item label="发送间隔">
                        <el-row>
                            <el-col :span="21">
                                <el-input v-model="singlegroupmessage.welcomeReplyLoopTime" style="width:40%;"></el-input>/秒
                            </el-col>
                            <el-col :span="3">
                                <el-button type="primary" @click="addwelText">新增文本</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <div class="wel_CRS" v-for="(item, key) in singlegroupmessage.welcomeReply">
                        <template v-if="item.msgType == 1">
                            <el-form-item label="文本">
                                <el-input v-model="item.content" type="textarea" :rows="3"></el-input>
                            </el-form-item>
                        </template>
                    </div>
                </div>
                <div class="title-Message">
                    <label>截图消息:</label>
                </div>
                <div class="border_CRS">
                    <el-form-item label="发送间隔">
                        <el-row>
                            <el-col :span="21">
                                <el-input v-model="singlegroupmessage.screenshotReplyLoopTime" style="width:40%;"></el-input>/秒
                            </el-col>
                            <el-col :span="3">
                                <el-button type="primary" @click="addscreenshotText">新增文本</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <div class="wel_CRS" v-for="(item, key) in singlegroupmessage.screenshotReply">
                        <template v-if="item.msgType == 1">
                            <el-form-item label="文本">
                                <el-input v-model="item.content" type="textarea" :rows="3"></el-input>
                            </el-form-item>
                        </template>
                    </div>
                </div>
                <div class="title-Message">
                    <label>定时消息:</label>
                </div>
                <div class="border_CRS">
                    <el-form-item label="发送间隔">
                        <el-row>
                            <el-col :span="21">
                                <el-input v-model="singlegroupmessage.sysLoopTime" style="width:40%;"></el-input>/秒
                            </el-col>
                            <el-col :span="3">
                                <el-button type="primary" @click="addsysloopText">新增文本</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <div class="wel_CRS" v-for="(item, key) in singlegroupmessage.sysLoopReply">
                        <template v-if="item.msgType == 1">
                            <el-form-item label="文本">
                                <el-input v-model="item.content" type="textarea" :rows="3"></el-input>
                            </el-form-item>
                        </template>
                    </div>
                </div>
                <el-form-item label="发送间隔">
                    <el-input v-model="singlegroupmessage.interval"></el-input>
                </el-form-item>
                <div class="title-Message">
                    <label>满群设置:</label>
                </div>
                <div class="border_CRS">
                    <el-form-item label="满群后时间设置">
                        <el-input v-model="singlegroupmessage.chatroomFullSetting.chatroomSetTimeAfterFull" style="width:20%;"></el-input>/秒
                    </el-form-item>
                    <el-form-item label="成员数">
                        <el-input v-model="singlegroupmessage.chatroomFullSetting.chatroomFullMemberNum" style="width:20%;"></el-input>
                    </el-form-item>
                    <el-form-item label="群公告">
                        <el-input v-model="singlegroupmessage.chatroomFullSetting.chatroomNotice" type="textarea" :row="4"></el-input>
                    </el-form-item>
                    <el-form-item label="群主变更">
                        <el-switch v-model="ischangeOwner" @change="changeOwner"></el-switch>
                        <el-input v-if="ischangeOwner" v-model="singlegroupmessage.chatroomFullSetting.chatroomChangeOwner" style="margin-left:10px;width:30%;"></el-input>
                    </el-form-item>
                    <el-form-item label="群主邀请">
                        <el-switch on-value="1" off-value="0" v-model="singlegroupmessage.chatroomFullSetting.ifAutoChangeAccess"></el-switch>
                    </el-form-item>
                    <el-form-item label="同步通讯录">
                        <el-switch on-value="1" off-value="0" v-model="singlegroupmessage.chatroomFullSetting.ifAutoShowInContactBook"></el-switch>
                    </el-form-item>
                </div>
                <el-form-item>
                    <div style="text-align:center;">
                        <el-button @click="getUpdate" type="primary">立即更新</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>

        <el-dialog title="微信列表" v-model="showweixinlist">
            <div><label for="">所选id：</label><span v-for="item in weixinids">{{item}}, </span></div>
            <div style="width: 400px;padding: 10px">
                <div style="margin-bottom: 20px;">
                <el-input placeholder="请输入微信号" icon="search" v-model="searchcontent" :on-icon-click="handleIconClick"  @keyup.enter.native="show($event)"></el-input>
                </div>
                <label >微信群角色</label>
                <el-select v-model="wxRole" placeholder="请选择">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-button type="primary" @click="settask()">确定</el-button>
            </div>
            <template>
            <el-checkbox-group v-model="weixinids">
                <input type="checkbox" @click="checkAll()">全选
            <el-table
                :data="weixinlist" style="width: 100%;margin-bottom: 80px" v-loading="weixinloading" element-loading-text="拼命加载中">
                <el-table-column prop="id" label="选择"><template scope="scope">
                    <el-checkbox :label="scope.row.id"></el-checkbox>
                </template></el-table-column> 
                <el-table-column prop="id" label="id"> </el-table-column>      
                <el-table-column prop="nickName" label="微信昵称"> </el-table-column>
                <el-table-column prop="wxId" label="微信id"></el-table-column>
                <el-table-column prop="wechat" label="微信号"> </el-table-column>
                <el-table-column label="是否已执行默认任务"> <template scope='scope'>{{ifExecDefaultTask(scope.row.ifExecDefaultTask)}}</template></el-table-column>
                <el-table-column label="创建日期"> <template scope='scope'>{{formate(scope.row.createAt)}}</template></el-table-column>                 
            </el-table>
            </el-checkbox-group>
            </template>
            <div style="margin-bottom: 40px">
                <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="wxcurrentPage" :page-size = 'wxpagesize' ayout="total, prev, pager, next" :total = 'wxtotalpage'></el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            wxRole: '',                      // 微信群角色
            options: [{
                value: ' chatroom-role-master',
                label: '主'
            },{
                value: 'chatroom-role-slave',
                label: '备'
            }],
            settinglist: [],
            Setloading: false,
            dialogmessage: false,
            messagelist: [{               // 获取的加群欢迎信息， 截图信息 或者 定时信息详情
                LoopTime: null,
                Mcontent: []
            }],
            FullGrouplist: [],
            dialogfullgroup: false,
            showUpdate: false,      // 更新弹窗判断

            singlegroupmessage: {     // 更新时获取的单个群设置的信息
                welcomeReply: [{        //进群欢迎信息
                    msgType: 1,
                    content: ''
                }],
                screenshotReply: [{    // 截图消息
                    msgType: 1,
                    content: ''
                }],
                sysLoopReply: [{       // 定时消息
                    msgType: 1,
                    content: ''
                }],
                interval: 3,         // 发送消息间隔
                welcomeReplyLoopTime: 300,            // 进群欢迎消息发送间隔
                screenshotReplyLoopTime: 300,        // 截图消息发送间隔
                sysLoopTime: 600,                    // 定时消息发送间隔
                chatroomFullSetting: {               // 群满设置
                    chatroomSetTimeAfterFull: 600,        // 满群后多少时间设置
                    chatroomFullMemberNum: 0,             // 群满成员个数
                    chatroomNotice: '',                   // 群公告设置
                    ifAutoChangeAccess: '0',                // 是否开启群主邀请
                    chatroomChangeOwner: '',               // 是否变更群主
                    ifAutoShowInContactBook: '0'            // 是否同步到通讯录
                }
            },
            ischangeOwner: false,
            fullGroupid: null,
            BindId: null,
            // 所有微信弹窗显示
            showweixinlist: false,                      // 显示微信列表弹窗
            weixinloading: false,                       // 加载中的动画
            allweixinlist: [],                          // 所有微信
            weixinlist: [],                              // 当前页微信
            wxcurrentPage: 1,
            wxpagesize: 100,
            wxtotalpage: 1,
            checkall: false,                            // 判断全选
            weixinids: [],                              // 选择的微信id
            searchcontent: '',
            idd: 0,                                     // 记录选择的微信的序号
            tasknumpack: []                             // 将群设置id和微信列表组合后的req list       
        }
    },
    methods: {
        changeOwner: function () {
            if(this.ischangeOwner == false) {
                this.singlegroupmessage.chatroomFullSetting.chatroomChangeOwner = '';
            } else {
                return false;
            }
        },
        settask: function () {
            var self = this;
            this.tasknumpack = [];
            if(this.weixinids == [] || this.wxRole == ''){
                this.$message("请选择完整信息");
                return false;
            } else {
                for(var i=0; i< this.weixinids.length; i++) {
                    this.tasknumpack.push({
                        weixinId: Number.parseInt(this.weixinids[i]),
                        chatroomRole: this.wxRole,
                        weixinChatroomSettingId: Number.parseInt(this.BindId)
                    })
                }
                this.axios.post('/weixin/create_weixin_group_member_list',this.tasknumpack)
                    .then(function (res) {
                        var data = res.data;
                        if(data.code == 0) {
                            self.$message("创建成功");
                            self.showweixinlist = false;
                            self.weixinids = [];
                            self.wxRole = '';
                        } else {
                            self.$message("创建失败");
                            self.weixinids = []; 
                            self.wxRole = '';
                        }
                    })
                    .catch(function(err){
                        console.log(err);
                    })
            }
            console.log(this.tasknumpack);
        },
        getUpdate: function() {
            var self = this;
            var updateDate = '';
            this.singlegroupmessage.chatroomFullSetting.ifAutoChangeAccess = Number.parseInt(this.singlegroupmessage.chatroomFullSetting.ifAutoChangeAccess);
            this.singlegroupmessage.chatroomFullSetting.ifAutoShowInContactBook = Number.parseInt(this.singlegroupmessage.chatroomFullSetting.ifAutoShowInContactBook);
            this.singlegroupmessage.chatroomFullSetting.chatroomSetTimeAfterFull = Number.parseInt(this.singlegroupmessage.chatroomFullSetting.chatroomSetTimeAfterFull);
            this.singlegroupmessage.chatroomFullSetting.chatroomFullMemberNum = Number.parseInt(this.singlegroupmessage.chatroomFullSetting.chatroomFullMemberNum);
            this.singlegroupmessage.welcomeReplyLoopTime = Number.parseInt(this.singlegroupmessage.welcomeReplyLoopTime);
            this.singlegroupmessage.screenshotReplyLoopTime = Number.parseInt(this.singlegroupmessage.screenshotReplyLoopTime);
            this.singlegroupmessage.sysLoopTime = Number.parseInt(this.singlegroupmessage.sysLoopTime);
            this.singlegroupmessage.interval = Number.parseInt(this.singlegroupmessage.interval);

            updateDate = JSON.stringify(this.singlegroupmessage);
            // console.log(updateDate);
            
            this.axios.post('/weixin/update_chatroom_setting',{
                id: this.fullGroupid,
                setting: updateDate
            })
            .then(function (res) {
                var data = res.data;
                if(data.code == 0) {
                    self.$message("Update Success");
                    self.showUpdate = false;
                } else {
                    self.$message("Update Fail");
                }
            })
            .catch(function (err){
                console.log(err);
                self.$message("Update Fail");
            })
        },
        confirm: function (val) {
            var self = this;
            this.$confirm('是否删除', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                self.delet(val);
            }).catch(() => {

            });
        },
        delet: function (val) {
            var self = this;
            this.axios.post('/weixin/delete_chatroom_setting',{
                id: val
            })
            .then(function (res) {
                var data = res.data;
                if(data.code == 0){
                    self.$message("删除成功");
                    self.getSetting();
                } else {
                    self.$message("删除失败");
                }
            })
            .catch(function(err){
                console.log(err);
                self.$message("删除失败");
            })
        },
        addwelText: function() {                                               // 增加欢迎消息文本
            this.singlegroupmessage.welcomeReply.push({ msgType: 1, content: '' });
        },
        addscreenshotText: function() {                                        // 增加截图消息文本
            this.singlegroupmessage.screenshotReply.push({ msgType: 1, content: '' });
        },
        addsysloopText: function() {                                           // 增加定时消息文本
            this.singlegroupmessage.sysLoopReply.push({ msgType: 1, content: '' });
        },
        goupdate: function(val) {
            this.singlegroupmessage = val.setting;
            this.fullGroupid = val.id;
            this.singlegroupmessage.chatroomFullSetting.ifAutoChangeAccess = this.singlegroupmessage.chatroomFullSetting.ifAutoChangeAccess.toString();
            this.singlegroupmessage.chatroomFullSetting.ifAutoShowInContactBook = this.singlegroupmessage.chatroomFullSetting.ifAutoShowInContactBook.toString();
            if (val.setting.chatroomFullSetting.chatroomChangeOwner != "") {
                this.ischangeOwner = true;
            } else {
                this.ischangeOwner = false;
            }
            this.showUpdate = true;
        },
        getfullgrouplist: function(val) {
            this.FullGrouplist = [];
            this.FullGrouplist[0] = val;
            //   console.log(this.FullGrouplist);
            this.dialogfullgroup = true;
        },
        goadd: function() {
            this.$router.push('/addCRSetting');
        },
        getSetting: function() {
            var self = this;
            this.settinglist = [];
            this.axios.post('/weixin/get_all_chatroom_setting')
                .then(function(res) {
                    var data = res.data;
                    if (data.code == 0) {
                        if (data.data != null) {
                            self.settinglist = data.data;
                            for (var i in self.settinglist) {
                                self.settinglist[i].setting = JSON.parse(self.settinglist[i].setting);
                            }
                            // console.log(self.settinglist);
                        }
                    }
                })
        },
        getmessage: function(time, Mcontent) {
            this.messagelist[0].LoopTime = time;
            this.messagelist[0].Mcontent = Mcontent;
            console.log(this.messagelist);
            this.dialogmessage = true;
        },
        getweixinlist: function () {
            var self = this;
            if(this.BindId != null){
            self.weixinloading = true;
            this.axios.post('weixin/get_all_weixin')
                .then(function(res){
                    var data = res.data;
                    if (data.code == 0) {
                        self.weixinloading = false;
                        self.allweixinlist = data.data.map(v => {
                            v.edit = false;
                            return v;
                        });
                        if( self.allweixinlist == null) {
                            self.weixinlist = [];
                        } else {
                            self.wxtotalpage = self.allweixinlist.length;
                            self.weixinlist = [];
                            var wxcurrentSize = self.wxcurrentPage * self.wxpagesize;
                            if(wxcurrentSize > self.allweixinlist.length) {
                                currentSize = self.allweixinlist.length;
                            }
                            for( var i = (self.wxcurrentPage - 1) * self.wxpagesize; i< wxcurrentSize; i++) {
                                self.weixinlist.push(self.allweixinlist[i]);
                            }
                        }
                        self.showweixinlist = true;
                    }
                })
                .catch(function(err) {
                    console.log(err);
                })
            } else {
                this.$message("请选择群设置");
                return false;
            }
        },
        handleSizeChange: function (){
            var self = this
            self.weixinlist = []
            var j = self.wxcurrentPage == Math.ceil(self.allweixinlist.length/self.wxpagesize) ? self.allweixinlist.length : self.wxcurrentPage*self.wxpagesize
            for(var i = (self.wxcurrentPage-1)*self.wxpagesize; i < j; i++){
                self.weixinlist.push(self.allweixinlist[i])             
            }
        },
        handleCurrentChange: function (val){
            var self = this
            self.weixinlist = []
            var j = val == Math.ceil(self.allweixinlist.length/self.wxpagesize) ? self.allweixinlist.length : val * self.wxpagesize  
            for(var i = (val-1)*self.wxpagesize; i < j; i++){
                self.weixinlist.push(self.allweixinlist[i])
            }
        },
        handleIconClick: function () {
            if(this.searchcontent == ''){
            this.weixinlist = this.allweixinlist
            }
            else{
            var self = this
            this.weixinlist = [_.find(self.allweixinlist, function(chr) {return chr.id == self.searchcontent;})]
            }
        },
        checkAll: function () {//全选
            if (!this.checkall) {
                this.weixinids = []         
            this.weixinlist.forEach((item) => {
                this.weixinids.push(item.id);
            });
            this.checkall = true
            }
            else{
                    this.weixinids = [] 
                this.checkall = false                
            }
        },
        show: function (ev) {
        if (ev.keyCode == 13) {
            if (this.searchcontent == '') {
            // this.weixinlist = this.allweixinlist;
            return false;
            }
            else {
            var self = this;
            this.weixinlist = [_.find(self.allweixinlist, function (chr) { return chr.id == self.searchcontent; })]
            if(this.weixinids[this.idd] != this.weixinlist[0].id){
                this.weixinids.push(this.weixinlist[0].id);
                this.idd = this.weixinids.length - 1;
            }
            }
        }
        },
        ifExecDefaultTask: function (val) {
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
    },
    created() {
        this.getSetting();
    }
}
</script>

<style>
.addCRS {
    width: 100%;
    padding: 20px;
}

.title-Message {
    /* 标题样式 */
    margin-bottom: 10px;
}

.border_CRS {
    /* 线框样式 */
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    border: 2px dashed #B4CDCD;
    margin-bottom: 20px;
}

.wel_CRS {
    margin-top: 20px;
}
</style>
