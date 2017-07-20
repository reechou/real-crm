<template>
  <div class="admin-userlist">
    <div style="width: 100%; padding: 10px">
        <el-button @click ="goweixinsettask">创建任务</el-button>
    </div>
    <div style="width: 100%;padding: 10px">
        <label>标签列表:  </label>
             <el-button v-for="item in alltagslist" type="text"  @click="getfbytag(item.id)">#{{ item.groupName }}#</el-button>    <!--@click="settask(scope.row.id)"-->
    </div>
    <div style="width:100%; padding:10px">
        <el-date-picker v-model="startTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间" ></el-date-picker> --------
        <el-date-picker v-model="endTime" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"></el-date-picker>
        <el-button type="primery" @click="searchbyTime">搜索</el-button>
    </div>
    <template>
      <el-table
        :data="friendslist" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column label="id"><template scope='scope'>{{ scope.row.id }}</template></el-table-column>      
        <!-- <el-table-column label="微信id"><template scope='scope'>{{ scope.row.id }}</template></el-table-column> -->
        <el-table-column label="用户名"><template scope='scope'>{{ scope.row.userName }}</template></el-table-column>
        <el-table-column label="别名"><template scope='scope'>{{scope.row.aliasName}}</template></el-table-column>  
        <el-table-column label="微信昵称"><template scope='scope'>{{scope.row.nickName}}</template></el-table-column>  
        <el-table-column label="手机号"> <template scope="scope">{{scope.row.phoneNumber}}</template></el-table-column>                                                                  
        <el-table-column label="性别"> <template scope="scope">{{bindsex(scope.row.sex)}}</template></el-table-column>                                                                  
        <el-table-column label="所在地" width="200px">
            <template scope="scope">
                国家:{{scope.row.country}} 省份:{{ scope.row.province}} 城市:{{ scope.row.city }}
            </template>
        </el-table-column>
        <el-table-column label="备注" width="200px"> <template scope="scope">{{scope.row.remark}}</template></el-table-column>        
        <el-table-column label="操作" v-if="istag">
            <template scope="scope">
                <el-button type="button" size="small" @click="confirm(scope.row.id)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
    </template>
    <div style="margin-bottom: 40px" v-if="!isTimelist">
        <el-pagination 
          @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size = 'pagesize' ayout="total, prev, pager, next" :total = 'totalpage'></el-pagination>
       </div>
    <div style="margin-bottom:40px" v-if="isTimelist">
        <el-pagination 
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="currentPage" :page-size = 'pagesize' ayout="total, prev, pager, next" :total = 'totalpage'></el-pagination>
    </div>
  </div>
</template>

<script>
    export default {
        data(){
            return{
                alltagslist:[],
                frilistbytime:[],
                loading: false,
                friendslist:[],
                pagesize: 100,
                totalpage: 0,
                currentPage: 1,
                tagfrilist:[],
                istag: false,  // 标记是否为根据tag查询得到的列表,
                tagid: 0,         // 获取tagID
                startT: null,
                endT: null,
                startTime: null,
                endTime: null,
                isTimelist: false
            }  
        },
        methods:{
            // 中国标准时间转换成时间戳
            formatTen: function(num) {
                return num>0 ? (num + "") : ("0" + num);
            },
            timeChange: function(date){
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var second = date.getSeconds();
                return year + "-" + this.formatTen(month) + "-" + this.formatTen(day);
            },
            bindsex: function(val) {
                if(val == 1){
                    return '男';
                }
                else{
                    return '女';
                }
            },
            getfriendslist: function(val) {
                
                var self = this;
                var Id = Number.parseInt(this.$route.query.id);
                var offval = (val-1)*self.pagesize;
                console.log(offval);
                self.loading = true
                this.axios.post('/weixin/get_weixin_friends',{
                    weixinId: Id,
                    offset: offval,
                    num: self.pagesize
                })
                .then(function(res){
                    var data = res.data;
                    self.loading = false;
                    console.log(data);
                    if(data.code == 0){
                        self.friendslist = data.data.list;
                        self.totalpage = data.data.count;
                    }
                })
                .catch(function(err){
                    console.log(err);
                    self.loading = false
                })
            },
            handleCurrentChange: function (val){
                    var self = this;
                if(!this.isTimelist){
                    this.getfriendslist(val)
                }
                else{
                    self.friendslist = [];
                    self.ccurrentPage = val;
                    var j = val == Math.ceil(self.frilistbytime.length/self.pagesize) ? self.frilistbytime.length : val *　self.pagesize;
                    for(var i = (val-1)* self.pagesize; i<j; i++){
                        self.friendslist.push(self.frilistbytime[i]);
                    }
                }
            },
            handleSizeChange: function() {
                var self = this;
                self.friendslist = [];
                var j = self.currentPage == Math.ceil(self.frilistbytime.length/self.pagesize) ? self.frilistbytime.length : self.currentPage*self.pagesize
                for(var i = (sefl.currentPage-1)*self.pagesize; i < j; i++){
                    self.friendslist.push(self.frilistbytime[i]);
                }
            },
            gettaglist: function() {
                var self = this;
                var Id = Number.parseInt(this.$route.query.id);
                this.axios.get('/weixin/get_weixin_friends_tags')
                    .then(function(res){
                        var data = res.data;
                        if(data.code == 0){
                            self.alltagslist = data.data;
                            console.log(self.alltagslist);
                        }
                    })
            },
            getfbytag: function(val) {
                var self = this;
                this.tagid = val;
                this.istag = true;
                this.isTimelist = false;
                var Id = Number.parseInt(this.$route.query.id);
                this.axios.post('/weixin/get_weixin_friends_from_tag',{
                    weixinId: Id,
                    tagId: val
                    })
                    .then(function(res){
                        var data = res.data;
                        if(data.code == 0){
                            self.tagfrilist = data.data;
                            self.totalpage = self.tagfrilist.length;
                            self.friendslist = [];                     
                            for(var i = 0; i < self.tagfrilist.length; i++){
                                self.friendslist.push(self.tagfrilist[i].contact);
                            }
                            console.log(self.friendslist);
                        }
                    })
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
            delet: function(val) {                               
                var self = this;
                var Id = Number.parseInt(this.$route.query.id);
                console.log(val);
                this.axios.post('/weixin/delete_weixin_friend_tag', {
                     weixinId: Id,
                     tagId: self.tagid,
                     wxContactId: val
                     })   
                    .then(function(res) {
                        var data = res.data
                        if (data.code === 0) {
                        self.$message('删除成功');
                        this.getfbytag(self.tagid);
                        }
                        else {
                        self.$message('删除失败');
                        }
                    })
                    .catch(function(err){
                        console.log(err);
                    })
            },
            goweixinsettask: function() {
                var ID = Number.parseInt(this.$route.query.id)
                this.$router.push('/weixinsettask?id='+ ID);
            },
            searchbyTime: function(){ 
                var Id = Number.parseInt(this.$route.query.id);
                var self = this;
                this.isTimelist = true;
                if(this.startTime == null || this.endTime == null){
                    this.$message("请选择时间范围");
                    return false;
                }
                // var Stime = self.timeChange(this.startTime);
                // var Etime = self.timeChange(this.endTime);
                self.startT = Math.floor(new Date(this.startTime).getTime() / 1000);
                self.endT = Math.floor(new Date(this.endTime).getTime() / 1000);
                 
                console.log(self.startT);
                console.log(self.endT);
                this.axios.post('/weixin/get_weixin_friends_from_time',{
                    weixinId: Id,
                    startTime: self.startT,
                    endTime: self.endT
                })
                .then(function(res){
                    var data = res.data;
                    if(data.code == 0){
                        self.frilistbytime = data.data;
                        self.totalpage = self.frilistbytime.length;
                        self.friendslist = [];
                        var currentSize = self.currentPage*self.pagesize;
                        if(currentSize >self.frilistbytime.length){
                            currentSize = self.frilistbytime.length;
                        }
                        for(var i = (self.currentPage -1 ) * self.pagesize; i< currentSize; i++){
                            self.friendslist.push(self.frilistbytime[i]);
                        }
                    }
                })
                .catch(function(err){
                    console.log(err);
                })
            }
        },
        created(){
            this.getfriendslist(1);
            this.gettaglist();
        }
    }
</script>

<style>
  
</style>
