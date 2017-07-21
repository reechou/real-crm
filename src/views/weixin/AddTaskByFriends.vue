<template>
    <div class="admin-friendslist">
        <div style="width:80%; padding: 10px">
            <label>选择好友id：{{ wxIds }}</label>
            <el-button type="primary" @click="onSubmit">提交</el-button>
        </div>
        <div style="width:100%; padding:10px">
            <el-date-picker v-model="startTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择起始日期时间"></el-date-picker> -
            <el-date-picker v-model="endTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束日期时间"></el-date-picker>
            <el-button type="primary" @click="searchbyTime">搜索</el-button>
        </div>
        <hr/>
        <template>
            <el-checkbox-group v-model="wxIds">
                <input type="checkbox" @click="checkAll()">全选
                <el-table :data="friendslist" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
                    <el-table-column label="选择" width="80px">
                        <template scope="scope">
                             <input type="checkbox" :id="scope.row.id" :value="scope.row.userName" v-model="wxIds"></input> 
                            <!-- <el-checkbox  :value="scope.row.id" v-model="wxIds"></el-checkbox> -->
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="id"><template scope='scope'>{{ scope.row.id }}</template></el-table-column>       -->
                    <!-- <el-table-column label="微信id"><template scope='scope'>{{ scope.row.id }}</template></el-table-column>  -->
                    <el-table-column label="id">
                        <template scope='scope'>{{ scope.row.id}}</template>
                    </el-table-column>
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
</template>

<script>
export default {
    data() {
        return {
            wxIds: [],
            searchweixin: null,
            loading: false,
            pagesize: 100,
            totalpage: 0,
            currentPage: 0,
            friendslist: [],
            weixinId: 0,
            checkall: false,
            startT: null,
            endT: null,
            startTime: null,
            endTime: null,
            isTimelist:false,
            frilistbytime:[]
        }
    },
    methods: {
        bindsex: function (val) {
            if (val == 1) {
                return '男';
            }
            else {
                return '女'
            }
        },
        getlist: function (val) {
            var self = this;
            this.isTimelist = false;
            var offval = (val - 1) * self.pagesize;
            this.axios.post('/weixin/get_weixin_friends', {
                weixinId: self.weixinId,
                offset: offval,
                num: self.pagesize
            })
                .then(function (res) {
                    var data = res.data;
                    self.loading = false;
                    if (data.code == 0) {
                        self.friendslist = data.data.list;
                        self.totalpage = data.data.count;
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    self.loading = true;
                })
        },
        handleCurrentChange: function (val) {
            var self = this;
            if (!this.isTimelist) {
                this.getlist(val);
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
        checkAll: function () {//全选
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
        onSubmit: function () {
            var self = this;
            var weixintaskid = Number.parseInt(this.$route.query.taskids)
            this.axios.post('/weixin/create_selected_friends_task', {
                weixinId: self.weixinId,
                weixinTaskId: weixintaskid,
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
        searchbyTime: function () {
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
                weixinId: this.weixinId,
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
    },
    created() {
        this.weixinId = Number.parseInt(this.$route.query.id);
        this.getlist(1);
    }
}
</script>

<style>
.admin-friendslist {
    width: 100%;
    padding: 20px
}

input[type="checkbox"] {
    width: 20px;
    height: 20px;
}
</style>