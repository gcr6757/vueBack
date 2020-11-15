const path = require('path')

module.exports = {
  lintOnSave: false,
  devServer: {
    port: 8080,//端口号 
    open: true,
    // proxy: {
    //   '/cont': { //代表请求接口以/cont开头 自动匹配
    //     target: 'https://api.it120.cc',//目标地址
    //     ws: false, //// 是否启用websockets
    //     changeOrigin: true, //开启代理：在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
    //     pathRewrite: { '^/cont': '/cont' }  //这里重写路径,在目标地址后面增加/cont
    //   }
    // }
  },
  //配置路径别名
  chainWebpack: (config) => {
    // 发布模式
    config.when(process.env.NODE_ENV === 'production', config => {
      // entry找到默认的打包入口，调用clear则是删除默认的打包入口
      // add添加新的打包入口
      config.entry('app').clear().add('./src/main-prod.js')

      //通过external加载外部cdn资源
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        echarts: 'echarts',
        'vue-quill-editor': 'VueQuillEditor',
        lodash: '_',
        nprogress: 'Nprogress'
      })

      //首页加载优化
      config.plugin('html').tap(args => {
        args[0].isProd = true
        return args
      })
    })
    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')

      config.plugin('html').tap(args => {
        args[0].isProd = false
        return args
      })
    })
    //修改文件引入自定义路径
    config.resolve.alias
      .set('@', path.join(__dirname, 'src'))
      .set('@views', path.join(__dirname, 'src/views'))
      .set('@assets', path.join(__dirname, 'src/assets'))
      .set('@components', path.join(__dirname, 'src/components'))
      .set('@api', path.join(__dirname, 'src/api'))
      .set('@utils', path.join(__dirname, 'src/utils'))
      .set('@directives', path.join(__dirname, 'src/directives'))
      .set('@filters', path.join(__dirname, 'src/filters'))
  }
}