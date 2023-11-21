<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card">
        <!--登录表单-->
       <el-form ref="form" :model="loginForm" :rules="loginRules" status-icon >
        <el-form-item prop="mobile">
          <el-input placeholder="请输入手机号码" v-model="loginForm.mobile"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input placeholder="请输入密码" v-model="loginForm.password" ></el-input>
        </el-form-item>

        <el-form-item prop="isAgree">
          <el-checkbox>用户平台使用协议</el-checkbox>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" style="width: 350px;" @click="login">登录</el-button>
        </el-form-item>

       </el-form>
      </el-card>
    </div>
  </div>  
</template>

<script>
export default {
  name : "Login",
  data(){
    return{
      loginForm:{
        mobile:"",
        password:"",
        isAgree:false
      },
      loginRules:{
        mobile:[
          {
            required:true,
            message:"请输入手机号",
            trigger:"blur"
          },
          {
            pattern:/^1[3-9]\d{9}$/,
            message:"手机号格式不正确",
            trigger:"blur"
          }
        ],
        password:[
          {
            required:true,
            message:"请输入密码",
            trigger:"blur"
          },
          {
            min:6,
            max:16,
            message:"密码长度应该为6-16位之间",
            trigger:"blur"
          }
        ],
        // required 只能检测到 null undefined "" 无法检测到bool值，所以只能用自定义校验
        isAgree:[
          {
            validator:(rule,value,callback)=>
            {
              //rule 校验规则
              //value 校验的值
              //callback  回调函数
              value ? callback() : callback(new Error('没有勾选用户平台协议'))
            }
            
          }
        ]
      }
    }
  },
  methods:{
    login()
    {
      // 通过this.$refs可以找到整个表单的组件
      this.$refs.form.validate((isOK,obj)=>{
        console.log("对整个表单校验结束后，会调用此回调函数",isOK,obj)
        if(isOK){alert("登录成功！")}
      })
    }
  }
}
</script>

<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png)
      no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center /
        contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }
    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }
  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;
    .el-card {
      border: none;
      padding: 0;
    }
    h1 {
      padding-left: 20px;
      font-size: 24px;
    }
    .el-input {
      width: 350px;
      height: 44px;
      .el-input__inner {
        background: #f4f5fb;
      }
    }
    .el-checkbox {
      color:#606266;
    }
  }
}
</style>
