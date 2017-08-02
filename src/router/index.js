import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: require('views/Login')
    },{
      path: '/main',
      component: require('components/Main'),
      children: [
        {
          path: '/weixinlist',
          component: require('views/weixin/WeixinList')
        },
        {
          path: '/weixinlist1',
          component: require('views/weixin/WeixinList1')
        },
        {
          path: '/settinglist',
          component: require('views/weixin/SettingList')
        },
        {
          path: '/setweixin',
          component: require('views/weixin/SetWeixin')
        },
        {
          path: '/keywordlist',
          component: require('views/weixin/KeywordList')
        },
        {
          path: '/tasklist',
          component: require('views/weixin/TaskList')
        },
        {
          path: '/settask',
          component: require('views/weixin/SetTask')
        },
        {
          path: '/addset',
          component: require('views/weixin/AddSet')
        },
        {
          path: '/addkeyword',
          component: require('views/weixin/AddKeyword')
        },
        {
          path: '/addtask',
          component: require('views/weixin/AddTask')
        },
        {
          path: '/querysetting',
          component: require('views/weixin/QuerySetting')
        },
        {
          path: '/addtask1',
          component: require('views/weixin/AddTask1')
        },
        {
          path: '/addtask2',
          component: require('views/weixin/AddTask2')
        },
        {
          path: '/addtask3',
          component: require('views/weixin/AddTask3')
        },
        {
          path: '/addtask4',
          component: require('views/weixin/AddTask4')
        },
        {
          path:'/addtask7',
          component: require('views/weixin/AddTask7')
        },
        {
          path: '/updatetask1',
          component: require('views/weixin/UpdateTask1')
        },
        {
          path: '/updatetask2',
          component: require('views/weixin/UpdateTask2')
        },
        {
          path: '/updatetask3',
          component: require('views/weixin/UpdateTask3')
        },
        {
          path: '/updatetask4',
          component: require('views/weixin/UpdateTask4')
        },
        {
          path: '/updatetask7',
          component: require('views/weixin/UpdateTask7')
        },
        {
          path: '/updateset',
          component: require('views/weixin/UpdateSet')
        },
        {
          path: '/updatekeyword',
          component: require('views/weixin/UpdateKeyword')
        },
        {
          path: '/friendslist',
          component: require('views/weixin/FriendsList')
        },
        {
          path: '/addtaskbyfriends',
          component: require('views/weixin/AddTaskByFriends')
        },
        {
          path: '/addtaskbytag',
          component: require('views/weixin/AddTaskByTag')
        },
        {
          path: '/weixinsettask',
          component: require('views/weixin/WeiXinSetTask')
        },
        {
          path: '/weixingroup',
          component: require('views/weixin/WeiXinGroup')
        },
        {
          path: '/fissionlist',
          component: require('views/weixin/FissionList')
        },
        {
          path: '/timinglist',
          component: require('views/weixin/TimingList')
        },
        {
          path: '/addgroupmember',
          component: require('views/weixin/AddGroupMember')
        },
        {
          path: '/addfissionmember',
          component: require('views/weixin/AddFissionmember')
        },
        {
          path: '/datastatistics',
          component: require('views/weixin/DataStatistics')
        }
      ]
    }
  ]
})
