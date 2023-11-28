<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 头像 -->
          <img :src="avatar" class="user-avatar" v-if="avatar">
          <span v-else class="avatar-name">{{ name?.charAt(0) }}</span>
          <!-- 用户名 -->
          <span class="user-name">{{ name }}</span>
          <!-- 系统设置图标 -->
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <!--NOTE  a标签默认行为会跳转页面，所以用.prevent修饰符来阻止标签默认事件 -->
          <a target="_blank" @click.prevent="updatePassword">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          
          <!-- NOTE  el-dropdown-item组件没有click事件，native修饰符表示给组件的根元素注册原生事件️-->
          <el-dropdown-item  @click.native="logout"> 
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="修改密码" :visible.sync="showDialog" width="500px" @close="btnCancel">
      <!-- 监听弹窗的close事件，关闭弹窗同时清除校验结果，为了更好的用户体验 -->
      <!--NOTE label-width设置标签文本的宽度，子元素form-item会继承该值 -->
      <el-form label-width="120px" :model="passForm" :rules="rules" ref="passForm">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input size="small" show-password  v-model="passForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input size="small" show-password v-model="passForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="confirmPassword">
          <el-input size="small" show-password v-model="passForm.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"  size="small" @click="btnOK">确认修改</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/user'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      "name"
    ])
  },
  data()
  {
    return{
      showDialog:false,//控制dialog框的显示
      passForm:{
        oldPassword:"",
        newPassword:"",
        confirmPassword:""
      },
      //修改密码表单校验规则
      rules:{
        oldPassword:[
          {required:true,message:"旧密码不能为空",trigger:"blur"},
        ],
        newPassword:[
        {required:true,message:"新密码不能为空",trigger:"blur"},
        {min:6,max:16,trigger:"blur",message:"密码长度应该为6-16位之间"}
        ],
        confirmPassword:[
        {required:true,message:"重复密码不能为空",trigger:"blur"},
        //重复密码通过自定义校验规则来校验是否与新密码一致
        {
          trigger:"blur",
          validator:(rule,value,callback)=>{
            //官方文档是箭头函数，this是指向组件vue组件实例
            if(value===this.passForm.newPassword)
            {
              callback()
            }
            else
            {
              //密码不一致，告知错误信息
              callback(new Error("重复密码与新密码不一致"))
            }
          }
        }
        ]
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      //调用退出登录action
      this.$store.dispatch("user/logOut").then(()=>{
        //退出登录action返回的是Promise，执行完dispatch，再跳转到登录界面
        this.$router.push("/login");
      })
    },
    updatePassword()
    {
      //显示dialog框
      this.showDialog=true;
    },
    btnOK()
    {
      console.log("this",this.$message);
      this.$refs.passForm.validate((isOK,obj)=>{
        console.log("修改密码表单校验完成后，调用此回调函数,isok:",isOK,obj);
        //校验成功
        if(isOK)
        {
          //调用修改密码接口
          updatePassword(this.passForm).then((data)=>{
          // 响应完接口后，提示并重置表单
          console.log("修改密码接口返回什么东西?",data);
          //修改密码成功提示
          this.$message({message:"修改密码成功",type:"success"})
          this.btnCancel()
          })
          
        }
      })
    },
    btnCancel()
    {
      //重置表单
      this.$refs.passForm.resetFields();
      //关闭dialog框
      this.showDialog=false;
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .avatar-name
        {
          width: 30px;
          height: 30px;
          text-align: center;
          line-height: 30px;
          border-radius: 50%;
          background: #04c9be;
          color: #fff;
          margin-right: 4px;
        }
        .user-name
        {
          margin-right: 10px;
          font-size: 16px;
        }
        .el-icon-setting
        {
          font-size: 20px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
