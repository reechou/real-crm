<template>
    <div class="admin-userlist">
    <el-form ref="verifysetting" label-width="80px" >
      <el-form-item label="资源类型">
        <el-select v-model="typeNum" placeholder="请选择" >
            <el-option
            v-for="item in resType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="微信号">
           <el-input type="text" v-model="wechat"></el-input>
      </el-form-item>

      <el-form-item label="资源名称">
           <el-input type="text" v-model="nickname"></el-input>
      </el-form-item>

      <el-form-item label="图片">
        <!-- <template v-for="(item, key) in picUrl"> -->
          <div id="containerimg">
            <label  class="el-button el-button--primary el-button--small">
              <i class="el-icon-upload"></i>
              <span>点击上传图片</span>
            <input type="file" id="img" class="hide" />              
            </label>
            <div>
              <img :src="mypic" alt="" width="100">
            </div>

          </div>
        <!--</template>-->
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="addrescource">立即创建</el-button>
        <el-button type="primary" @click="goback">返回</el-button>
      </el-form-item>
    </el-form>
    </div>
</template>

<script>
export default {
    data(){
        return {
            typeNum: 1,
            resType:[{
                label: '公众号', value: 1
            },{
                label: '群', value:　2
            }],
            nickname: '',
            mypic: '',
            uptoken:'',
            wechat: ''
        }
    },
    methods:{
        goback:function(){
            this.$router.push('/resourcepool');
        },
        addrescource:function (){
            var self = this;
            if(this.nickname == '' || this.mypic == ''){
                this.$message("请填写完整信息");
                return false;
            }
            else{
                this.axios.post('/weixin/create_resource',{
                    wxType: Number.parseInt(this.typeNum),
                    nickName: this.nickname,
                    qrcodeUrl: this.mypic,
                    wechat: this.wechat
                })
                .then(function(res){
                  var data = res.data;
                  if(data.code == 0){
                    self.$message("创建成功");
                    self.goback();
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
        }
    },
    created(){
        this.getuptoken();
    }
}
</script>

<style>
  
</style>
