<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avator_box">
        <img src="../assets/logo.png" />
      </div>

      <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import {message} from "element-ui"
export default {
  data(){
    return {
      loginForm:{
        username:"oliver",
        password:"szh432806"
      },
      loginFormRules:{
        username:[
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ],
        password : [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods : {
    reset(){
      this.$refs.loginFormRef.resetFields();
      this.loginForm.username=this.loginForm.password="";
    },
    login(){
      this.$refs.loginFormRef.validate( async valid=>{
        if(!valid)return;
        //发请求
        const {data : res}=await this.$http.post("api/AddStudent",this.loginForm);
        const result=JSON.parse(res);
        //if(result.Status=="no")return this.$message.error("登录失败")
        this.$message.success("登录成功！");
        window.sessionStorage.setItem("token","q123ewQ!@#EW");
        this.$router.push("/home");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 400px;
    height: 300px;
    border-radius: 3px;
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .avator_box {
    width: 130px;
    height: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    box-shadow: 0 0 10px #ddd;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width : 100%;
    padding : 20px;
    box-sizing: border-box;
    .btns{
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>