<template>
  <div class="report">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片式图  数据报表-->
    <el-card>
      <!-- echarts -->
      <div id="main" style="width: 800px;height:400px;"></div>

      <!-- 下拉测试 -->
      <el-select v-model="value1" multiple placeholder="请选择">
        <el-option v-for="item in datas" :key="item.value" :label="item.label" :value="item.value">
          <!-- <el-checkbox :label="item.label"></el-checkbox> -->
          <span class="checkbox"></span>
          <span class="label-name-box">{{item.label}}</span>
        </el-option>
      </el-select>
    </el-card>
  </div>
</template>

<script>
import { report } from '@api'

//深拷贝等  用来合并数据 .merge函数方法
import _ from 'lodash'

//导入图表
import echarts from "echarts";
export default {
  data() {
    return {
      //需要合并的数据折现图
       datas: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value1: [],
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    };
  },
  methods: {},
  created() {},
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));


    //获取折现图的接口
    report().then(res=> {
      if(res.data.meta.status === 200) {
        const result =  _.merge(res.data.data,this.options)
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(result);
      }
    })

    // 指定图表的配置项和数据
    // var option = {
    //   title: {
    //     text: "ECharts 入门示例",
    //   },
    //   tooltip: {},
    //   legend: {
    //     data: ["销量"],
    //   },
    //   xAxis: {
    //     data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
    //   },
    //   yAxis: {},
    //   series: [
    //     {
    //       name: "销量",
    //       type: "bar",
    //       data: [5, 20, 36, 10, 10, 20],
    //     },
    //   ],
    // };
    // 使用刚指定的配置项和数据显示图表。
    // myChart.setOption(option);
  },
};
</script>

<style lang="scss" scoped>
.report {
  .el-breadcrumb {
    margin-bottom: 20px;
  }
  .el-select {
    width: 450px;
  }
}
/*清空原来的多选框样式*/
.el-select-dropdown.is-multiple .el-select-dropdown__item:after{
	content:"";
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected:after{
	content:"";
}
/*参考el-checkbox实现checkbox样式*/
.el-select-dropdown.is-multiple .el-select-dropdown__item .checkbox{
	display: inline-block;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #fff;
    z-index: 1;
    margin-right: 15px;
    transition: border-color .25s cubic-bezier(.71,-.46,.29,1.46),background-color .25s cubic-bezier(.71,-.46,.29,1.46);
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected .checkbox{
	background-color:#409eff;
	border-color:#409eff;
}

/*参考el-select多选对号样式实现checkbox中对号的样式*/
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected .checkbox::after{
	position: absolute;
    top: -10px;
    font-family: element-icons;
    content: "\e6da";
    font-size: 12px;
    font-weight: 700;
    -webkit-font-smoothing: antialiased;
    color:#fff;
}

/*设置置灰内容样式*/
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected.is-disabled .checkbox{
	background-color:#f2f6fc;
	border-color:#dcdfe6;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected.is-disabled .checkbox::after{
	color:#c0c4cc;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected.is-disabled .label-name-box{
	color:#c0c4cc;
	font-weight:400;
}
</style>