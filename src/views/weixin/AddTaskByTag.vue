<template>
    <div class="admin-friendslist">
        <div style="width:80%; padding: 10px">
            <label>选择好友id：{{ slz }}</label>
            <el-button type="primary"  @click="onSubmit">提交</el-button>
        </div>
        <template>
            <el-checkbox-group v-model="slz">
                <el-table :data="alltaglist" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">
                    <el-table-column label="id">
                        <template scope="scope">
                            <el-checkbox :label="scope.row.id"></el-checkbox>
                        </template>
                    </el-table-column>
                    <el-table-column label="标签类型">
                        <template scope='scope'>{{ scope.row.tagType }}</template>
                    </el-table-column>
                    <el-table-column label="别名">
                        <template scope='scope'>{{scope.row.groupName}}</template>
                    </el-table-column>
                </el-table>
            </el-checkbox-group>
        </template>
    </div>
</template>

<script>
export default {
    data() {
        return {
            alltaglist: [],
            tagls: null,
            loading: false,
            slz: [],
            weixinId: null
        }
    },
    methods: {
        gettaglist: function () {
            var self = this;
            this.axios.get('/weixin/get_weixin_friends_tags')
                .then(function (res) {
                    var data = res.data;
                    if (data.code == 0) {
                        self.alltaglist = data.data;
                        console.log(self.alltaglist);
                    }
                })
        },
        onSubmit: function () {
            var self = this;
            var weixintaskid = Number.parseInt(this.$route.query.taskids)
            var tagid = Number.parseInt(this.slz)
            this.axios.post('/weixin/create_selected_friends_task', {
                weixinId: this.weixinId,
                weixinTaskId: weixintaskid,
                tagId: tagid
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
        }
    },
    created() {
        this.weixinId = Number.parseInt(this.$route.query.id);
        this.gettaglist();
    }
}
</script>

<style>
.admin-taglist {
    width: 100%;
    padding: 20
}
</style>