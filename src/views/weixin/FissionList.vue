<template>
  <div class="fission">
    <div class="selectype" style="padding:10px">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-select v-model="lbTypenum" placeholder="请选择" @change="getliebianpool(lbTypenum)">
            <el-option
            v-for="item in lbType"
            :key="item.liebianType"
            :label="item.desc"
            :value="item.liebianType">
              <i class="el-icon-delete" @click="clickicon(item.id)"></i>&nbsp;&nbsp;<span style="width:80%">{{ item.desc }}</span>
            </el-option>
          </el-select>
        </el-col>
         <el-col :span="2">
          <el-button type="primary" @click="showaddliebian = !showaddliebian">创建分组</el-button>
        </el-col> 
        <el-col :span="3">
          <el-button type="primary" @click="goaddmember">添加裂变成员</el-button>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="confirm">批量删除</el-button>
        </el-col>
      </el-row>
    </div>

    <transition name="bounce">
      <div class="addtype" style="padding:20px" v-show="showaddliebian">
        <el-row :gutter="20">
          <el-col :span="3">
            <label>裂变类型:</label>
          </el-col>
          <el-col :span="6">
            <el-input type="text" v-model="newType"></el-input>
          </el-col>
          <el-col :span="3">
            <label>描述:</label>
          </el-col>
          <el-col :span="6">
            <el-input type="text" v-model="newDesc"></el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="addtype">确定</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="showaddliebian = !showaddliebian">取消</el-button>
          </el-col>
        </el-row>
      </div>
    </transition>

    <template>
      <el-checkbox-group v-model="wxIds">
        <input type="checkbox" @click="checkAll()" v-model="btcheckall">全选
        <p align="right">已选人数:{{ wxIds.length }}</p>
        <el-table :data="lieBianPool" style="width:200%;margin-bottom:80px" v-loading="loading" element-loading-text="拼命加载中">
          <el-table-column label="选择" width="80px">
            <template scope="scope">
               <input type="checkbox" :id="scope.row.id" :value="scope.$index" v-model="wxIds"></input>
            </template>
          </el-table-column>

          <el-table-column label="id" align="center">
            <template scope="scope">
              {{ scope.row.id }}
            </template>
          </el-table-column>

          <el-table-column label="微信号">
            <template scope="scope">
              {{ scope.row.wechat }}
            </template>
          </el-table-column>

          <el-table-column label="微信id">
            <template scope="scope">
              {{ scope.row.wxId }}
            </template>
          </el-table-column>

          <el-table-column label="呢称">
            <template scope="scope">
              {{ scope.row.nickName }}
            </template>
          </el-table-column>
          
        </el-table>
      </el-checkbox-group>
    </template>
    <div style="margin-bottom: 40px">
      <el-pagination 
      @size-change="handleSizeChange" 
      @current-change="handleCurrentChange" 
      :current-page="currentPage" 
      :page-size='pagesize' 
      ayout="total, prev, pager, next" 
      :total='totalpage'>
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'weixin_fission',
  data() {
    return {
      lbTypenum: null,
      lbType:[],
      wxIds:[],
      btcheckall:false,
      lieBianPool:[],
      alllist:[],
      pagesize:100,
      currentPage:1,
      totalpage:1,
      loading: false,
      showaddliebian:false,
      checkall:false,
      typeormember:1,
      newType: null,
      newDesc:'',
      liebianid:[]
    }
  },
  methods:{
    batchdelete:function(){
      var self = this;
      console.log(this.wxIds);
      if(this.wxIds == null){
        this.$message("请选择要删除的号");
        return false;
      }
      else{
          var selectme = [];
          for(var i in this.wxIds){
            selectme.push(this.alllist[this.wxIds[i]].liebianPool);
          }
          console.log(selectme);
          for(var i in selectme){
          this.liebianid.push(selectme[i].id);
        }
        console.log(this.liebianid);
        this.axios.post('/weixin/delete_lianbian_pool',this.liebianid)
        .then(function(res){
          var data = res.data;
          if(data.code == 0){
            self.$message("删除成功");
            self.getliebianpool(self.lbTypenum);
            // this.$router.push('/fissionlist');
          }
          else{
            self.$message("删除失败");
          }
        })
        .catch(function(err){
          console.log(err);
          self.$message("删除失败");
        })
      }
    },
    checkAll:function(){
      if(this.wxIds == null){
        if(!this.checkall){
          this.wxIds = [];
          this.lieBianPool.forEach((item) => {
            this.wxIds.push(item.id);
          });
          this.checkall = true;
        }
        else{
          this.wxIds = [];
          this.checkall = false;
        }
      }
       else{
           if(!this.checkall){
               this.lieBianPool.forEach((item) => {
                   this.wxIds.push(item.id);
               });
               this.checkall = true;
           }
           else{
               this.wxIds = [];
               this.checkall = false;
           }
       }
       console.log(this.wxIds);
    },
    addtype:function(){
      var self = this;
      this.axios.post('/weixin/create_liebian_type',{
        liebianType: Number.parseInt(this.newType),
        desc: this.newDesc
      })
      .then(function(res){
        var data = res.data;
        if(data.code == 0){
          self.$message("创建成功");
          self.getlianbianlist();
          self.showaddliebian = false;
          self.newDesc = '';
          self.newType = null;
        }
        else{
          self.$message("创建失败");
          self.newDesc = '';
          self.newType = null;
        }
      })
      .catch(function(err){
        self.$message("创建失败");
          self.newDesc = '';
          self.newType = null;
        console.log(err);
      })
    },
    clickicon:function(val){
      this.typeormember = 0;
      this.confirm(val);
    },
    getlianbianlist: function(){
      var self = this;
      this.axios.post('/weixin/get_liebian_type_list')
          .then(function (res) {
            var data = res.data;
            if(data.code == 0){
              self.lbType = data.data;
            }
          })
          .catch(function(err){
            console.log(err);
          })
    },
    getliebianpool: function(type){
      console.log(type);
      var self = this;
      this.axios.post('/weixin/get_lianbian_pool',{
        liebianType: Number.parseInt(type)
      })
      .then(function(res){
        var data = res.data;
        if(data.code == 0){
          self.alllist = data.data;
          self.totalpage = self.alllist.length;
          self.lieBianPool = [];
          var currentSize = self.currentPage * self.pagesize;
          if(currentSize > self.alllist.length){
            currentSize = self.alllist.length;
          }
          for(var i=(self.currentPage -1) * self.pagesize; i< currentSize; i++){
            self.lieBianPool.push(self.alllist[i].weixin);
          }
        }
      })
      .catch(function(err){
        console.log(err);
      })

    },
    handleSizeChange: function () {
      var self = this
      self.liebianPool = []
      var j = self.currentPage == Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : self.currentPage * self.pagesize
      for (var i = (self.currentPage - 1) * self.pagesize; i < j; i++) {
        self.liebianPool.push(self.alllist[i].weixin)
      }
    },
    handleCurrentChange: function (val) {
      var self = this
      this.btcheckall = false;
      this.checkall = false;
      self.liebianPool = []
      self.currentPage = val
      var j = val == Math.ceil(self.alllist.length / self.pagesize) ? self.alllist.length : val * self.pagesize
      for (var i = (val - 1) * self.pagesize; i < j; i++) {
        self.liebianPool.push(self.alllist[i].weixin)
      }
    },
    confirm: function(val){
      var self = this;
      this.$confirm("是否删除?",'提示',{
        bonfirmButtonText:'确定',
        cancelButtonText:'取消',
        type:'warning'
      }).then(() =>{
        if(this.typeormember == 0){
          this.typedelet(val);
          console.log(this.typeormember);
        }
        else{
          self.batchdelete();
        }
      }).catch(() =>{

      });
    },
    typedelet:function(val){
      var self = this;
      this.axios.post('/weixin/delete_liebian_type',{
        id:val
      })
      .then(function(res){
        var data = res.data;
        if(data.code == 0){
          self.$message("删除成功");
          self.getlianbianlist();
        }
        else{
          self.$message("删除失败");
        }
      })
      this.typeormember = 1;
    },
    goaddmember:function(){
      this.$router.push('/addfissionmember');
    }
  },
  created(){
    this.getlianbianlist();
  }
}
</script>

<style>
.fission{
  width: 100%;
  padding:20px
}
select{
  width:100%;
}
.el-icon-delete{
  background-color:  #eef1f6;
}
.el-icon-delete:hover{
  background-color:cyan;
}

  /*设置本地动画*/
 .bounce-enter-active {
  animation: bounce-in 2s;
}
.bounce-leave-active {
  animation: bounce-out 2s;
}
@keyframes bounce-in{
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes bounce-out{
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(0);
  }
} 
</style>