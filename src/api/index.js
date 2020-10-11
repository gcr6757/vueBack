//这里是请求接口函数汇总

//先引入axios实例
import request from '@utils/request'

//获取登录接口
const getLogin = (params={}) => {
  return request.post('/login',params)
}

//获取左侧菜单栏
const getMenu = () => {
  return request.get('/menus')
}

//获取用户列表
const getUserList = (params={}) => {
  return request.get('/users',params)
}

//添加用户信息
const addUserInfo = (params={}) => {
  return request.post('/users', params)
}

//修改用户信息里面的通过id查询信息展示到表单中
const editUserInfo = (id) => {
  return request.get('users/'+ id )
}

//修改提交用户信息
const editUserSubmit = (id,params={}) => {
  return request.put('users/' + id,params)
}

//删除用户信息
const delUserInfo = (id) => {
  return request.delete('users/'+ id)
}

//修改用户状态
const EditUserState = (id,type) => {
  return request.put('users/'+ id +'/state/'+ type)
}

//获取权限列表
const getRightsList = () => {
  return request.get('rights/list')
}

//权限列表树形结构
const getRightsTree = () => {
  return request.get('rights/tree')
}

//获取角色列表
const getRolesList = () => {
  return request.get('roles')
}

//角色授权
const rolesRight = (roleId,params={}) => {
  return request.post('roles/'+ roleId +'/rights',params)
}

//删除权限
const delRole = (roleId,rightId) => {
  return request.delete('roles/'+ roleId +'/rights/'+ rightId)
}

//获取角色列表
const getRole = () => {
  return request.get('roles')
}

//分配角色
const allotRole = (id,params={}) => {
  return request.put('users/'+ id +'/role',params)
}

//获取商品管理的分类列表
const getCates = (params={}) => {
  return request.get('categories',params)
}

//添加分类
const addCatesList = (params={}) => {
  return request.post('categories',params)
}

//分类参数
const catesParams = (id,params={}) => {
  return request.get('categories/'+ id +'/attributes',params)
}

//添加动态分类参数等
const addCatesParams = (id,params={}) => {
  return request.post('categories/'+ id +'/attributes',params)
}

//根据id查询参数  attrId属性id  分类id
const searchCatesParams = (id,attrId,params={}) => {
  return request.get('categories/'+ id +'/attributes/'+ attrId,params)
}

//编辑提交参数
const editCatesParamsSub = (id,attrId,params={}) => {
  return request.put('categories/'+ id +'/attributes/'+ attrId,params)
}

//删除参数
const delParams = (id,attrid) => {
  return request.delete('categories/'+ id +'/attributes/'+ attrid)
}

//商品列表
const getGoodsList = (params={}) => {
  return request.get('goods',params)
}

//删除商品
const delGood = (id) => {
  return request.delete('goods/'+ id)
}

//添加商品
const addGood = (params={}) => {
  return request.post('goods',params)
}

//订单列表
const getOrderList = (params={}) => {
  return request.get('orders',params)
}

//查看物流信息
const logistics = (id) => {
  return request.get('/kuaidi/' + id)
}

//获取图表折线图
const report = () => {
  return request.get('reports/type/1')
}

export {
  getLogin,
  getMenu,
  getUserList,
  EditUserState,
  addUserInfo,
  editUserInfo,
  editUserSubmit,
  delUserInfo,
  getRightsList,
  getRolesList,
  delRole,
  getRightsTree,
  rolesRight,
  getRole,
  allotRole,
  getCates,
  addCatesList,
  catesParams,
  addCatesParams,
  searchCatesParams,
  editCatesParamsSub,
  delParams,
  getGoodsList,
  delGood,
  addGood,
  getOrderList,
  logistics,
  report
}
