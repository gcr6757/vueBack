//封装axios
import axios from 'axios'
import nProgress from 'nprogress'

// 全局的loading  顶部的蓝条进度
import Nprogress from 'nprogress'
import 'nprogress/nprogress.css'

//引入qs模块，因为post传递参数到后台是对象,后台解析也许只能接受字符串形式，需要qs转换
const qs = require('qs')

//创建一个vue实例
import Vue from 'vue'
const vm = new Vue()

//创建axios实例
const request = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  timeout: 3000
})

//请求拦截

// Add a request interceptor
request.interceptors.request.use(function (config) {

  //顶部的进度蓝条展示，请求的同时展示，响应的时候消失
  Nprogress.start()

  //判断如果是post传参，需要对数据进行qs转换为字符串
  // console.log(config);//这里config表示表单提交的所有参数
  if (config.method === 'post' && config.data !== '') {
    //这里对请求的方式和数据进行判断,如果请求方式为post并且数据不为空，用qs模块转换数据格式为字符串
    config.data = qs.stringify(config.data)
    // console.log(config.data);
  }

  //把token放在请求的数据当中，给后端进行校验,请求头添加`Authorization` 字段
  config.headers.Authorization = sessionStorage.getItem('token')

  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});


//响应拦截
// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  Nprogress.done()
  
  return response;
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error);
});

export default request