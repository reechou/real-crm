<template>
  <div class="admin-userlist">
    <el-form :model="task" label-width="80px">
      <el-form-item label="是否默认">
        <el-switch on-text="" off-text="" v-model="task.IfDefault"></el-switch>
      </el-form-item>
      <el-form-item label="时间间隔">
        <el-input v-model="task.data.interval"></el-input>
      </el-form-item>
  
      <div class="" v-for="item in textMsgs">
        <el-form-item label="文本消息">
          <el-input v-model="item.value" type="textarea" :rows="3"></el-input>
        </el-form-item>
      </div>
      <div class="" v-for="item in cardMsgs">
        <el-form-item label="名片消息">
          <el-input v-model="item.value"></el-input>
        </el-form-item>
      </div>
      <el-form-item label="图片消息">
        <div id="container">
          <label for="img" class="el-button el-button--primary el-button--small">
            <i class="el-icon-upload"></i>
            <span>点击上传图片</span>
          </label>
          <div>
            <img :src="task.data.picMsg" alt="" width="100">
          </div>
          <input type="file" id="img" class="hide" />
        </div>
      </el-form-item>
      <el-form-item label="链接消息" v-show="clickaddlink != 0">
        <template v-for="(item, key) in task.data.linkMsgs">
          <el-form-item label="标题">
            <el-input v-model="item.title"></el-input>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="item.desc"></el-input>
          </el-form-item>
          <el-form-item label="链接">
            <el-input v-model="item.linkUrl"></el-input>
          </el-form-item>
          <el-form-item label="图片">
            <div :id="'containerimg'+key">
              <label :for="'img'+key" class="el-button el-button--primary el-button--small">
                <i class="el-icon-upload"></i>
                <span>点击上传图片</span>
              </label>
              <div>
                <img :src="item.showPicUrl" alt="" width="100">
              </div>
              <input type="file" :id="'img'+key" class="hide" />
            </div>
          </el-form-item>
          <el-form-item label="资源文件链接">
            <el-input v-model="item.dataUrl"></el-input>
          </el-form-item>
          </template>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="addtext">新增文本</el-button>
        <el-button @click="addlink">新增链接消息</el-button>
        <el-button @click="addcard">新增名片</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'addtask1',
  data() {
    return {
      task: {
        taskId: 1,
        IfDefault: false,
        data: {
          interval: 3,
          textMsgs: [],
          cardMsgs: [],
          picMsg: '',
          linkMsgs: []
        }
      },
      clickaddlink:0,
      textMsgs: [{ value: '' }],
      cardMsgs: [{ value: '' }],
      dataUrl: [{ value: ''}],
    };
  },
  methods: {
    addtext: function () {
      this.textMsgs.push({ value: '' })
    },
    addlink: function () {
      var self = this
      this.clickaddlink = this.clickaddlink+1;
      this.task.data.linkMsgs.push({
        title: "",
        desc: "",
        linkUrl: "",
        showPicUrl: "",
        dataUrl:""
      })
      this.$nextTick(function () {
        setTimeout(function () {
          self.getuptoken()
        }, 500)
      })
    },
    addcard: function () {
      this.cardMsgs.push({ value: '' })
    },
    uploadimg: function () {
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
            self.task.data.picMsg = urlImg
            console.log(self.task.data)
          },
          'Error': function (up, err, errTip) {
            //上传出错时，处理相关的事情
            alert("上传出错，请刷新重新上传")
          }
        }
      });
    },
    uploadaudio: function (val) {
      var self = this;
      var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: 'img' + val, //上传选择的点选按钮，**必需**
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
        container: 'containerimg' + val, //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '5mb', //最大文件体积限制
        flash_swf_url: 'qiniu/Moxie.swf', //引入flash,相对路径
        max_retries: 3, //上传失败最大重试次数
        dragdrop: true, //开启可拖曳上传
        drop_element: 'containerimg' + val, //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
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
            self.task.data.linkMsgs[val].showPicUrl = urlImg
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
        // if (data.state == 1000) {
          self.uptoken = data.token;
          self.uploadimg()
          for (var i in self.task.data.linkMsgs) {
            self.uploadaudio(i)
          }
        // }
      }, (response) => {
        // error callback
      });
    },
    onSubmit: function () {
      var self = this
      // console.log(self.task.data)
     if (this.clickaddlink > 0 && this.task.data.linkMsgs[0].title != '' && this.task.data.linkMsgs[0].decs != '' && this.task.data.linkMsgs[0].linkUrl !='' && this.task.data.linkMsgs[0].showPicUrl != '') {
      for (var i in this.textMsgs) {
        this.task.data.textMsgs.push(this.textMsgs[i].value)
      }
      for (var i in this.cardMsgs) {
        this.task.data.cardMsgs.push(this.cardMsgs[i].value)
      }
      if (this.task.data.picMsg == "") {
        this.task.data = _.omit(this.task.data, 'picMsg')
      }

      if (this.task.data.cardMsgs == "") {
        this.task.data = _.omit(this.task.data, 'cardMsgs')
      }
      if (this.task.data.textMsgs == "") {
        this.task.data = _.omit(this.task.data, 'textMsgs')
      }
      this.task.IfDefault = this.task.IfDefault ? 1 : 0
      this.task.data.interval = Number.parseInt(this.task.data.interval);
      console.log(this.task);
      console.log('successs');
      this.axios.post('/weixin/create_task', this.task)
        .then(function (res) {
          var data = res.data
          console.log(data)
          if (data.code == 0) {
            self.$message("创建成功")
            self.$router.push("/tasklist")
          }
          else {
            self.$message("创建失败")
          }
        })
        .catch(function (err) {
          console.log(err);
          self.$message("创建失败")
        })
       }
       else if(this.clickaddlink == 0){
          for (var i in this.textMsgs) {
            this.task.data.textMsgs.push(this.textMsgs[i].value)
          }
          for (var i in this.cardMsgs) {
            this.task.data.cardMsgs.push(this.cardMsgs[i].value)
          }
          if (this.task.data.picMsg == "") {
            this.task.data = _.omit(this.task.data, 'picMsg')
          }

          if (this.task.data.cardMsgs == "") {
            this.task.data = _.omit(this.task.data, 'cardMsgs')
          }
          if (this.task.data.textMsgs == "") {
            this.task.data = _.omit(this.task.data, 'textMsgs')
          }
          this.task.IfDefault = this.task.IfDefault ? 1 : 0
          this.task.data.interval = Number.parseInt(this.task.data.interval);
          console.log(this.task);
          console.log('success');
          this.axios.post('/weixin/create_task', this.task)
            .then(function (res) {
              var data = res.data
              console.log(data)
              if (data.code == 0) {
                self.$message("创建成功")
                self.$router.push("/tasklist")
              }
              else {
                self.$message("创建失败")
              }
            })
            .catch(function (err) {
              console.log(err);
              self.$message("创建失败")
            })
       }
       else{
          this.$message("链接消息不能为空");
          return false;
       }
    }
  },
  created() {
    this.getuptoken()
  }
}
</script>

<style>
.admin-userlist {
  width: 100%;
  padding: 20px
}

.hide {
  display: none
}
</style>
