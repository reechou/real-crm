<template>
  <div id="app" class="main">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  methods:{
      getCookie: function (name) {
        // alert(document.cookie);
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
 
        if(arr=document.cookie.match(reg))
 
          return unescape(arr[2]); 
        else 
          return null;
      },
      checklogin: function(){
        self =this;
        console.log(this.$route.path);
        var ca = this.getCookie('token');
        this.axios.get('http://wxmpx.gatao.cn/realtech/check_login?token='+ca)
            .then(function(res){
              var data = res.data;
              if(data.code == 0 )
              {
                if(self.$route.path == '/') {      // 判断当前页面是否是登录页面， 如果是， 就跳转到首页，否则在当前页面刷新
                  self.$router.push('/weixinlist?user=' +　data.msg.username);
                }
                else {
                  self.$router.push('');
                }
              }
              else
              {
                self.$router.push("/");
              }
            })
      }
  },
  created(){
    this.checklogin();
  }
}
</script>

<style>
*{padding: 0;margin: 0}
.main{height: 100%;position: relative}
</style>
