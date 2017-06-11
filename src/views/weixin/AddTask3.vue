<template>
  <div class="admin-userlist">
    <el-form ref="verifysetting" :model="task" label-width="80px">
     <el-form-item label="是否默认">
        <el-switch on-text="" off-text="" v-model="task.IfDefault"></el-switch>
      </el-form-item>
      <el-form-item label="时间间隔">
        <el-input v-model="task.data.interval"></el-input>
      </el-form-item>
        <div class="" v-for="(item, key) in cards">
            <el-form-item label="名片">
              <el-input v-model="item.value"></el-input>
            </el-form-item> 
        </div>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button @click="addtext">新增名片</el-button>
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
          taskId: 3,
          IfDefault: false,
          data: {
            interval: 3,
            cards: [],
          }
        },
        cards: [{value: ''}],
      };
    },
    methods: {
      addtext: function (){
        this.cards.push({value: ''})
      },
      onSubmit: function () {
        var self = this
        for(var i in this.cards){
          this.task.data.cards.push(this.cards[i].value)
        }
        this.task.IfDefault = this.task.IfDefault? 1: 0
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
    }
}
</script>

<style>
  .admin-userlist{width: 100%;padding: 20px}
  .hide{display: none}
</style>
