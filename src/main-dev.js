import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//引入全局的css样式
import './assets/css/base.css'

//引入font字体图标
import './assets/fonts/iconfont.css'

//定义axios方法,挂载到vue实例上
// import axios from 'axios'
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// Vue.prototype.$http = axios

//请求实例,获取菜单
// async getMenu() {
//   const { data: res } = await this.$http.get('/menus')
//   console.log(res);
// }


//全局的时间过滤器  ,这里的参数v代指使用该过滤器的时间对象
// Vue.filter('fmtdate', (v) => {
//   return moment(v).format('YYYY-MM-DD')
// })

//注册全局的富文本编辑器
import VueqQillEditor from 'vue-quill-editor'

//这里面的样式文件全部通过cdn加载在public里面的index文件中

import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.use(VueqQillEditor)

//引入vue树形表格
import TreeTable from 'vue-table-with-tree-grid'

Vue.component('tree-table', TreeTable)

//注册一个全局的的日期过滤器
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})


//按需引入element-ui
import { Input, Button, Avatar, Icon, Form, FormItem, Container, Header, Aside, Main, Collapse, CollapseItem, Menu, Submenu, MenuItem, Row, Dropdown, DropdownItem, DropdownMenu, Breadcrumb, BreadcrumbItem, Card, Popover, Table, TableColumn, Switch, Tooltip, Pagination, Dialog, Tag, Col, Tree, Select, Option, Cascader, Alert, Tabs, TabPane, Steps, Step, Checkbox, CheckboxGroup, Upload, Timeline, TimelineItem } from 'element-ui'

Vue.use(Input)
  .use(Button)
  .use(Avatar)
  .use(Icon)
  .use(Form)
  .use(FormItem)
  .use(Container)
  .use(Header)
  .use(Aside)
  .use(Main)
  .use(Collapse)
  .use(CollapseItem)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)
  .use(Row)
  .use(Dropdown)
  .use(DropdownItem)
  .use(DropdownMenu)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Card)
  .use(Popover)
  .use(Table)
  .use(TableColumn)
  .use(Switch)
  .use(Tooltip)
  .use(Pagination)
  .use(Dialog)
  .use(Tag)
  .use(Col)
  .use(Tree)
  .use(Select)
  .use(Option)
  .use(Cascader)
  .use(Alert)
  .use(TabPane)
  .use(Tabs)
  .use(Steps)
  .use(Step)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Upload)
  .use(Timeline)
  .use(TimelineItem)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
