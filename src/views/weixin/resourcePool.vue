<template>
  <div class="resource">
      <div class="dosome" style="padding:10px;margin-bottom:20px;">
        <el-select v-model="typeNum" placeholder="请选择" @change="getlist">
            <el-option
            v-for="item in resType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        <el-button type="primary" @click="addrescource">添加资源</el-button>
      </div>

      <template>
          <el-table :data="resourcelist" style="width: 100%;margin-bottom: 80px" v-loading="loading" element-loading-text="拼命加载中">

            <el-table-column label="id">
              <template scope="scope">
                {{ scope.row.id }}
              </template>
            </el-table-column>

            <el-table-column label="类别">
              <template scope="scope">
                <span v-show="scope.row.wxType == 1">公众号</span>
                <span v-show="scope.row.wxType != 1">群</span>
              </template>
            </el-table-column>

            <el-table-column label="资源名称">
              <template scope="scope">
                {{ scope.row.nickName }}
              </template>
            </el-table-column>

            <el-table-column label="二维码">
              <template scope="scope">
                {{ scope.row.qrcodeUrl }}
              </template>
            </el-table-column>

            <el-table-column label="操作">
              <template scope="scope">
                <el-button @click="confirm(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      <div style="margin-bottom: 40px">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size='pagesize' ayout="total, prev, pager, next" :total='totalpage'></el-pagination>
      </div>
  </div>
</template>

<script>
export default {
    data(){
        return{
            loading:false,
            typeNum:1,
            wxtype: 1,
            showadd:false,
            resType:[{
                label: '公众号', value: 1
            },{
                label: '群', value:　2
            }],
            nickname: '',
            mypic: '',
            uptoken:'',
            totalpage:1,
            pagesize:100,
            currentPage:1,
            alllist: [],
            resourcelist:[]
        }
    },
    methods:{
        addrescource:function (){
            this.$router.push('/addresource');
        },
        uploadimg2: function () {
        var self = this;
        var uploader = Qiniu.uploader({
            runtimes: 'html5,flash,html4', //上传模式,依次退化
            browse_button: 'img', //上传选择的点选按钮，**必需**
            uptoken: this.uptoken,
            //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
            // uptoken : '<Your upload token>',
            //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
            // unique_names: true,
            // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
            save_key: true,
            // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
            domain: 'http://7xld1x.com1.z0.glb.clouddn.com/',
            //bucket 域名，下载资源时用到，**必需**
            container: 'containerimg', //上传区域DOM ID，默认是browser_button的父元素，
            max_file_size: '5mb', //最大文件体积限制
            flash_swf_url: 'qiniu/Moxie.swf', //引入flash,相对路径
            max_retries: 3, //上传失败最大重试次数
            dragdrop: true, //开启可拖曳上传
            drop_element: 'containerimg', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
            chunk_size: '4mb', //分块上传时，每片的体积
            auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
            filters: {
            mime_types: [
                { title: "Image files", extensions: "jpg,png,x-icon,gif,jpeg" } // 限定flv后缀上传格式上传
            ]
            },
            multi_selection: false,
            init: {
            'UploadProgress': function (up, files) {
            },
            'FileUploaded': function (up, file, info) {
                var domain = up.getOption('domain');
                var res = JSON.parse(info);
                var urlImg = 'http://7xld1x.com1.z0.glb.clouddn.com/' + res.key;
                console.log(self.linkorpic);
                self.mypic = urlImg;
            },
            'Error': function (up, err, errTip) {
                //上传出错时，处理相关的事情
                alert("上传出错，请刷新重新上传")
            }
            }
        });
        },
        getuptoken: function () {
            var self = this;
            this.axios.get('http://wxmp.gatao.cn/mypic/gettoken').then((response) => {
                var data = response.data;
                self.uptoken = data.token;
                self.uploadimg2();
                console.log(self.uptoken);
            }, (response) => {
            });
        },
        getlist: function() {
            var self =this;
            this.axios.post('/weixin/get_resource_pool',{
                wxType: this.typeNum
            })
                .then(function(res){
                    var data = res.data;

                    if(data.code == 0){
                        self.alllist = data.data;
                        console.log(self.alllist);
                        self.totalpage = self.alllist.length;
                        console.log(self.totalpage);
                        self.resourcelist = [];
                        var currentSize = self.currentPage * self.pagesize;
                        if(currentSize > self.alllist.length){
                            currentSize = self.alllist.length;
                        }
                        for(var i =(self.currentPage - 1) * self.pagesize; i < currentSize; i++){
                            self.resourcelist.push(self.alllist[i]);
                            console.log(self.alllist[i]);
                        }
                        console.log(self.resourcelist);
                    }
                })
        },
        handleSizeChange: function () {
            var self = this
            self.resourcelist = []
            var j = self.currentPage == Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : self.currentPage * self.pagesize
            for (var i = (self.currentPage - 1) * self.pagesize; i < j; i++) {
                self.resourcelist.push(self.alllist[i])
            }
        },
        handleCurrentChange: function (val) {
            var self = this
            self.resourcelist = []
            self.currentPage = val
            var j = val == Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : val * self.pagesize
            for (var i = (val - 1) * self.pagesize; i < j; i++) {
                self.resourcelist.push(self.alllist[i])
            }
        },
        confirm(val){
            var self = this;
            this.$confirm('是否删除?','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                self.delet(val);
            }).catch(() => {

            });
        },
        delet:function(val) {
            var self = this;
            this.axios.post('/weixin/delete_weixin',{
                id: val
            })
            .then(function(res){
                var data = res.data;
                if(data.code == 0){
                    self.$message('删除成功');
                    self.getlist();
                }
                else{
                    self.$message("删除失败");
                }
            })
            .catch(function(err){
                console.log(err);
                self.$message("删除失败");
            })
        }
    },
    created(){
        this.getuptoken();
        this.getlist();
    }
}
</script>

<style>
  .resource{
  width: 100%;
  padding:20px
}
</style>
