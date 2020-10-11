<template>
  <div class="user">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容展示 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 搜索框 -->
        <el-input
          placeholder="请输入内容"
          v-model="queryInfo.query"
          class="search"
          clearable
          @clear="getUser"
        >
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
        <!-- 添加用户 -->
        <el-button type="success" @click="openDialog">添加用户</el-button>
      </div>
      <!-- table表格 -->
      <el-table :data="userList" stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <!-- 操作按钮模块 -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editUser(scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="delUser(scope.row.id)"
            ></el-button>
            <!-- 按钮轻提示 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1,2,5,10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加用户弹窗 -->
    <el-dialog title="添加用户" :visible.sync="dialogShow" width="50%">
      <!-- 添加用户弹窗的排版 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹窗底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户信息的弹窗 -->
    <el-dialog title="修改用户" :visible.sync="editDialog" width="50%" @close="editDialogClosed">
      <!-- 添加用户弹窗的排版 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 弹窗底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog @close='setRoleDialog' title="分配角色" :visible.sync="roleDialogShow" width="50%">
      <div>
        <p>当前的用户:{{ userInfo.username }}</p>
        <p>当前的角色:{{ userInfo.role_name }}</p>
        <p>
          分配的角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <!-- 弹窗底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="roleDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//解构出api里面的获取用户列表接口
import {
  getUserList,
  EditUserState,
  addUserInfo,
  editUserInfo,
  editUserSubmit,
  delUserInfo,
  getRole,
  allotRole
} from "@api";

import { Message, MessageBox } from "element-ui";

export default {
  data() {
    //验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      //这里进行正则的匹配
      if (regEmail.test(value)) {
        //合法的邮箱
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };

    //验证手机号的规则
    var checkTel = (rule, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

      if (regMobile.test(value)) {
        return cb();
      }

      cb(new Error("请输入合法的手机号"));
    };

    return {
      //添加用户的主体信息
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      //修改用户信息的主体信息
      editForm: {},
      //添加用户的规则验证
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkTel, trigger: "blur" },
        ],
      },

      //修改用户信息的规则验证
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkTel, trigger: "blur" },
        ],
      },
      //添加用户弹窗控制
      dialogShow: false,
      //编辑用户的弹窗控制
      editDialog: false,

      //用户列表的搜索框 query
      //请求用户列表的参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      //保存用户列表
      userList: [],
      total: 0,
      //分配角色的弹窗默认值
      roleDialogShow: false,
      //分配角色按钮这行的用户数据
      userInfo: {},
      //角色列表
      rolesList: [],
      //已选中的角色id
      selectedRoleId: ''
    };
  },
  created() {
    //获取用户列表
    this.getUser();
  },
  methods: {
    //打开添加用户界面
    openDialog() {
      this.dialogShow = true;
    },
    //添加用户界面添加事件
    //参数是表单的内容
    addUser() {
      //调用表单的验证
      this.$refs.addFormRef.validate((valid) => {
        // console.log(valid);
        if (!valid) return;
        //验证通过发送ajax
        addUserInfo(this.addForm).then((res) => {
          console.log(res);
          if (res.data.meta.status !== 201) {
            Message({
              message: "添加用户失败",
              type: "error",
              duration: 1000,
            });
          }
          Message({
            message: "添加用户成功",
            type: "success",
            duration: 1000,
          });
        });
        //先关闭弹窗，清空表单
        this.dialogShow = false;
        //发送ajax数据到后台添加用户
        this.$refs.addFormRef.resetFields();
        //重新获取用户列表
        this.getUserInfo();
      });
    },
    //修改用户信息
    editUser(id) {
      //该id通过作用域插槽的scope.row里面的值
      console.log(id);
      //先修改弹窗的状态
      this.editDialog = true;
      editUserInfo(id).then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          return Message({
            type: "error",
            message: "获取用户信息失败",
            duration: 1000,
          });
        }
        //这里将查询到的数据保存到私有data中的editForm
        this.editForm = res.data.data;
      });
    },

    //修改用户信息的提交操作
    editInfo() {
      //提交之前需要进行表单的验证
      this.$refs.editFormRef.validate((valid) => {
        // console.log(valid);
        if (!valid) return;
        //这里是通过验证的，发送修改请求,这里的用户id可以通过之前id请求回来的用户数据editForm中拿
        editUserSubmit(this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile,
        }).then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 200) {
            return Message({
              type: "error",
              message: "更新用户信息失败",
              duration: 1000,
            });
          }
          //提交成功之后关闭弹窗
          this.editDialog = false;
          //刷新数据列表
          this.getUser();
          Message({
            type: "success",
            message: "更新用户信息成功",
            duration: 1000,
          });
        });
      });
    },

    //监听修改用户信息的弹窗事件
    editDialogClosed() {
      //重置表单验证
      this.$refs.editFormRef.resetFields();
    },

    //删除用户按钮事件
    delUser(id) {
      console.log(id);
      //这里添加询问框提醒
      MessageBox.confirm("此操作将永久删除该用户, 是否继续?", "删除用户", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //这里面去执行确定发送删除操作
          delUserInfo(id).then((res) => {
            console.log(res);
            if (res.data.meta.status !== 200) {
              return Message({
                type: "error",
                message: "删除用户失败",
                duration: 1000,
              });
            }
            //删除成功之后的操作
            Message({
              type: "success",
              message: "删除用户成功",
              duration: 1000,
            });
            //刷新用户列表
            this.getUser();
          });
        })
        .catch(() => {
          //这里是取消删除的提示
          Message({
            type: "info",
            message: "取消删除",
            duration: 1000,
          });
        });
    },

    //添加用户界面的取消按钮重置表单
    resetForm() {
      //先关闭弹窗,清空表单
      this.dialogShow = false;
      this.$refs.addFormRef.resetFields();
    },

    //用户列表搜索功能
    searchUser() {
      this.getUser();
      //清空文本框
    },
    //切换switch开关
    changeState(state) {
      console.log(state, state.mg_state); //这是当前用户的状态
      EditUserState(state.id, state.mg_state).then((res) => {
        if (res.data.meta.status === 200) {
          Message({
            message: res.data.meta.msg,
            type: "success",
            duration: 1000,
          });
        } else {
          state.mg_state = !state.mg_state;
          Message({
            message: "更新用户状态失败",
            type: "warning",
            duration: 1000,
          });
        }
      });
    },
    //监听分页pagesize变化
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      //重新请求数据
      this.getUser();
    },
    //监听页码改变
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUser();
    },
    //获取用户列表
    getUser() {
      getUserList({ params: this.queryInfo }).then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          Message({
            message: res.data.meta.msg,
            type: "warning",
            duration: 1000,
          });
        }
        //将数据保存到用户列表中
        this.userList = res.data.data.users;
        this.total = res.data.data.total;
      });
    },

    //分配角色
    setRole(userInfo) {
      this.roleDialogShow = true;
      //属性分配角色
      this.userInfo = userInfo;

      //获取所有角色列表
      getRole().then((res) => {
        // console.log(res);
        if (res.data.meta.status === 200) {
          this.rolesList = res.data.data;
        }
      });
    },

    //点击分配角色弹窗的确定按钮
    saveRole() {
      //判断用户有没有分配角色
      if(!this.selectedRoleId) {
        return Message({
          type: 'warning',
          message: '请分配角色',
          duration: 1000
        })
      }
      //提交分配的角色
      allotRole(this.userInfo.id,{rid: this.selectedRoleId}).then(res=> {
        console.log(res);
        if(res.data.meta.status !== 200) {
          return Message({
            type: 'error',
            message: '分配角色失败',
            duration: 1000
          })
        }
        //更新成功角色信息
        Message({
          type: 'success',
          message: '分配角色成功',
          duration: 1000
        })
        //刷新用户列表
        this.getUser()
        //关闭弹窗
        this.roleDialogShow = false
      })
    },

    //分配角色弹窗关闭监听事件
    setRoleDialog() {
      //重置默认选中的分配角色id
      this.selectedRoleId = '',
      this.userInfo = {}
    }
  },
};
</script>

<style lang="scss" scoped>
.user {
  .el-breadcrumb {
    margin-bottom: 20px;
  }
  .el-button--success {
    margin-left: 260px;
  }
  .clearfix {
    width: 300px;
    display: flex;
    /deep/.el-input__inner {
      height: 45px;
    }
  }
}
.el-table {
  font-size: 12px;
  width: 100%;
  margin-bottom: 10px;
}
</style>