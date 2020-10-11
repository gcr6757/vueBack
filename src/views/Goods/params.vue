<template>
  <div class="params">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片式图 -->
    <el-card>
      <!-- 警示文字 -->
      <el-alert show-icon title="注意:只允许为第三极分类设置相关参数" type="warning"></el-alert>
      <!-- 选择商品分类 -->
      <el-row class="params">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 级联选择框 -->
          <el-cascader
            v-model="selectedCate"
            :options="cateslist"
            :props="cateProps"
            :checkStrictly="true"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab标签 -->
      <el-tabs type="border-card" v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-button :disabled="isBtnDisabled" type="success" @click="paramsDialogShow = true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyData" stripe border style="width: 100%">
            <!-- 展开航 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  :key="index"
                  v-for="(tag,index) in scope.row.attr_vals"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(index,scope.row)"
                >{{tag}}</el-tag>
                <el-input
                  class="new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  @click="editDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="delCates(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性按钮 -->
          <el-button :disabled="isBtnDisabled" type="success" @click="paramsDialogShow = true">添加属性</el-button>
          <!-- 静态属性表哥 -->
          <el-table :data="onlyData" stripe border style="width: 100%">
            <!-- 展开航 -->
            <el-table-column type="expand">
              <!-- 这里是展开行的内容 -->
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称"></el-table-column>
            <el-table-column label="操作">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  @click="editDialog(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="delCates(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加属性参数的弹出框 -->
      <el-dialog
        @close="paramsClose"
        :title="'添加'+titleTxt"
        :visible.sync="paramsDialogShow"
        width="50%"
      >
        <!-- 添加分类的表单 -->
        <el-form
          :model="addParamsForm"
          :rules="addParamsFormRules"
          ref="addParamsFormRef"
          label-width="100px"
        >
          <el-form-item :label="titleTxt" prop="attr_name">
            <el-input v-model="addParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 弹窗底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button type="warning" @click="paramsDialogShow = false">取 消</el-button>
          <el-button type="primary" @click="submitParams">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改属性参数的弹出框 -->
      <el-dialog
        @close="editParamsClose"
        :title="'修改'+titleTxt"
        :visible.sync="editDialogShow"
        width="50%"
      >
        <!-- 添加分类的表单 -->
        <el-form
          :model="editParamsForm"
          :rules="editParamsFormRules"
          ref="editParamsFormRef"
          label-width="100px"
        >
          <el-form-item :label="titleTxt" prop="attr_name">
            <el-input v-model="editParamsForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <!-- 弹窗底部 -->
        <span slot="footer" class="dialog-footer">
          <el-button type="warning" @click="editDialogShow = false">取 消</el-button>
          <el-button type="primary" @click="editParams">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import {
  getCates,
  catesParams,
  addCatesParams,
  searchCatesParams,
  editCatesParamsSub,
  delParams,
} from "@api";
import { Message, MessageBox } from "element-ui";
export default {
  data() {
    return {
      //分类数据
      cateslist: [],
      //级联选择器的配置对象,value选中的值 label看到的值 children父子节点嵌套的属性
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: 'hover'
      },
      //选中的级联分类双向绑定的数组
      selectedCate: [],
      //被激活的tab标签名
      activeName: "many",

      //tab标签切换返回的参数数据
      //动态 静态属性参数
      manyData: [],
      onlyData: [],
      //添加参数表单数据
      addParamsForm: {
        //要添加的参数名称
        attr_name: "",
      },
      addParamsFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      //控制添加参数的弹出框
      paramsDialogShow: false,
      //修改参数的弹出框
      editDialogShow: false,
      //修改参数的表单数据以及验证
      editParamsForm: {
        attr_name: "",
      },
      editParamsFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCatesList();
  },
  computed: {
    //禁用参数添加按钮的激活与否
    isBtnDisabled() {
      //通过判断选择商品分类的级联选择框是否为三级
      if (this.selectedCate.length !== 3) {
        return true;
      }
      return false;
    },

    //当前选中的三级id，作为参数传递返回数据
    cateId() {
      //直接选择选中id数组中的最后一个值 也就是三级id
      if (this.selectedCate.length === 3) {
        return this.selectedCate[2];
      }
      return null;
    },

    //动态计算标题的文本
    titleTxt() {
      //根据激活的动态面板
      if (this.activeName === "many") {
        return "动态参数";
      }
      return "静态属性";
    },
  },
  methods: {
    //获取所有商品分类
    getCatesList() {
      getCates().then((res) => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          Message({
            type: "error",
            message: "获取分类失败",
            duration: 1000,
          });
        }
        //赋值分类数据
        this.cateslist = res.data.data;
      });
    },
    //级联选择框选中项变化触发
    handleChange() {
      //获取sanji分类参数列表数据
      this.getParamsData();
      //开始判断是不是三级分类，不是就清空表格展示
    },

    //tab标签切换触发
    tabClick() {
      // console.log(this.activeName); //被选中的标签名
      this.getParamsData();
    },

    //获取sanji分类参数列表数据
    getParamsData() {
      console.log(this.selectedCate);
      //通过判断该数组的长度是不是为3 也就是三级分类,这里只允许设置三级分类的参数
      if (this.selectedCate.length !== 3) {
        //重置该数组
        this.selectedCate = [];
        //重置  展示动态参数和静态属性
        this.manyData = []
        this.onlyData = []
        return;
      }
      //走到这里是三级分类,发送请求获取数据 根据所处面板和分类三级id
      catesParams(this.cateId, { params: { sel: this.activeName } }).then(
        (res) => {
          // console.log(res);
          if (res.data.meta.status !== 200) {
            Message({
              message: "获取参数列表失败",
              type: "error",
              duration: 1000,
            });
          }

          //对请求回来的数据判断是静态属性还是动态参数
          //循环返回的参数列表里面的attr_vals内容 分割成数组保存
          res.data.data.forEach((item) => {
            //转换成数组 ,需要进行三元判断是否有内容
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
            //控制文本框显示隐藏
            item.inputVisible = false
            item.inputValue = ''
          });
          if (this.activeName === "many") {
            this.manyData = res.data.data;
          } else {
            this.onlyData = res.data.data;
          }
        }
      );
    },
    //弹出框关闭事件监听
    paramsClose() {
      //重置表单
      this.$refs.addParamsFormRef.resetFields();
    },

    //点击确定弹出框按钮触发
    submitParams() {
      //先进行表单验证
      this.$refs.addParamsFormRef.validate((valid) => {
        if (!valid) return;
        //验证通过发送请求
        addCatesParams(this.cateId, {
          attr_name: this.addParamsForm.attr_name,
          attr_sel: this.activeName,
        }).then((res) => {
          // console.log(res);
          if (res.data.meta.status !== 201) {
            Message({
              type: "error",
              message: "添加参数失败",
              duration: 1000,
            });
          }
          //添加成功，关闭弹窗
          Message({
            type: "success",
            message: "添加参数成功",
            duration: 1000,
          });
          this.paramsDialogShow = false;
          //刷新分类参数列表
          this.getParamsData();
        });
      });
    },

    //修改参数弹出框触发
    editDialog(attrId) {
      this.editDialogShow = true;
      //根据id查询分类参数
      searchCatesParams(this.cateId, attrId, {
        attr_sel: this.activeName,
      }).then((res) => {
        // console.log(res);
        if (res.data.meta.status === 200) {
          //将参数信息保存到表单数据中
          this.editParamsForm = res.data.data;
        }
      });
    },

    //修改弹出框关闭触发
    editParamsClose() {
      //重置表单
      this.$refs.editParamsFormRef.resetFields();
    },

    //修改弹出框点击确定按钮触发
    editParams() {
      //提交 editCatesParamsSub 函数
      this.$refs.editParamsFormRef.validate((valid) => {
        if (!valid) return;
        editCatesParamsSub(this.cateId, this.editParamsForm.attr_id, {
          attr_name: this.editParamsForm.attr_name,
          attr_sel: this.activeName,
        }).then((res) => {
          // console.log(res);
          if (res.data.meta.status === 200) {
            Message({
              type: "success",
              message: "更新成功",
              duration: 1000,
            });
            //关闭弹出层，刷新参数列表
            this.editDialogShow = false;
            this.getParamsData();
          }
        });
      });
    },

    //删除参数
    delCates(attrid) {
      MessageBox.confirm("此操作将永久删除该参数, 是否继续?", "删除参数", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delParams(this.cateId, attrid).then((res) => {
            if (res.data.meta.status === 200) {
              Message({
                type: "success",
                message: "删除成功!",
              });
              //刷新参数列表
              this.getParamsData();
            }
          });
        })
        .catch(() => {
          Message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    //添加tag 文本框事件参数
    handleInputConfirm(row) {
      if(row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      //输入不为空时的处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      //再将保存好的数据传输到后台存贮
      this.saveAttrvals(row)
    },

    //保存参数标签到后台
    saveAttrvals(row) {
      //再将保存好的数据传输到后台存贮
      editCatesParamsSub(this.cateId,row.attr_id,{
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      }).then(res=> {
        // console.log(res);
        if(res.data.meta.status === 200) {
          Message({
            type: 'success',
            duration: 1000,
            message: '添加标签成功'
          })
        }
      })
    },

    //添加tag标签
    showInput(item) {
      item.inputVisible = true
      //文本框自动聚焦
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },

    // 标签化关闭触发
    handleClose(index,row) {
      row.attr_vals.splice(index,1)
      //保存参数标签到后台
      this.saveAttrvals(row)
    }
  },
};
</script>

<style lang="scss" scoped>
.params {
  .el-card {
    margin-top: 20px;
    .params {
      margin: 15px 0px;
    }
    .el-cascader {
      margin-left: 8px;
    }
    .el-table {
      margin-top: 10px;
    }
    .el-tag {
      margin: 5px 5px;
    }
    .new-tag{
      width: 200px;
    }
  }
}
</style>