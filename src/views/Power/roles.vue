<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片式图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="success">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色展示区 -->
      <el-table :data="roles" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 这里可以使用作用域插槽拿取这行的数据 -->
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-row
              :class="['bdbottom',{'bdtop':index===0}]"
              v-for="(item1,index) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="closeTag(scope.row,item1.id)" type="success">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二三级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag closable type="warning" @close="closeTag(scope.row,item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      @close="closeTag(scope.row,item3.id)"
                      closable
                      type="danger"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                    >{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <!-- 这里用作用域插槽的形式来美化操作信息 -->
          <template slot-scope="scope">
            <el-button type="primary" size="small" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="small" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" size="small" icon="el-icon-setting" @click="showRights(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog @close='setRightDialog' title="分配权限" :visible.sync="rightDialogShow" width="50%">
      <!-- 树形结构权限 -->
      <el-tree 
        :data="rightTree" 
        :props="treeProps"
        show-checkbox
        node-key='id'
        default-expand-all
        :default-checked-keys="defkeys"
        ref="treeRef"
      ></el-tree>
      <!-- 弹窗底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="warning">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesList, delRole, getRightsTree, rolesRight } from "@api";
import { Message, MessageBox } from "element-ui";
export default {
  data() {
    return {
      //所有角色列表
      roles: [],
      //权限分配对话框
      rightDialogShow: false,
      //树形权限列表
      rightTree: [],
      //默认tree绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      //树形控件默认选中的权限,即三级权限id
      defkeys: [],
      //当前即将分配权限的角色id
      roleId: ''
    };
  },
  created() {
    //获取角色列表数据
    this.getRoles();
  },
  methods: {
    getRoles() {
      getRolesList().then((res) => {
        console.log(res);
        if (res.data.meta.status !== 200) {
          Message({
            type: "error",
            message: "获取角色列表失败",
            duration: 1000,
          });
        }
        //赋值角色列表
        this.roles = res.data.data;
      });
    },
    //根据id来删除对应的权限
    closeTag(role,rightId) {
      MessageBox.confirm("此操作将永久删除该权限, 是否继续?", "删除权限", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //删除权限
          delRole(role.id,rightId).then(res=> {
            // console.log(res);
            if(res.data.meta.status !== 200) {
              Message({
                type: "error",
                message: "删除失败!",
                duration: 1000
              })
            }
            //刷新角色列表,重新赋值角色权限
            role.children = res.data.data
          })
        })
        .catch(() => {
          Message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //分配权限按钮弹出框
    showRights(role) {
      //将分配权限id
      this.roleId = role.id
      //递归传参获取三级id
      this.getDefKey(role,this.defkeys)

      //显示分配权限的弹出框
      this.rightDialogShow = true

      //请求树形结构的权限列表
      getRightsTree().then(res=> {
        // console.log(res);
        if(res.data.meta.status === 200) {
          //储存数据到属性中
          this.rightTree = res.data.data
        }
      })
    },
    
    //定义一个递归函数获取三级权限的id并保存到defkeys数组中
    getDefKey(node,arr) {
      //通过判断节点是否有children属性来判断是否为三级权限
      if(!node.children) {
        //没有子children属性为三级权限
        return arr.push(node.id)
      }
      //其他用递归
      node.children.forEach(item=> {
        return this.getDefKey(item,arr)
      })
    },

    //监听分配权限对话框的关闭事件
    setRightDialog() {
      //重新清空默认勾选的权限数组
      this.defkeys = []
    },

    //分配权限点击确定按钮执行
    allotRights() {
      //数结构的组件属性，getHalfCheckedKeys，getCheckedKeys
      //获取选中的半选中节点和全选中节点的id数组
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]

      const idStr = keys.join(',')
      rolesRight(this.roleId,{ rids: idStr }).then(res=> {
        // console.log(res);
        if(res.data.meta.status !== 200) {
          Message({
            type: 'error',
            message: '分配权限失败',
            duration: 1000
          })
        }
        Message({
          type: 'success',
          message: '分配权限成功',
          duration: 1000
        }),
        //刷新列表
        this.getRoles()
        //关闭权限弹窗
        this.rightDialogShow = false
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.roles {
  .el-card {
    min-width: 1015px;
    margin-top: 20px;
    .el-table {
      margin-top: 20px;
    }
  }
  .el-row {
    display: flex;
    align-items: center;
  }
  .el-tag {
    margin: 7px;
  }
  .bdtop {
    border-top: 1px solid #eee;
  }
  .bdbottom {
    border-bottom: 1px solid #eee;
  }
}
</style>