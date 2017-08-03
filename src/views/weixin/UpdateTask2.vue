<template>
  <div class="admin-userlist">
    <div class="contrue-button">
      <el-row :gutter="100">
        <el-col :span="2">
          <el-button type="primary"  :disabled="!linkorpic">文字+图片</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" :disabled="linkorpic" >文字+链接</el-button>    <!--@click="islinkorpic(1)" v-bind:style="{background:backcolor1}"-->
        </el-col>
      </el-row>
    </div>
    <el-form ref="verifysetting" :model="task" label-width="80px" v-show="linkorpic">
      <el-form-item label="是否默认">
        <el-switch on-text="" off-text="" v-model="task.ifDefault"></el-switch>
      </el-form-item>
      <el-form-item label="文字">
        <el-input v-model="task.data.text" type="textarea" :rows="3"></el-input>
      </el-form-item>
      <!-- <el-form-item label="类型">
        <el-radio-group v-model="task.data.type">
          <el-radio label="img">图片</el-radio>
          <el-radio label="video">视频</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="图片" v-if="task.data.type == 'img'">
        <template v-for="(item, key) in media">
  
          <div :id="'containerimg'+key">
            <label :for="'img'+key" class="el-button el-button--primary el-button--small">
              <i class="el-icon-upload"></i>
              <span>点击上传图片</span>
            </label>
            <div>
              <img :src="item.value" alt="" width="100">
            </div>
            <input type="file" :id="'img'+key" class="hide" />
          </div>
        </template>
      </el-form-item>
      <!-- <el-form-item label="视频" v-if="task.data.type == 'video'">
        <template v-for="(item, key) in media1">
  
          <div :id="'containervideo'+key">
            <label :for="'video'+key" class="el-button el-button--primary el-button--small">
              <i class="el-icon-upload"></i>
              <span>点击上传视频</span>
            </label>
            <div>{{item.value}}</div>
            <input type="file" :id="'video'+key" class="hide" />
          </div>
        </template>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="addimg">新增图片</el-button>
        <!-- <el-button @click="addvideo">新增视频</el-button> -->
      </el-form-item>
    </el-form>

    <el-form ref="verifysetting" :model="task2" label-width="80px" v-show="!linkorpic">
      <el-form-item label="是否默认">
        <el-switch on-text="" off-text="" v-model="task2.ifDefault"></el-switch>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="task2.data.title" type="textarea" :rows="2"></el-input>
      </el-form-item>

      <el-form-item label="文字">
        <el-input v-model="task2.data.text" type="textarea" :rows="3"></el-input>
      </el-form-item>

      <!-- <div class="" v-for="item in linkUrl"> -->
        <el-form-item label="链接">
            <el-input v-model="task2.data.linkUrl" type="textarea" ></el-input>
        </el-form-item>
      <!-- </div> -->

      <el-form-item label="图片" v-if="task2.data.type == 'link'">
        <!-- <template v-for="(item, key) in picUrl"> -->
          <div id="containerimgs">
            <label  class="el-button el-button--primary el-button--small">
              <i class="el-icon-upload"></i>
              <span>点击上传图片</span>
            <input type="file" id="imgs" class="hide" />              
            </label>
            <div>
              <img :src="task2.data.picUrl" alt="" width="100">
            </div>

          </div>
        <!--</template>-->
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <!-- <el-button @click="addpic">新增图片</el-button> -->
        <!-- <el-button @click="addlink">新增链接</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'updatetask2',
  data() {
    return {
      task: {
        taskId: 2,
        ifDefault: false,
        data: {
          text: '',
          media: [],
          type: 'img'
        }
      },
      task2:{
        taskId:2,
        ifDefault: false,
        data:{
          linkUrl:'',
          picUrl:'',
          title:'',
          text:'',
          type:'link'
        }
      },
      backcolor1:'#20a0ff',
      backcolor0:'#005494',
      media: [{ value: '' }],
      media1: [{ value: '' }],
      linkorpic:true,
      uptoken:''
    };
  },
  methods: {
    // islinkorpic:function(val){
    //   if((val == 0 && this.linkorpic) || (val == 1 && !this.linkorpic)){
    //     return false;
    //   }
    //   else{
    //     this.linkorpic = !this.linkorpic;
    //     this.getuptoken();
    //   }

    //   if(this.linkorpic){
    //     this.backcolor0 = '#005494';
    //     this.backcolor1 = '#20a0ff';
    //   }
    //   else{
    //     this.backcolor0 = '#20a0ff';
    //     this.backcolor1 = '#005494';
    //   }
    // },
    addimg: function () {
      var self = this
      this.media1 = []
      this.media.push({ value: '' })
      this.$nextTick(function () {
        setTimeout(function () {
          self.getuptoken(self.linkorpic);
        }, 500)
      })
    },
    // addpic: function () {
    //   var self = this
    //   this.picUrl.push({ value: '' })
    //   this.$nextTick(function () {
    //     setTimeout(function () {
    //       self.getuptoken()
    //     }, 500)
    //   })
    // },
    // addlink: function () {
    //   this.linkUrl.push({ value: '' })
    // },
    uploadimg: function (val) {
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
            console.log(self.linkorpic);
              self.media[val].value = urlImg;
            
          },
          'Error': function (up, err, errTip) {
            //上传出错时，处理相关的事情
            alert("上传出错，请刷新重新上传")
          }
        }
      });
    },
    uploadimg2: function () {
      var self = this;
      var uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4', //上传模式,依次退化
        browse_button: 'imgs', //上传选择的点选按钮，**必需**
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
        container: 'containerimgs', //上传区域DOM ID，默认是browser_button的父元素，
        max_file_size: '5mb', //最大文件体积限制
        flash_swf_url: 'qiniu/Moxie.swf', //引入flash,相对路径
        max_retries: 3, //上传失败最大重试次数
        dragdrop: true, //开启可拖曳上传
        drop_element: 'containerimgs', //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
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
              self.task2.data.picUrl = urlImg;
          },
          'Error': function (up, err, errTip) {
            //上传出错时，处理相关的事情
            alert("上传出错，请刷新重新上传")
          }
        }
      });
    },
    getuptoken: function (islinkorimg) {
      var self = this;
      this.axios.get('http://wxmp.gatao.cn/mypic/gettoken').then((response) => {
        var data = response.data;
        // if(data.code == 0){
        this.uptoken = data.token;
        if(islinkorimg){
          for (var i in self.media) {
            self.uploadimg(i);
          }
        }
        else{
            self.uploadimg2();
        }
        // }
      }, (response) => {
        // error callback
      });
    },
    onSubmit: function () {
      var self = this
      if (this.linkorpic) {
        this.task.data.media = [];     // 初始化，将页面一开始显示的数据先清除
        for (var i in this.media) {
          this.task.data.media.push(this.media[i].value)
        }
        console.log(this.task.data.media);
        this.task.ifDefault = this.task.ifDefault ? 1 : 0;
        this.task.data = JSON.stringify(this.task.data);
        console.log(this.task);
        this.axios.post('/weixin/update_task', this.task)
          .then(function (res) {
            var data = res.data
            console.log(data)
            if (data.code == 0) {
              self.$message("更新成功")
              self.$router.push("/tasklist")
            }
            else {
              self.$message("更新失败")
            }
          })
          .catch(function (err) {
            console.log(err);
            self.$message("更新失败")
          })
        }
        else{
          this.task2.ifDefault = this.task2.ifDefault ? 1 : 0;
          this.task2.data = JSON.stringify(this.task2.data);
          console.log(this.task2);
        this.axios.post('/weixin/update_task', this.task2)
          .then(function (res) {
            var data = res.data
            console.log(data)
            if (data.code == 0) {
              self.$message("更新成功")
              self.$router.push("/tasklist")
            }
            else {
              self.$message("更新失败")
            }
          })
          .catch(function (err) {
            console.log(err);
            self.$message("更新失败")
          })
        }
    },
    getupdateset: function () {
      var self = this
      this.axios.post('/weixin/get_task_from_id', { id: this.id })
        .then(function (res) {
          var data = res.data
          console.log(data)
          if (data.code == 0) {
            data.data.data = JSON.parse(data.data.data)
            self.task = _.assign(self.task, data.data)
            self.task.ifDefault = self.task.ifDefault == 1 ? true : false
            self.media = []
            console.log(data.data.data.type);
           if (data.data.data.type === 'img') {
            self.linkorpic = true;
            for (var i in data.data.data.media) {
                self.media.push({ value: data.data.data.media[i] });
              }
            }
            else{
              self.linkorpic = false;
              self.task2 = _.assign(self.task2,data.data);
              console.log(self.task2);
            }
            console.log(self.linkorpic);
            self.getuptoken(self.linkorpic);        // 这里的linkorpic 实在创建的同时赋值的 所以没有办法通过全局的方式将值赋给getuptaken方法 
          }
        })
        .catch(function (err) {
          console.log(err);
        })
    }
  },
  created() {
    this.id = Number.parseInt(this.$route.query.id);
    this.task.id = Number.parseInt(this.$route.query.id);
    this.getupdateset();

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
