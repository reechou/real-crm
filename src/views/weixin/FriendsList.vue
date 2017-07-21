<template>
    <div class="admin-userlist" >
        <div class="friends" v-if="istaskpage">
            <div style="width: 100%; padding: 10px">
                <el-button type="primary" @click="goweixinsettask">选择任务</el-button>
            </div>
            <div style="width: 100%;padding: 10px">
                <el-button type="primary" @click="getfriendslist(1)" style="margin-right: 30px;">显示全部好友</el-button>
                <label>标签列表: </label>
                <el-button type="primary" v-for="item in alltagslist" @click="getfbytag(item.id),color2(0)" v-bind:style="{background:tbuttoncolor}">{{ item.groupName }}</el-button>
                <!-- -->
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
    
            <template>
                <el-checkbox-group v-model="wxIds">
                    <input type="checkbox" @click="checkAll()">全选</input>
                    <p align="right">已选人数:{{ wxIds.length }}</p>
                    <el-table :data="friendslist" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
                        <el-table-column label="选择" width="80px">
                            <template scope="scope">
                                <input type="checkbox" :id="scope.row.id" :value="scope.row.userName" v-model="wxIds"></input>
                                <!-- <el-checkbox  :value="scope.row.id" v-model="wxIds"></el-checkbox> -->
                            </template>
                        </el-table-column>
                        <el-table-column label="id">
                            <template scope='scope'>{{ scope.row.id }}</template>
                        </el-table-column>
                        <!-- <el-table-column label="微信id"><template scope='scope'>{{ scope.row.id }}</template></el-table-column> -->
                        <el-table-column label="微信id">
                            <template scope='scope'>{{ scope.row.userName }}</template>
                        </el-table-column>
                        <el-table-column label="微信号">
                            <template scope='scope'>{{scope.row.aliasName}}</template>
                        </el-table-column>
                        <el-table-column label="微信昵称">
                            <template scope='scope'>{{scope.row.nickName}}</template>
                        </el-table-column>
                        <el-table-column label="手机号">
                            <template scope="scope">{{scope.row.phoneNumber}}</template>
                        </el-table-column>
                        <el-table-column label="性别">
                            <template scope="scope">{{bindsex(scope.row.sex)}}</template>
                        </el-table-column>
                        <el-table-column label="所在地" width="200px">
                            <template scope="scope">
                                国家:{{scope.row.country}} 省份:{{ scope.row.province}} 城市:{{ scope.row.city }}
                            </template>
                        </el-table-column>
                        <el-table-column label="创建时间" width="150px">
                            <template scope='scope'>{{formate(scope.row.createAt)}}</template>
                        </el-table-column>
                        <el-table-column label="备注" width="150px">
                            <template scope="scope">{{scope.row.remark}}</template>
                        </el-table-column>
                        <el-table-column label="操作" v-if="istag">
                            <template scope="scope">
                                <el-button type="button" size="small" @click="confirm(scope.row.id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-checkbox-group>
            </template>
            <div style="margin-bottom: 40px" v-if="!isTimelist">
                <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size='pagesize' ayout="total, prev, pager, next" :total='totalpage'></el-pagination>
            </div>
            <div style="margin-bottom:40px" v-if="isTimelist">
                <el-pagination @current-change="handleCurrentChange" @size-change="handleSizeChange" :current-page="currentPage" :page-size='pagesize' ayout="total, prev, pager, next" :total='totalpage'></el-pagination>
            </div>
        </div>
        <div class="task" v-if="!istaskpage">
            <el-row :gutter="20">
                <el-col :span="18">
                    <p>选中任务id:{{ taskIds }}</p>
                </el-col>
                <el-col :span="6" align="center">
                    <el-button type="primary" @click="onSubmit">提交</el-button>
                    <el-button type="primary" @click="goback">返回</el-button>
                    
                </el-col>
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
    data() {
        return {
            alltagslist: [],
            frilistbytime: [],
            loading: false,
            friendslist: [],
            pagesize: 100,
            totalpage: 0,
            currentPage: 1,
            tagfrilist: [],
            istag: false,  // 标记是否为根据tag查询得到的列表,
            tagid: null,         // 获取tagID
            startT: null,
            endT: null,
            startTime: null,
            endTime: null,
            isTimelist: false,
            wxIds: [],
            checkall: false,
            a: Date.now(),
            time: null,
            Clicktime: 0,
            firstclick: {
                startTime: null,
                endTime: null
            },
            twoclick: {
                startTime: null,
                endTime: null
            },
            backcolor0: '#20a0ff',
            backcolor1: '#20a0ff',
            backcolor2: '#20a0ff',
            backcolor3: '#20a0ff',
            backcolor4: '#20a0ff',
            tbuttoncolor: '#20a0ff',
            issearch: false,
            istaskpage: true,
            taskIds: [],
            tasklist: [],
            tasklistby1: [],
            dialogTableVisible1: false,
            replylist1: [],
            weixinId: 0,
            weixinTaskId: '',
            weixinids: [],
            selectfriends: []

        }
    },
    methods: {
        // 中国标准时间转换成时间戳
        formatTen: function (num) {
            return num > 0 ? (num + "") : ("0" + num);
        },
        timeChange: function (date) {
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            return year + "-" + this.formatTen(month) + "-" + this.formatTen(day);
        },
        bindsex: function (val) {
            if (val == 1) {
                return '男';
            }
            else {
                return '女';
            }
        },
        checkAll: function () {
            if (!this.checkall) {
                this.wxIds = [];
                this.friendslist.forEach((item) => {
                    this.wxIds.push(item.userName);
                });
                this.checkall = true;
            }
            else {
                this.wxIds = [];
                this.checkall = false;
            }
        },
        Issearch: function () {
            this.issearch = true;
            this.getfribytat(this.startTime, this.endTime);
        },
        color2: function (val) {
            if (val == 0) {
                this.tbuttoncolor = (this.tbuttoncolor == '#20a0ff' ? '#005494' : '#20a0ff');
            }
        },
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
        getfriendslist: function (val) {

            var self = this;
            this.tagid = null;
            this.istag = false;
            var Id = Number.parseInt(this.$route.query.id);
            var offval = (val - 1) * self.pagesize;
            console.log(offval);
            self.loading = true
            this.axios.post('/weixin/get_weixin_friends', {
                weixinId: Id,
                offset: offval,
                num: self.pagesize
            })
                .then(function (res) {
                    var data = res.data;
                    self.loading = false;
                    console.log(data);
                    if (data.code == 0) {
                        self.friendslist = data.data.list;
                        self.totalpage = data.data.count;
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    self.loading = false
                })
        },
        handleCurrentChange: function (val) {
            var self = this;
            if (!this.isTimelist) {
                this.getfriendslist(val)
            }
            else {
                self.friendslist = [];
                self.currentPage = val;
                var j = val == Math.ceil(self.frilistbytime.length / self.pagesize) ? self.frilistbytime.length : val * self.pagesize;
                for (var i = (val - 1) * self.pagesize; i < j; i++) {
                    self.friendslist.push(self.frilistbytime[i]);
                }
            }
        },
        handleSizeChange: function () {
            var self = this;
            self.friendslist = [];
            var j = self.currentPage == Math.ceil(self.frilistbytime.length / self.pagesize) ? self.frilistbytime.length : self.currentPage * self.pagesize;
            for (var i = (sefl.currentPage - 1) * self.pagesize; i < j; i++) {
                self.friendslist.push(self.frilistbytime[i]);
            }
        },
        gettaglist: function () {
            var self = this;
            var Id = Number.parseInt(this.$route.query.id);
            this.axios.get('/weixin/get_weixin_friends_tags')
                .then(function (res) {
                    var data = res.data;
                    if (data.code == 0) {
                        self.alltagslist = data.data;
                        console.log(self.alltagslist);
                    }
                })
        },
        getfbytag: function (val) {
            var self = this;
            this.tagid = val;
            this.istag = true;
            this.isTimelist = false;

            self.startT = Math.floor(new Date(this.startTime).getTime() / 1000);
            self.endT = Math.floor(new Date(this.endTime).getTime() / 1000);

            var Id = Number.parseInt(this.$route.query.id);
            if (this.twoclick.startTime == 0 && this.twoclick.endTime == 0) {
                this.axios.post('/weixin/get_weixin_friends_from_tag', {
                    weixinId: Id,
                    tagId: val,
                    startTime: self.startT,
                    endTime: self.endT
                })
                    .then(function (res) {
                        var data = res.data;
                        if (data.code == 0) {
                            self.tagfrilist = data.data;
                            self.totalpage = self.tagfrilist.length;
                            self.friendslist = [];
                            for (var i = 0; i < self.tagfrilist.length; i++) {
                                self.friendslist.push(self.tagfrilist[i].contact);
                            }
                            console.log(self.friendslist);
                        }
                    })
            }
            else {
                this.istag = true;
                this.axios.post('/weixin/get_weixin_friends_from_tag', {
                    weixinId: Id,
                    tagId: this.tagid,
                    startTime: this.twoclick.startTime,
                    endTime: this.twoclick.endTime
                })
                    .then(function (res) {
                        var data = res.data;
                        if (data.code == 0) {
                            self.tagfrilist = data.data;
                            self.totalpage = self.tagfrilist.length;
                            self.friendslist = [];
                            var currentSize = self.currentPage * self.pagesize;
                            if (currentSize > self.tagfrilist.length) {
                                currentSize = self.tagfrilist.length;
                            }
                            for (var i = (self.currentPage - 1) * self.pagesize; i < currentSize; i++) {
                                self.friendslist.push(self.tagfrilist[i].contact);
                            }
                        }
                    });
            }
        },
        getfribytat: function (st, ed) {
            console.log(this.issearch);
            var self = this;
            var datae = new Date();
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
            if (this.Clicktime == 1) {
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
            this.twoclick.startTime = self.startT;
            this.twoclick.endTime = self.endT;
            if (this.tagid == null) {
                console.log(111111);
                this.axios.post('/weixin/get_weixin_friends_from_time', {
                    weixinId: Id,
                    startTime: self.startT,
                    endTime: self.endT
                })
                    .then(function (res) {
                        var data = res.data;
                        if (data.code == 0) {
                            self.frilistbytime = data.data;
                            self.totalpage = self.frilistbytime.length;
                            self.friendslist = [];
                            var currentSize = self.currentPage * self.pagesize;
                            if (currentSize > self.frilistbytime.length) {
                                currentSize = self.frilistbytime.length;
                            }
                            for (var i = (self.currentPage - 1) * self.pagesize; i < currentSize; i++) {
                                self.friendslist.push(self.frilistbytime[i]);
                            }
                        }
                    })
                    .catch(function (err) {
                        console.log(err);
                        self.friendslist = [];
                    })
            }
            else {
                console.log(2222222);
                console.log(this.tagid);
                this.istag = true;
                this.axios.post('/weixin/get_weixin_friends_from_tag', {
                    weixinId: Id,
                    tagId: this.tagid,
                    startTime: self.startT,
                    endTime: self.endT
                })
                    .then(function (res) {
                        var data = res.data;
                        if (data.code == 0) {
                            self.tagfrilist = data.data;
                            self.totalpage = self.tagfrilist.length;
                            self.friendslist = [];
                            var currentSize = self.currentPage * self.pagesize;
                            if (currentSize > self.tagfrilist.length) {
                                currentSize = self.tagfrilist.length;
                            }
                            for (var i = (self.currentPage - 1) * self.pagesize; i < currentSize; i++) {
                                self.friendslist.push(self.tagfrilist[i].contact);
                            }
                        }
                    })
            }
            this.issearch = false;
        },
        confirm(val) {
            var self = this
            this.$confirm('是否删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                self.delet(val)
            }).catch(() => {
            });
        },
        delet: function (val) {
            var self = this;
            var Id = Number.parseInt(this.$route.query.id);
            console.log(val);
            this.axios.post('/weixin/delete_weixin_friend_tag', {
                weixinId: Id,
                tagId: self.tagid,
                wxContactId: val
            })
                .then(function (res) {
                    var data = res.data
                    if (data.code === 0) {
                        self.$message('删除成功');
                        this.getfbytag(self.tagid);
                    }
                    else {
                        self.$message('删除失败');
                    }
                })
                .catch(function (err) {
                    console.log(err);
                })
        },
        goweixinsettask: function () {
            this.istaskpage = false;
        },
        searchbyTime: function () {
            var Id = Number.parseInt(this.$route.query.id);
            var self = this;
            this.isTimelist = true;
            if (this.startTime == null || this.endTime == null) {
                this.$message("请选择时间范围");
                return false;
            }
            // var Stime = self.timeChange(this.startTime);
            // var Etime = self.timeChange(this.endTime);
            self.startT = Math.floor(new Date(this.startTime).getTime() / 1000);
            self.endT = Math.floor(new Date(this.endTime).getTime() / 1000);

            console.log(self.startT);
            console.log(self.endT);
            this.axios.post('/weixin/get_weixin_friends_from_time', {
                weixinId: Id,
                startTime: self.startT,
                endTime: self.endT
            })
                .then(function (res) {
                    var data = res.data;
                    if (data.code == 0) {
                        self.frilistbytime = data.data;
                        self.totalpage = self.frilistbytime.length;
                        self.friendslist = [];
                        var currentSize = self.currentPage * self.pagesize;
                        if (currentSize > self.frilistbytime.length) {
                            currentSize = self.frilistbytime.length;
                        }
                        for (var i = (self.currentPage - 1) * self.pagesize; i < currentSize; i++) {
                            self.friendslist.push(self.frilistbytime[i]);
                        }
                    }
                })
                .catch(function (err) {
                    console.log(err);
                })
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
                friends: this.wxIds
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
        goback:function() {
            this.istaskpage = true;
        }

},
created() {
    this.getfriendslist(1);
    this.gettaglist();
    this.weixinId = Number.parseInt(this.$route.query.id)
    this.gettasklist()
}
    
}
</script>

<style>
.button-bg {
    background-color: #005494;
}
</style>
