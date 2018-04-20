<template>
<div class="" style="width:100%;">
  <div class="uploadBtn">
    <div id="container">
      <label for="img" class="el-button el-button--primary el-button--small">
        <i class="el-icon-upload"></i><span>点击上传图片</span>
        <input type="file" id="img" multiple="true" class="hide" />
      </label>
    </div>
     <label class="el-button el-button--primary el-button--small submit" @click="onSubmit()">提交</label>
  </div>
  <div class="qrlist">
    <template  v-for="(item, index) in qrCodeList" style="width:100px;">
    <div style="width:100px;height:100px;position:relative;">
      <img id="qrpic" :src="item" alt="" with="100" height="100" />
      <img id="deletepic" src="../../assets/delete.png" width="20" height="20" @click="deleteqr(index)"/>
    </div>
    </template>
  </div>
</div>
</template>

<script>
  export default {
    name: 'updateTask9',
    data() {
      return {
        qrCodeList: [],
        task:{
          taskId: 9,
          data:{
            interval: 10,
            qrcodeUrls: [],
          }
        }
      }
    },
    methods: {
      deleteqr: function (e) {
        let self = this;
        self.qrCodeList.splice(e,1);

      },
      // 获取上传图片的token
      getuptoken: function () {
        let self = this;
        this.axios.get('http://wxmp.gatao.cn/mypic/gettoken').then((response) => {
          let data = response.data;
          this.uptoken = data.token;
          self.uploadimg();
        }, (response) => {
          console.log(response);
        });
      },
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
              {title : "Image files", extensions : "jpg,png,jpeg,svg"} // 限定flv后缀上传格式上传
          ]
        },
        multi_selection: true,
        init: {
          'UploadProgress': function(up, files) {
          },
          'FileUploaded': function(up, file, info) {
            var domain = up.getOption('domain');
            var res = JSON.parse(info);
            var urlImg = 'http://7xld1x.com1.z0.glb.clouddn.com/' + res.key;
            self.qrCodeList.push(urlImg);
            console.log(self.qrCodeList);
            // console.log(urlImg);
          },
          'Error': function(up, err, errTip) {
                  //上传出错时，处理相关的事情
                  alert("上传出错，请刷新重新上传")
            }
          }
        });
      },
      // 数据上传
      onSubmit: function () {
        let self = this;
        if(self.qrCodeList.length == 0){
          self.$message('请上传二维码');
          return false;
        }
        self.task.data.qrcodeUrls = self.qrCodeList;
        self.task.ifDefault = self.task.ifDefault ? 1 : 0;
        self.task.data = JSON.stringify(self.task.data);
        self.axios.post('weixin/update_task', this.task)
          .then(function (res) {
            var data = res.data;
            if(data.code == 0){
              self.$message('创建成功');
              self.$router.push("/tasklist");
            }else {
              self.$message("创建失败")
            }
          })
          .catch(function(err) {
            console.log(err);
            self.$message('创建失败')
          })
      },
      getupdateset: function () {
        var self = this
        self.axios.post('/weixin/get_task_from_id', { id: this.id })
          .then(function (res) {
            var data = res.data
            console.log(data)
            if (data.code == 0) {
              console.log(data.data);
              data.data.data = JSON.parse(data.data.data)
              self.task = _.assign(self.task, data.data)
              self.task.ifDefault = self.task.ifDefault == 1 ? true : false
              self.qrCodeList = data.data.data.qrcodeUrls;
              console.log(self.task);
            }
          })
          .catch(function (err) {
            console.log(err);
          })
      },
    },
    created: function () {
      this.id = Number.parseInt(this.$route.query.id);
      this.task.id = Number.parseInt(this.$route.query.id);
      this.getuptoken();
      this.getupdateset();
    }
  }
</script>
<style>
  .uploadBtn{
    height: 40px;
  }
  .qrlist{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  #qrpic{
    padding-right: 20px;
  }
  .uploadBtn{
    padding-bottom: 20px;
    border-bottom: 1px solid #c3c3c3;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  .submit{
    width: 100px;
    height: 28px;
  }
  #deletepic{
    position: absolute;
    top: 0px;
    right: 0px;
  }
</style>