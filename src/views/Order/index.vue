<template>
  <div class="order">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片式图 -->
    <el-card>
      <!-- 搜索框 添加 gutter是列间距-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search" clearable></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- table表格区域 -->
      <el-table :data="orderList" stripe border style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="80"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'" type="success">已付款</el-tag>
            <el-tag v-else type="warning">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="80"></el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{ scope.row.create_time | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-button type="warning" size="small" icon="el-icon-edit" @click="edit(scope.row)"></el-button>
            <el-button
              type="success"
              size="small"
              icon="el-icon-location-outline"
              @click="location(scope.row)"
            ></el-button>
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

      <!-- 编辑弹出框 -->
      <el-dialog @close="editDialog" title="修改地址" :visible.sync="editDialogShow" width="50%">
        <!-- 添加分类的表单 -->
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
          <el-form-item label="省市区:" prop="address1">
            <!-- 下拉框连及 option指定数据源 props指定配置对象 -->
            <el-cascader expandTrigger="hover" v-model="editForm.address1" :options="cityData"></el-cascader>
          </el-form-item>

          <el-form-item label="详细地址:" prop="address2">
            <el-input v-model="editForm.address2"></el-input>
          </el-form-item>
        </el-form>
        <!-- 弹窗底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button type="warning" @click="editDialogShow = false">取 消</el-button>
          <el-button type="primary" @click="sureEdit">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 物流进度对话框 -->
      <el-dialog title="物流进度" :visible.sync="locationDialogShow" width="50%">
        <!-- 时间线 -->
        <el-timeline>
          <el-timeline-item
            v-for="(logistics, index) in logisticsInfo"
            color='skyblue'
            :key="index"
            :timestamp="logistics.time"
          >{{logistics.context}}</el-timeline-item>
        </el-timeline>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getOrderList, logistics } from "@api";

//导入省市区三级联动的数据
import cityData from "./citydata.js";
import { Message } from "element-ui";

export default {
  data() {
    return {
      //请求订单数据的参数项
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      //订单数据
      orderList: [],
      total: 0,

      //编辑弹出框的内容展示
      editForm: {
        //级联选择器
        address1: [],
        address2: "",
      },
      //编辑按钮的弹出框
      editDialogShow: false,
      //物流进度
      locationDialogShow: false,
      //物流信息
      logisticsInfo: [],

      //编辑表单验证
      editFormRules: {
        address1: [
          { required: true, message: "请选择省市区", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      //省市区数据
      cityData,
    };
  },
  methods: {
    //获取订单列表项
    getOrder() {
      getOrderList({ params: this.queryInfo }).then((res) => {
        // console.log(res);
        if (res.data.meta.status === 200) {
          this.orderList = res.data.data.goods;
          this.total = res.data.data.total;
        }
      });
    },
    //编辑按钮 修改地址
    edit() {
      this.editDialogShow = true;
    },

    //确定修改按钮
    sureEdit() {},

    //定位按钮 物流进度
    location() {
      //现获取物流信息  提供测试信息
      logistics(1106975712662).then((res) => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          Message({
            message: "获取物流信息成功",
            type: "success",
            duration: 1000,
          });
          //保存物流信息
          this.logisticsInfo = res.data.data;
        }
      });
      this.locationDialogShow = true;
    },

    //分页条数变化
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      //重新获取列表订单
      this.getOrder();
    },

    //分页页码变化
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      //重新获取列表订单
      this.getOrder();
    },

    //编辑弹出框关闭时触发
    editDialog() {
      this.$refs.editFormRef.resetFields();
    },
  },
  created() {
    this.getOrder();
  },
};
</script>

<style lang="scss" scoped>
.order {
  .el-card {
    margin-top: 20px;
    .el-table {
      margin-top: 20px;
      margin-bottom: 20px;
    }
  }
}
</style>