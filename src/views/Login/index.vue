<template>
  <div class="login">
    <!-- 登录的 表单 -->
    <div class="center">
      <div class="photo">
        <el-avatar
          :size="100"
          src="https://upload.jianshu.io/users/upload_avatars/24098948/293b606e-14e2-4cd5-bb6f-397dd0710572.jpg?imageMogr2/auto-orient/strip|imageView2/1/w/240/h/240"
        ></el-avatar>
      </div>
      <!-- 表单主体部分 -->
      <el-form
        :model="formData"
        :rules="loginFormRules"
        ref="formRef"
        status-icon
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input
            v-model="formData.username"
            placeholder="用户名"
            class="user"
            prefix-icon="el-icon-user"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="formData.password"
            placeholder="密码"
            class="pwd"
            prefix-icon="el-icon-setting"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" icon="el-icon-thumb" class="loginBtn" @click="login" plain>登录</el-button>
          <el-button type="info" icon="el-icon-refresh" @click="reset" plain>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 底部视图 -->
    <!-- <LoginFoot></LoginFoot> -->
  </div>
</template>

<script>
//引入自己的底部
import LoginFoot from "./components/LoginFooter";

//解析api接口登录函数
import { getLogin } from "@api";

//引入message消息提醒
import { Message } from "element-ui";

export default {
  data() {
    return {
      //登录表单的数据
      formData: {
        username: "",
        password: "",
      },
      //表单验证规则
      loginFormRules: {
        //验证用户名
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        //验证密码
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    login() {
      //发送ajax之前也需要对表单的数据进行简单的验证，通过之后再发送ajax
      this.$refs.formRef.validate((valid) => {
        //valid是布尔值,验证结果
        if (!valid) {
          return;
        }
        //发送ajax请求验证
        // console.log(this.formData); //这里是表单的数据,需要作为参数传递给后台
        getLogin(this.formData).then((res) => {
          console.log(res.data);
          //定义登录的用户名
          let username = res.data.data.username;
          if (res.data.meta.status === 200) {
            //请求成功后执行,需要将后端返回的token保存起来
            Message({
              message: "登录成功",
              type: "success",
              duration: 1000,
            });
            this.$refs.formRef.resetFields();
            //保存后台返回的token，以便于访问页面，可以保存到sessionStorage中
            sessionStorage.setItem("token", res.data.data.token);
            this.$router.push({
              path: 'home',
              query: {
                username
              }
            })
          } else {
            Message({
              message: res.data.meta.msg,
              type: "warning",
              duration: 1000,
            });
            //清空表单
            this.$refs.formRef.resetFields();
          }
        });
      });
    },
    reset() {
      //表单内容重置,组件内有重置的函数定义resetFields，所以通过ref获取到表单实例
      this.$refs.formRef.resetFields();
    },
  },
  components: {
    LoginFoot,
  },
};
</script>

<style lang="scss" scoped>
.center {
  width: 480px;
  height: 300px;
  background: #ccc;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  padding: 60px 40px;
  box-sizing: border-box;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  .photo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    position: absolute;
    left: 190px;
    right: 0;
    top: -55px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4);
  }
  .user {
    width: 400px;
    margin-bottom: 20px;
  }
  .pwd {
    width: 400px;
    margin-bottom: 20px;
  }
}
</style>