<template>
  <div class="admin-userlist">
    <el-form ref="verifysetting" :model="task" label-width="80px">
     <el-form-item label="性别">
      <el-radio-group v-model="task.data.basicInfo.sex">
        <el-radio label="1">男</el-radio>
        <el-radio label="2">女</el-radio>
      </el-radio-group>
    </el-form-item>
     <el-form-item label="是否默认">
        <el-switch on-text="" off-text="" v-model="task.ifDefault"></el-switch>
      </el-form-item>
      <el-form-item label="省份">
        <el-input v-model="task.data.basicInfo.province"></el-input>
      </el-form-item>
       <el-form-item label="城市">
        <el-input v-model="task.data.basicInfo.city"></el-input>
      </el-form-item>
       <el-form-item label="签名">
        <el-input v-model="task.data.basicInfo.signature"></el-input>
      </el-form-item>
       <el-form-item label="昵称">
        <el-input v-model="task.data.basicInfo.nickname"></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <div id="container">
            <label for="img" class="el-button el-button--primary el-button--small">
              <i class="el-icon-upload"></i><span>点击上传图片</span>
            </label>
            <div><img :src="task.data.headImg.headUrl" alt="" width="100"></div>
            <input type="file" id="img" class="hide" />
          </div>
      </el-form-item>
      <el-form-item label="背景">
        <div id="container1">
            <label for="img1" class="el-button el-button--primary el-button--small">
              <i class="el-icon-upload"></i><span>点击上传图片</span>
            </label>
            <div><img :src="task.data.headImg.backgroundUrl" alt="" width="100"></div>
            <input type="file" id="img1" class="hide" />
          </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'addtask2',
  data() {
      return {
        task: {
          taskId: 4,
          ifDefault: false,
          data: {
            headImg: {
            headUrl: "",
            backgroundUrl: ""
          },
          basicInfo: {
            sex: '1',
            province: "",
            city: "",
            signature: "",
            nickname: ""
          }
          }
        },
        uptoken: ''
      };
    },
    methods: {
      uploadimg:function(){
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
        container: 'container', //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '5mb', //最大文件体积限制
        flash_swf_url: 'qiniu/Moxie.swf', //引入flash,相对路径
        max_retries: 3, //上传失败最大重试次数
        dragdrop: true, //开启可拖曳上传
        drop_element: 'container', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb', //分块上传时，每片的体积
        auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters: {
          mime_types: [
              {title : "Image files", extensions : "jpg,png"} // 限定flv后缀上传格式上传
          ]
        },
        multi_selection: false,
        init: {
          'UploadProgress': function(up, files) {
          },
          'FileUploaded': function(up, file, info) {
            var domain = up.getOption('domain');
            var res = JSON.parse(info);
            var urlImg = 'http://7xld1x.com1.z0.glb.clouddn.com/' + res.key;
            self.task.data.headImg.headUrl = urlImg            
          },
          'Error': function(up, err, errTip) {
                  //上传出错时，处理相关的事情
                  alert("上传出错，请刷新重新上传")
            }
        }
      });
    },
    uploadimg1:function(){
        var self = this;
        var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: 'img1', //上传选择的点选按钮，**必需**
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
        container: 'container1', //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '5mb', //最大文件体积限制
        flash_swf_url: 'qiniu/Moxie.swf', //引入flash,相对路径
        max_retries: 3, //上传失败最大重试次数
        dragdrop: true, //开启可拖曳上传
        drop_element: 'container1', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb', //分块上传时，每片的体积
        auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters: {
          mime_types: [
              {title : "Image files", extensions : "jpg,png"} // 限定flv后缀上传格式上传
          ]
        },
        multi_selection: false,
        init: {
          'UploadProgress': function(up, files) {
          },
          'FileUploaded': function(up, file, info) {
            var domain = up.getOption('domain');
            var res = JSON.parse(info);
            var urlImg = 'http://7xld1x.com1.z0.glb.clouddn.com/' + res.key;

            self.task.data.headImg.backgroundUrl = urlImg
          },
          'Error': function(up, err, errTip) {
                  //上传出错时，处理相关的事情
                  alert("上传出错，请刷新重新上传")
            }
        }
      });
    },
    getuptoken:function(){
        var self = this;
        this.axios.get('http://tym.taoyumin.cn/index.php?r=search/token').then((response) => {
          var data = JSON.parse(response.data)        
          if(data.state == 1000){
            self.uptoken = data.data
            self.uploadimg() 
            self.uploadimg1()                         
          }
        }, (response) => {
          // error callback
        });
      },
      onSubmit: function () {
        var self = this
        this.task.data.basicInfo.sex = Number.parseInt(this.task.data.basicInfo.sex)
        this.axios.post('/weixin/create_task', this.task)
          .then(function(res){
              var data = res.data
              console.log(data)    
              if(data.code == 0){
                self.$message("创建成功")
                self.$router.push("/tasklist")
              } 
              else{
                self.$message("创建失败")                
              }   
          })
          .catch(function(err){
              console.log(err);
              self.$message("创建失败")                              
          })
      }
    },
    created: function () {
      this.getuptoken()
    }
}
</script>

<style>
  .admin-userlist{width: 100%;padding: 20px}
  .hide{display: none}
</style>
