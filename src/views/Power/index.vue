<template>
  <div class="rights">
    <!-- 权限组件  路由默认的ui组件路径为/rights -->
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片式图 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <!-- 这里用作用域插槽的形式来美化等级信息，ui组件中的tag组件 -->
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'" effect="dark" type="success">一级权限</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" effect="dark" type="warning">二级权限</el-tag>
            <el-tag v-else effect="dark" type="danger">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from "@api";
import { Message } from "element-ui";
export default {
  data() {
    return {
      //权限列表
      rightsList: [],
    };
  },
  created() {
    this.getRights();
  },
  methods: {
    //获取权限列表
    async getRights() {
      const { data: res } = await getRightsList();
      if (res.meta.status !== 200) {
        return Message({
          type: "error",
          message: "获取权限列表失败",
          duration: 1000,
        });
      }
      //将数据挂载到自定义权限列表属性上
      this.rightsList = res.data;
      console.log(this.rightsList);
    },
  },
};
</script>

<style lang="scss" scoped>
.rights {
  .el-card {
    margin-top: 20px;
  }
}
</style>