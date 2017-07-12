<template>
  <div class="admin-login">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="user">
          <el-input type="text" v-model="ruleForm.user"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="ruleForm.pass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
      return {
        ruleForm: {
          user: '',
          pass: ''
        },
        RealtechLoginSearch:{
          username: '',
          password: ''
        },
        rules: {
          user: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          pass: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        var self = this
        self.RealtechLoginSearch.username = self.ruleForm.user;
        self.RealtechLoginSearch.password = self.ruleForm.pass;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            self.axios.post('http://wxmp.gatao.cn/realtech/login',{RealtechLoginSearch: self.RealtechLoginSearch})   // ,{withCredentials: true} 用于跨域请求  RealtechLoginSearch: {username:self.ruleForm.user, password: self.ruleForm.pass}}
              .then((response) => {
                var data = response.data;
                if(data.code == 0){
                  self.$router.push('/weixinlist?user=' + self.ruleForm.user);
                  console.log("success!");
                }
                console.log(data);
              }, (response) => {
                console.log(response);
              });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
</script>

<style>
  .admin-login{width: 400px;margin: auto;position:fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);}
</style>
