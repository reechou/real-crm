<template>
    <div class="admin-friendslist">
        <div style="width:80%; padding: 10px">
            <label>选择好友id：{{ wxIds }}</label>
            <el-button @click="onSubmit">提交</el-button>
        </div>
        <template>
            <el-checkbox-group v-model="wxIds">
                <input type="checkbox" @click="checkAll()">全选
            <el-table
                :data="friendslist" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
                <el-table-column label="选择" width="80px">
                    <template scope="scope">
                      <input type="checkbox" :id="scope.row.id" :value="scope.row.userName" v-model="wxIds"></input>
                    </template>
                </el-table-column>                 
                <!-- <el-table-column label="id"><template scope='scope'>{{ scope.row.id }}</template></el-table-column>       -->
                 <!-- <el-table-column label="微信id"><template scope='scope'>{{ scope.row.id }}</template></el-table-column>  -->
                <el-table-column label="id"><template scope='scope'>{{ scope.row.id}}</template></el-table-column>
                <el-table-column label="用户名"><template scope='scope'>{{ scope.row.userName }}</template></el-table-column>
                <el-table-column label="别名"><template scope='scope'>{{scope.row.aliasName}}</template></el-table-column>  
                <el-table-column label="微信昵称"><template scope='scope'>{{scope.row.nickName}}</template></el-table-column>  
                <el-table-column label="手机号"> <template scope="scope">{{scope.row.phoneNumber}}</template></el-table-column>                                                                  
                <el-table-column label="性别"> <template scope="scope">{{bindsex(scope.row.sex)}}</template></el-table-column>                                                                  
            </el-table>
            </el-checkbox-group>
        </template>
        <div style="margin-bottom: 40px">
            <el-pagination
                @current-change="handleCurrentChange"
                :current-page="currentPage" :page-size = 'pagesize' ayout="total, prev, pager, next" :total = 'totalpage'></el-pagination>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            wxIds:[],
            searchweixin: null,
            loading: false,
            pagesize: 100,
            totalpage: 0,
            currentPage: 0,
            friendslist:[],
            weixinId: 0,
            checkall: false
        }
    },
    methods:{
        bindsex: function(val) {
            if(val == 1){
                return '男';
            }
            else{
                return '女'
            }
        },
        getlist: function(val) {
            var self=this;
            var offval = (val-1)*self.pagesize;
            this.axios.post('/weixin/get_weixin_friends',{
                weixinId: self.weixinId,
                offset: offval,
                num: self.pagesize
            })
            .then(function(res){
                var data = res.data;
                self.loading = false;
                if(data.code == 0){
                    self.friendslist = data.data.list;
                    self.totalpage = data.data.count;
                }
            })
            .catch(function(err){
                console.log(err);
                self.loading = true;
            })
        },
        handleCurrentChange: function (val){
            var self = this;
            this.getlist(val);
        },
        checkAll: function () {//全选
            if (!this.checkall) {
                this.wxIds = [];   
                this.friendslist.forEach((item) => {
                this.wxIds.push(item.userName);
                });
                this.checkall = true;
            }
            else{
                this.wxIds = [];
                this.checkall = false;
            }
        },
        onSubmit: function() {
            var self = this;
            var weixintaskid = Number.parseInt(this.$route.query.taskids)
            this.axios.post('/weixin/create_selected_friends_task',{
                weixinId: self.weixinId,
                weixinTaskId: weixintaskid,
                friends: this.wxIds
            })
            .then(function(res){
                var data = res.data;
                if(data.code == 0){
                    self.$message("创建成功");
                }
                else {
                    self.$message("创建失败");
                }
            })
            .catch(function(err){
                console.log(err);
                self.$message("创建失败");
            })
        }  
    },
    created(){
       this.weixinId = Number.parseInt(this.$route.query.id);
       this.getlist(1);
    }
}
</script>

<style>
  .admin-friendslist{width: 100%; padding: 20px}

  input[type="checkbox"]
{
    width:20px;
    height:20px;
}
</style>