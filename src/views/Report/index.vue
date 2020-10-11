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
}
</style>