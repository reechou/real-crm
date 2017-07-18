<template>
  <div class="admin-userlist">
    <el-card class="box-card">
      <div class="text item">
        <router-link to="addtask1">通讯录好友群发</router-link>
      </div>
      <div class="text item">
        <router-link to="addtask2">发朋友圈</router-link>
      </div>
      <div class="text item">
        <router-link to="addtask3">关注公众号</router-link>
      </div>
      <div class="text item">
        <router-link to="addtask4">修改个人信息</router-link>
      </div>
      <div class="text item">
        <router-link to="addtask7">通讯录群群发</router-link>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'addtask',
  data() {
      return {}    
    },
    methods: {
      
    },
    created: function () {
    }
}
</script>

<style>
  .admin-userlist{width: 100%;padding: 20px}
  .hide{display: none}
  .text{padding: 10px}
  .text a{color: #666;text-decoration: none}
</style>
