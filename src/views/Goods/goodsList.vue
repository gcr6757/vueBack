<template>
  <div class="goodsList">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片式图 -->
    <el-card>
      <!-- 搜索框 添加 gutter是列间距-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query">
            <el-button
              slot="append"
              icon="el-icon-search"
              clearable
              @clear="getGoods"
              @click="getGoods"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button class="add" type="success" @click="goAdd">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="goodsList" stripe border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" width="350" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格" width="95" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" width="95" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" width="170" prop="add_time">
          <template slot-scope="scope">{{ scope.row.add_time | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-button
              type="warning"
              size="small"
              icon="el-icon-edit"
              @click="editGoods(scope.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              size="small"
              icon="el-icon-delete"
              @click="delGoods(scope.row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList, delGood } from "@api"

import { MessageBox,Message } from 'element-ui'

export default {
  data() {
    return {
      //搜索表单的内容绑定
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      //商品总条数
      total: 0,
      //商品数组集合
      goodsList: [],
    };
  },
  created() {
    //获取商品列表'
    this.getGoods();
  },
  methods: {
    getGoods() {
      getGoodsList({ params: this.queryInfo }).then((res) => {
        // console.log(res);
        if (res.data.meta.status === 200) {
          this.goodsList = res.data.data.goods;
          this.total = res.data.data.total;
        }
      });
    },
    //pagesize 变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      //重新获取数据
      this.getGoods();
    },
    //当前页发生变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      //重新获取数据
      this.getGoods();
    },

    //编辑商品按钮
    editGoods() {},
    //删除商品按钮
    delGoods(id) {
      MessageBox.confirm("此操作将永久删除该商品, 是否继续?", "删除商品", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //提交请求删除
          delGood(id).then(res=> {
            if(res.data.meta.status === 200) {
              Message({
                type: "success",
                message: "删除成功!",
              });
              //刷新列表
              this.getGoods()
            }
          })
        })
        .catch(() => {
          Message({
            type: "info",
            message: "已取消删除",
          });
        })
    },

    //添加商品
    goAdd() {
      this.$router.push('/goods/add')
    }
  },
};
</script>

<style lang="scss" scoped>
.goodsList {
  .el-card {
    margin-top: 20px;
    .el-table {
      margin-top: 20px;
      min-width: 970px;
      margin-bottom: 20px;
    }
  }
}
</style>