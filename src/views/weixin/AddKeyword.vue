<template>
  <div class="admin-userlist">
    <el-form ref="verifysetting" :model="keywords" label-width="80px">
      <div class="titlebyhuifu">
        <label>回复关键字判断:</label>
      </div>
      <div class="panduan">
      <el-form-item label="回复方式">
        <el-radio-group v-model="keywords.chatType">
          <el-radio label="group">群聊</el-radio>
          <el-radio label="people">个人</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="回复类型">
        <el-radio-group v-model="keywords.msgType">
          <el-radio label=1>文字</el-radio>
          <el-radio label=3>图片</el-radio>
          <el-radio label=42>名片</el-radio>
          <el-radio label=34>语音</el-radio>
        </el-radio-group>
      </el-form-item>
      <div v-show="keywords.msgType == 1">
      <el-form-item label="关键字">
        <el-input v-model="keywords.keyword"></el-input>
      </el-form-item>
      </div>
      </div>
      <div class="titlebyhuifu">
        <label>每条回复时间间隔:</label>
      </div>
      <div class="panduan">
      <el-form-item label="时间间隔" style="margin-top:20px;">
        <el-input v-model="keywords.interval"></el-input>
      </el-form-item>
      </div>
      <div class="titlebyhuifu">
        <label>回复内容:</label>
      </div>
      <div class="panduan">
      <div class="huifu" v-for="(item, key) in keywords.reply">
        <template v-if="item.msgType == 1">
          <el-form-item label="文本">
            <el-input v-model="item.content" type="textarea" :rows="3"></el-input>
          </el-form-item>
        </template>
        <template v-if="item.msgType == 42">
          <el-form-item label="名片">
            <el-input v-model="item.content"></el-input>
          </el-form-item>
        </template>
        <template v-if="item.msgType == 3">
          <el-form-item label="图片">
            <div :id="key">
              <label :for="key+'img'" class="el-button el-button--primary el-button--small">
                <i class="el-icon-upload"></i>
                <span>点击上传图片</span>
              </label>
              <div>
                <img :src="item.content" alt="" width="100">
              </div>
              <input type="file" :id="key + 'img'" class="hide" />
            </div>
          </el-form-item>
        </template>
        <template v-if="item.msgType == 34">
          <el-form-item label="语音">
            <div :id="key">
              <label :for="key+'audio'" class="el-button el-button--primary el-button--small">
                <i class="el-icon-upload"></i>
                <span>点击上传语音</span>
              </label>
              <div>
                <audio :src="item.content" controls :id="'content'+key">
                  您的浏览器不支持 audio 标签。
                </audio>
              </div>
              <input type="file" :id="key + 'audio'" class="hide" />
            </div>
          </el-form-item>
        </template>
      </div>
      </div>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="addtext">新增文本</el-button>
        <el-button @click="addpic">新增图片</el-button>
        <el-button @click="addaudio">新增语音</el-button>
        <el-button @click="addcard">新增名片</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'addkeyword',
  data() {
    return {
      keywords: {
        chatType: 'people',
        msgType: 0,
        interval: 3,
        reply: [{
          msgType: 1,
          content: '',
        }],
      },
      uptoken: ''
    };
  },
  methods: {
    addtext: function () {
      this.keywords.reply.push({ msgType: 1, content: '' })
    },
    addpic: function () {
      var self = this
      this.keywords.reply.push({ msgType: 3, content: '' })
      this.$nextTick(function () {
        setTimeout(function () {
          self.getuptoken()
        }, 500)
      })
    },
    addcard: function () {
      this.keywords.reply.push({ msgType: 42, content: '' })
    },
    addaudio: function () {
      var self = this
      this.keywords.reply.push({ msgType: 34, content: '' })
      this.$nextTick(function () {
        setTimeout(function () {
          self.getuptoken()
        }, 500)
      })
    },
    uploadimg: function (val) {
      var self = this;
      var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: val + 'img', //上传选择的点选按钮，**必需**
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
        container: val, //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '5mb', //最大文件体积限制
        flash_swf_url: 'qiniu/Moxie.swf', //引入flash,相对路径
        max_retries: 3, //上传失败最大重试次数
        dragdrop: true, //开启可拖曳上传
        drop_element: val, //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
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
            self.keywords.reply[val].content = urlImg
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
        browse_button: val + 'audio', //上传选择的点选按钮，**必需**
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
        container: val, //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '5mb', //最大文件体积限制
        flash_swf_url: 'qiniu/Moxie.swf', //引入flash,相对路径
        max_retries: 3, //上传失败最大重试次数
        dragdrop: true, //开启可拖曳上传
        drop_element: val, //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
        chunk_size: '4mb', //分块上传时，每片的体积
        auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
        filters: {
          mime_types: [
            { title: "Audio files", extensions: "flv,mpg,mpeg,avi,wmv,mov,asf,rm,rmvb,mkv,m4v,mp4,mp3" } // 限定flv后缀上传格式上传
          ]
        },
        multi_selection: false,
        init: {
          'UploadProgress': function (up, files) {
          },
          'FileUploaded': function (up, file, info) {
            var domain = up.getOption('domain');
            var res = JSON.parse(info);
            console.log(file)
            var urlImg = 'http://7xld1x.com1.z0.glb.clouddn.com/' + res.key;
            self.keywords.reply[val].content = urlImg
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
          for (var i in self.keywords.reply) {
            if (self.keywords.reply[i].msgType == 3) {
              self.uploadimg(i)
            }
            else if (self.keywords.reply[i].msgType == 34) {
              self.uploadaudio(i)
            }
          }
        // }
      }, (response) => {
        // error callback
      });
    },
    onSubmit: function () {
      var self = this
      this.keywords.msgType = Number.parseInt(this.keywords.msgType)
      this.keywords.interval = Number.parseInt(this.keywords.interval)
      if(this.keywords.msgType == 0){
        this.$message("选择回复判断方式");
      }
      else{
      for (var i in this.keywords.reply) {
        if (this.keywords.reply[i].msgType == 34) {
          this.keywords.reply[i].content = this.keywords.reply[i].content + "||" + document.getElementById("content" + i).duration
        }
      }
      console.log(this.keywords);
      this.axios.post('/weixin/create_keyword_setting', this.keywords)
        .then(function (res) {
          var data = res.data
          console.log(data)
          if (data.code == 0) {
            self.$message("创建成功")
            self.$router.push("/keywordlist")
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
    }
  },
  created: function () {
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
.panduan{
  border:2px dashed 	#B4CDCD;
  margin-bottom: 20px;
}
.huifu{
  margin-top: 20px;
}
.titlebyhuifu{
  margin-bottom:10px;
}
</style>
