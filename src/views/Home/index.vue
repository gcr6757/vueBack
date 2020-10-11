<template>
  <div class="home">
    <el-container>
      <!-- 主页头部 -->
      <el-header>
        <!-- 左侧logo -->
        <div class="logo">
          <img src="https://img.yzcdn.cn/vant/logo.png" alt />
        </div>
        <!-- 右侧导航 -->
        <div class="nav">
          <!-- 左侧图标管理 -->
          <div class="navLeft">
            <el-row>
              <el-button type="primary" icon="el-icon-s-fold" circle></el-button>
              <el-button type="success" icon="el-icon-bell" circle></el-button>
              <el-button type="info" icon="el-icon-message" circle></el-button>
              <el-button type="warning" icon="el-icon-refresh-right" circle></el-button>
            </el-row>
          </div>
          <!-- 右侧信息汇总 -->
          <div class="navRight">
            <div class="search">
              <el-input placeholder="请输入内容">
                <i slot="prefix" class="el-input__icon el-icon-search"></i>
              </el-input>
            </div>
            <div class="user">
              <el-dropdown @command="handleCommand">
                <span class="el-dropdown-link">
                  {{ this.$route.query.username }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="a">我的订单</el-dropdown-item>
                  <el-dropdown-item command="b">个人信息</el-dropdown-item>
                  <el-dropdown-item command="c">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
      </el-header>
      <el-container>
        <!-- 主页侧边 -->
        <el-aside :width="isCollapse? '64px': '200px'" ref="aside">
          <el-menu
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :collapse="isCollapse"
            :collapse-transition="false"
            :default-active="activePath"
            router
            unique-opened
          >
            <!-- 菜单折叠与否 -->
            <div class="btnToggle">
              <el-button type="info" icon="el-icon-s-promotion" @click="toggle"></el-button>
            </div>
            <!-- 一级菜单 -->
            <el-submenu :index="menu.id + ''" v-for="menu in menus" :key="menu.id">
              <template slot="title">
                <i :class="icons[menu.id]"></i>
                <span>{{ menu.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/'+ menuSon.path"
                v-for="menuSon in menu.children"
                :key="menuSon.id"
                @click="keepMark('/'+ menuSon.path)"
              >
                <i class="el-icon-menu"></i>
                <span>{{ menuSon.authName }}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主页主体内容 -->
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { Message } from "element-ui";

//解构出api里面的请求左侧菜单栏的接口
import { getMenu } from "@api";

//引入欢迎页面

export default {
  data() {
    return {
      //左侧菜单展示
      menus: [],
      //字体图标,用菜单的id对应不同的icon图标
      icons: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      //菜单折叠
      isCollapse: false,
      //左侧菜单高亮显示
      activePath: ''
    };
  },
  created() {
    // console.log(this.$route);
    //这里是初始化加载左侧菜单栏
    this.getMenuList();
    //取出当前的session中存储的高亮
    this.activePath = sessionStorage.getItem('activePath')
  },
  methods: {
    handleCommand(command) {
      //点击退出登录的时候触发
      if (command === "c") {
        Message({
          message: "退出成功",
          type: "warning",
          duration: 500,
        });
        //清空token
        sessionStorage.clear();
        this.$router.push("/login");
      }
    },
    //切换左侧菜单栏的折叠
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
    //保持左侧二级菜单高亮
    keepMark(activePath) {
      //将当前点击的二级菜单的path存为高亮并保存到session中
      sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath
    },
    getMenuList() {
      getMenu().then((res) => {
        console.log(res);
        //获取左侧菜单数据
        this.menus = res.data.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  min-width: 1090px;
  .el-header {
    text-align: center;
    line-height: 60px;
    font-size: 18px;
    font-weight: bold;
    color: #333;
    display: flex;
    justify-content: space-between;
    .logo {
      height: 100%;
      width: 180px;
      text-align: left;
      img {
        width: 30px;
        height: 50%;
        vertical-align: middle;
      }
    }
    .nav {
      flex: 1;
      display: flex;
      align-items: center;
      .navLeft {
        width: 300px;
      }
      .navRight {
        flex: 1;
        display: flex;
        .search {
          width: 300px;
        }
        .user {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          padding-right: 20px;
          box-sizing: border-box;
        }
      }
    }
  }
  .el-container {
    height: 100%;
    .el-main {
      background: #fff;
    }
    .el-aside {
      background: #545c64;
      overflow: hidden;
      .el-menu {
        border: none;
        .btnToggle {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
          .el-button {
            width: 100%;
            border-radius: 0px;
          }
        }
        .iconfont {
          margin-right: 15px;
        }
      }
    }
  }
}
.el-main{
  min-width: 1000px;
}
</style>