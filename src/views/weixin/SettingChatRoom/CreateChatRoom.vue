<template>
  <div class="create_CRS">
    <el-form ref="verifysetting" label-position="left" label-width="100px" :model="crsMsgs">
      <div class="title-Message">
        <label>进群欢迎消息:</label>
      </div>
      <div class="border_CRS">
        <el-form-item label="发送间隔">
            <el-row>
                <el-col :span="21">
                    <el-input v-model="crsMsgs.welcomeReplyLoopTime" style="width:40%;"></el-input>/秒
                </el-col>
                <el-col :span="3">              
                    <el-button type="primary" @click="addwelText">新增文本</el-button>
                </el-col>
            </el-row>
        </el-form-item>
        <div class="wel_CRS" v-for="(item, key) in crsMsgs.welcomeReply">
            <template v-if="item.msgType == 1">
            <el-form-item label="文本">
                <el-input v-model="item.content" type="textarea" :rows="3"></el-input>
            </el-form-item>
            </template>
        </div>
      </div>
      <div class="title-Message">
        <label>截图消息:</label>
      </div>
      <div class="border_CRS">
        <el-form-item label="发送间隔">
            <el-row>
                <el-col :span="21">
                    <el-input v-model="crsMsgs.screenshotReplyLoopTime" style="width:40%;"></el-input>/秒
                </el-col>
                <el-col :span="3">              
                    <el-button type="primary" @click="addscreenshotText">新增文本</el-button>
                </el-col>
            </el-row>
        </el-form-item>
        <div class="wel_CRS" v-for="(item, key) in crsMsgs.screenshotReply">
            <template v-if="item.msgType == 1">
            <el-form-item label="文本">
                <el-input v-model="item.content" type="textarea" :rows="3"></el-input>
            </el-form-item>
            </template>
        </div>
      </div>
      <div class="title-Message">
        <label>定时消息:</label>
      </div>
      <div class="border_CRS">
        <el-form-item label="发送间隔">
            <el-row>
                <el-col :span="21">
                    <el-input v-model="crsMsgs.sysLoopTime" style="width:40%;"></el-input>/秒
                </el-col>
                <el-col :span="3">              
                    <el-button type="primary" @click="addsysloopText">新增文本</el-button>
                </el-col>
            </el-row>
        </el-form-item>
        <div class="wel_CRS" v-for="(item, key) in crsMsgs.sysLoopReply">
            <template v-if="item.msgType == 1">
            <el-form-item label="文本">
                <el-input v-model="item.content" type="textarea" :rows="3"></el-input>
            </el-form-item>
            </template>
        </div>
      </div>
      <el-form-item label="发送间隔">
            <el-input v-model="crsMsgs.interval"></el-input>
      </el-form-item>
      <div class="title-Message">
         <label>满群设置:</label>
      </div>
      <div class="border_CRS">
         <el-form-item label="满群后时间设置">
            <el-input v-model="crsMsgs.chatroomFullSetting.chatroomSetTimeAfterFull" style="width:20%;"></el-input>/秒
         </el-form-item>
         <el-form-item label="成员数">
            <el-input v-model="crsMsgs.chatroomFullSetting.chatroomFullMemberNum" style="width:20%;"></el-input>
         </el-form-item>
         <el-form-item label="群公告">
            <el-input v-model="crsMsgs.chatroomFullSetting.chatroomNotice" type="textarea" :row="4"></el-input>
         </el-form-item>
         <el-form-item label="群主变更">
            <el-switch  v-model="ischangeOwner" @change="changeOwner"></el-switch>
               <el-input v-if="ischangeOwner" v-model="crsMsgs.chatroomFullSetting.chatroomChangeOwner" style="margin-left:10px;width:30%;" ></el-input>
         </el-form-item>
         <el-form-item label="群主邀请">
            <el-switch on-value="1" off-value="0" v-model="crsMsgs.chatroomFullSetting.ifAutoChangeAccess"></el-switch>
         </el-form-item>
         <el-form-item label="同步通讯录">
            <el-switch on-value="1" off-value="0" v-model="crsMsgs.chatroomFullSetting.ifAutoShowInContactBook"></el-switch>
         </el-form-item>
      </div>
      <el-form-item >
          <div style="text-align:center;">
          <el-button type="primary" @click="onsubmit">立即创建</el-button>
          <el-button @click="goback" style="margin-left:20px;">返回</el-button>
          </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
   data(){
       return{
           crsMsgs:{
               welcomeReply:[{        //进群欢迎信息
                   msgType: 1,
                   content: ''
               }],
               screenshotReply:[{    // 截图消息
                   msgType: 1,
                   content: ''
               }],
               sysLoopReply:[{       // 定时消息
                   msgType: 1,
                   content: ''
               }],
               interval: 3,         // 发送消息间隔
               welcomeReplyLoopTime: 300,            // 进群欢迎消息发送间隔
               screenshotReplyLoopTime: 300,        // 截图消息发送间隔
               sysLoopTime: 600,                    // 定时消息发送间隔
               chatroomFullSetting: {               // 群满设置
                  chatroomSetTimeAfterFull: 600,        // 满群后多少时间设置
                  chatroomFullMemberNum: 0,             // 群满成员个数
                  chatroomNotice: '',                   // 群公告设置
                  ifAutoChangeAccess: '0',                // 是否开启群主邀请
                  chatroomChangeOwner:'',               // 是否变更群主
                  ifAutoShowInContactBook: '0'            // 是否同步到通讯录
               }
           },
           ischangeOwner: false
       }
   },
   methods:{
       changeOwner: function () {
           console.log(111111);
           if(this.ischangeOwner == false) {
               this.crsMsgs.chatroomFullSetting.chatroomChangeOwner = '';
           } else {
               return false;
           }
       },
       addwelText: function () {                                               // 增加欢迎消息文本
           this.crsMsgs.welcomeReply.push({ msgType: 1, content: ''});
       },
       addscreenshotText: function () {                                        // 增加截图消息文本
           this.crsMsgs.screenshotReply.push({ msgType: 1, content: ''});
       },
       addsysloopText: function () {                                           // 增加定时消息文本
           this.crsMsgs.sysLoopReply.push({msgType:1, content: ''});
       },
       goback: function () {                                                   // 返回按钮
           this.$router.push('/CRSettinglist');
       },
       onsubmit: function () {                                                 // 提交按钮
           var self = this;
           if(
               this.crsMsgs.welcomeReply[0].content == '' && 
               this.crsMsgs.screenshotReply[0].content == '' &&
               this.crsMsgs.sysLoopReply[0].content == '' &&
               this.crsMsgs.chatroomFullSetting.chatroomNotice === ''
           ) {
               this.$message('请填入相关信息！');
           } else {
               this.crsMsgs.chatroomFullSetting.ifAutoChangeAccess = Number.parseInt(this.crsMsgs.chatroomFullSetting.ifAutoChangeAccess);
               this.crsMsgs.chatroomFullSetting.ifAutoShowInContactBook = Number.parseInt(this.crsMsgs.chatroomFullSetting.ifAutoShowInContactBook);
               this.crsMsgs.chatroomFullSetting.chatroomSetTimeAfterFull = Number.parseInt(this.crsMsgs.chatroomFullSetting.chatroomSetTimeAfterFull);
               this.crsMsgs.chatroomFullSetting.chatroomFullMemberNum = Number.parseInt(this.crsMsgs.chatroomFullSetting.chatroomFullMemberNum);
               this.crsMsgs.welcomeReplyLoopTime = Number.parseInt(this.crsMsgs.welcomeReplyLoopTime);
               this.crsMsgs.screenshotReplyLoopTime = Number.parseInt(this.crsMsgs.screenshotReplyLoopTime);
               this.crsMsgs.sysLoopTime = Number.parseInt(this.crsMsgs.sysLoopTime);
               this.crsMsgs.interval = Number.parseInt(this.crsMsgs.interval);

               this.axios.post('/weixin/create_chatroom_setting',this.crsMsgs)
                   .then(function (res){
                       var data =res.data;
                       if (data.code == 0) {
                           self.$message("创建成功");
                           self.$router.push('/CRSettinglist');
                       } else {
                           self.$message("创建失败");
                       }
                   })
                   .catch(function (err) {
                       console.log(err);
                       self.$message("创建失败");
                   })
           }
       }
   }
}
</script>

<style>
.create_CRS {       /* 当前页面整体样式 */ 
    width: 100%;
    padding: 20px;
}
.title-Message{      /* 标题样式 */ 
    margin-bottom: 10px;
}

.border_CRS{    /* 线框样式 */
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    border: 2px dashed #B4CDCD;
    margin-bottom: 20px;
}

.wel_CRS{
    margin-top: 20px;
}
</style>
