<template>
  <div class="cates">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片式图 -->
    <el-card>
      <!-- 添加角色按钮 -->
      <el-row>
        <el-col>
          <el-button type="success" @click="addCates">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类展示 -->
      <tree-table
        :data="catesList"
        :columns="columns"
        :expand-type="false"
        :selection-type="false"
        :show-index="true"
        index-text="#"
        border
      >
        <!-- 作用域插槽 -->
        <!-- 是否有效列 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" style="color: skyblue" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-error" style="color: red" v-else></i>
        </template>
        <!-- 排序列 -->
        <template slot="order" slot-scope="scope">
          <el-tag type="success" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="warning" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="danger" v-else>三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="option" slot-scope="scope">
          <el-button type="warning" icon="el-icon-edit" size="small">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类的弹窗 -->
    <el-dialog @close="addCatesDialog" title="添加分类" :visible.sync="catesDialogShow" width="50%">
      <!-- 添加分类的表单 -->
      <el-form
        :model="addCatesForm"
        :rules="addCatesFormRules"
        ref="addCatesFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCatesForm.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类:">
          <!-- 下拉框连及 option指定数据源 props指定配置对象 -->
          <el-cascader
            expandTrigger='hover' 
            v-model="selectedOption"
            :options="parentCates"
            :props="cascaderProps"
            @change="handleChange"
            change-on-select
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 弹窗底部 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" @click="catesDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="submitCates">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCates,addCatesList } from "@api";

import { Message } from "element-ui";

export default {
  data() {
    return {
      //分类列表
      catesList: [],
      //查询参数汇总
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //总分类数据条数
      total: 0,
      //table指定列定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          //表示当前列为模板列
          type: "template",
          //模板名称
          template: "isok",
        },
        {
          label: "排序",
          //表示当前列为模板列
          type: "template",
          //模板名称
          template: "order",
        },
        {
          label: "操作",
          //表示当前列为模板列
          type: "template",
          //模板名称
          template: "option",
        },
      ],
      // 添加分类对话框
      catesDialogShow: false,
      //表单内容
      addCatesForm: {
        //分类名称
        cat_name: "",
        //父级分类
        cat_pid: 0,
        //分类等级
        cat_level: 0,
      },
      //表单验证规则
      addCatesFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      //父级分类展示
      parentCates: [],
      //级联配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      //级联选中的父级分类id
      selectedOption: []
    };
  },
  created() {
    //请求分类列表展示
    this.getCatesList();
  },
  methods: {
    //获取商品分类数据
    getCatesList() {
      getCates({ params: this.queryInfo }).then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          Message({
            type: "error",
            message: "获取商品分类失败",
            duration: 1000,
          });
        }
        //保存分类数据
        this.catesList = res.data.data.result;
        this.total = res.data.data.total;
      });
    },
    //分页 条数发生变化
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      //再次发起请求
      this.getCatesList();
    },
    //分页 页码发生变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      //再次发起请求
      this.getCatesList();
    },

    //获取父级分类
    getParentCates() {
      getCates({ type: 2 }).then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          Message({
            type: "error",
            message: "获取父级分类失败",
            duration: 1000,
          });
        }
        this.parentCates = res.data.data;
      });
    },
    //添加分类
    addCates() {
      this.catesDialogShow = true;
      this.getParentCates();
    },

    //点击弹窗的确定提交分类按钮,         获取不到分类名称
    submitCates() {
      //表单验证
      this.$refs.addCatesFormRef.validate(valid=> {
        if(!valid) return
        //添加分类
        addCatesList({params: this.addCatesForm}).then(res=> {
          console.log(res);
          if(res.data.meta.status !== 201) {
            Message({
              type: 'error',
              message: '添加分类失败',
              duration: 1000
            })
          }
          Message({
            type: 'success',
            message: '添加分类成功',
            duration: 1000
          })
          //刷新商品分类列表
          this.getCatesList()
          this.catesDialogShow = false
        })
      })
    },

    //添加分类弹窗关闭触发,重置表单数据
    addCatesDialog() {
      this.addCatesForm.cat_level = 0
      this.addCatesForm.cat_pid = 0 
      this.selectedOption = []
      this.$refs.addCatesFormRef.resetFields()
    },

    //级联选择项变化,也就是v-model绑定的数组值selectedOption 父类id集合
    handleChange() {
      console.log(this.selectedOption);
      //如果selectedOption数组中的length大于0 证明选中了父级
      if(this.selectedOption.length > 0) {
        this.addCatesForm.cat_pid = this.selectedOption[this.selectedOption.length - 1]
        //分类等级赋值
        this.addCatesForm.cat_level = this.selectedOption.length
      } else {
        //重置父级id和等级
        this.addCatesForm.cat_pid = 0
        this.addCatesForm.cat_level = 0
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.cates {
  .el-card {
    margin-top: 20px;
    .el-button {
      margin-bottom: 20px;
    }
  }
  .el-pagination {
    margin-top: 20px;
  }
}
</style>