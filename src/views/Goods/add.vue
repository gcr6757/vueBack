<template>
  <div class="add">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片式图 -->
    <el-card>
      <el-alert title="添加商品信息" show-icon center :closable="false" type="info"></el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" align-center :active="activeStep - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成添加"></el-step>
      </el-steps>

      <!-- 纵向tab栏 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-position="top"
        label-width="100px"
      >
        <el-tabs
          v-model="activeStep"
          :tab-position="'left'"
          :before-leave="beforeLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>

            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <!-- 级联选择器 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catesList"
                :props="cateProps"
                @change="handleChange"
                expandTrigger="hover"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="(item) in manyTabData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTabData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传  action上传地址-->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :headers="headerObj"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor
              v-model="addForm.goods_introduce"
              ref="myQuillEditorRef"
            ></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button 
              class="addGood" 
              type='success'
              @click="addGoods"
              >添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
//获取商品分类
import { getCates, catesParams, addGood } from "@api";

import { Message } from "element-ui";

//深拷贝插件
import _ from 'lodash'

export default {
  data() {
    return {
      //激活的步骤条进度
      activeStep: "0",
      //表单内容
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        //级联选择器的商品分类id
        goods_cat: [],
        //图片路径数组
        pics: [],
        //商品详情 富文本
        goods_introduce: '',
        //动态参数，静态属性集合
        attrs: []
      },
      //表单简验证
      addFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品名价格", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },

      //商品分类集合
      catesList: [],
      //级联选择器的配置项
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      //动态参数列表
      manyTabData: [],
      onlyTabData: [],

      //图片上传的请求头
      headerObj: {
        Authorization: sessionStorage.getItem("token"),
      },
      //图片预览的路径
      previewPath: "",
    };
  },
  created() {
    //获取商品分类
    this.getGoodsCates();
  },
  methods: {
    getGoodsCates() {
      getCates().then((res) => {
        // console.log(res);
        if (res.data.meta.status === 200) {
          this.catesList = res.data.data;
        }
      });
    },

    //级联选择器的改变触发
    handleChange() {
      //这里面需要判断级联选择器的分类是否为三级分类
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
      //如果是三级分类
    },

    //tab栏切换的前后
    beforeLeave(activeName, oldActiveName) {
      //即将进入的标签页 和 即将离开的标签页
      // console.log(activeName,oldActiveName);
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        //阻止发生tab栏切换
        Message({
          type: "warning",
          message: "请选择商品分类",
          duration: 1000,
        });
        return false;
      }
    },

    //tab面板选中的事件
    tabClicked() {
      //对应的tab面板下标
      console.log(this.activeStep);
      if (this.activeStep === "1") {
        //选中了商品参数面板
        catesParams(this.catesId, { params: { sel: "many" } }).then((res) => {
          // console.log(res);
          if (res.data.meta.status === 200) {
            res.data.data.forEach((item) => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
            });
            this.manyTabData = res.data.data;
          }
        });
      }
      if (this.activeStep === "2") {
        catesParams(this.catesId, { params: { sel: "only" } }).then((res) => {
          //获取静态属性
          if (res.data.meta.status === 200) {
            this.onlyTabData = res.data.data;
          }
        });
      }
    },

    //图片上传的图片预览
    handlePreview(pic) {
      this.previewPath = pic.response.data.url;
    },

    //图片删除更换触发
    handleRemove(pic) {
      // console.log(pic); //将要移出的图片信息
      //从pic数组中找出对应的图片下标删除即可
      const picPath = pic.response.data.tmp_path;

      //筛选出下标
      const index = this.addForm.pics.findIndex((v) => {
        return v.path === picPath;
      });

      this.addForm.pics.splice(index, 1);
      // console.log(this.addForm.pics);
    },

    //图片上传成功监听
    handleSuccess(response) {
      //response 后台响应的数据 包括图片的地址 等
      //利用对象解构赋值  得到图片的路径
      const picInfo = { pic: response.data.tmp_path };
      this.addForm.pics.push(picInfo);
    },

    //添加商品按钮
    addGoods() {
      //表单验证
      this.$refs.addFormRef.validate(valid=> {
        if(! valid) {
          return Message({
            type: 'warning',
            message: '请完整填写表单内容',
            duration: 1000
          })
        }

        //添加的接口 传参需要对goods_cat数组进行转字符串
        //利用深拷贝来解决转换的问题 lodash cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form. goods_cat.join(',')
        //处理动态参数 静态属性
        this.manyTabData.forEach(item=> {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addForm.attrs.push(newInfo)
        })

        this.onlyTabData.forEach(item=> {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })

        form.attrs = this.addForm.attrs
        //商品名称唯一性
        addGood(form).then(res=> {
          // console.log(res);
          if(res.data.meta.status === 201) {
            Message({
              type: 'success',
              duration: 1000,
              message: '添加商品成功'
            })
            //跳转路由
            this.$router.push('/goods')
          }
        })
      })
    }
  },

  computed: {
    //选中的三级分类id作为计算属性方便获取
    catesId() {
      if (this.addForm.goods_cat.length === 3) {
        //分类id数组中的下标2对应的id 正是三级分类id
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
};
</script>

<style lang="scss" scoped>
.add {
  .el-card {
    margin-top: 20px;
    .el-alert {
      margin-bottom: 20px;
    }
    .el-steps {
      margin-bottom: 20px;
    }
    .addGood{
      margin-top: 20px;
    }
  }
}
</style>