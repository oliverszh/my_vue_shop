<template>
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="../assets/logo.png" />
        <span>Vue电商管理系统</span>
      </div>
      <el-button type="info" @click="logoout">退出</el-button>
    </el-header>
    <el-container>
      
      <el-aside :width="isCollapse? '64px':'200px'">
        <div class="toggle-button" @click="isCollapse=!isCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="menu.id.toString()" v-for="menu in menuList" :key="menu.id">
            <template slot="title">
              <i :class="menuObj[menu.id]"></i>
              <span>{{menu.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/home/'+submenu.path" v-for="submenu in menu.children" :key="submenu.id">
              <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{submenu.authName}}</span>
            </template>
            </el-menu-item>
            
          </el-submenu>

        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>
</template>

<script>
export default {
  data(){
    return {
      menuList:[],
      menuObj:{
        "125": "iconfont icon-icon_user",
        "103": "iconfont icon-tijikongjian",
        "101": "iconfont icon-shangpin",
        "102": "iconfont icon-danju",
        "145": "iconfont icon-baobiao"
      },
      isCollapse : false
    }
  },
  methods: {
    logoout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList(){
      const {data:res} = await this.$http.get("menus");
      if(res.meta.status!==200) return this.$message.error(res.meta.msg);
      this.menuList=res.data;
      //console.log(res);
    }
  },
  created(){
    this.getMenuList();
  }
};
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
  .el-header {
    padding-left: 0;
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      display: flex;
      align-items: center;
      color: #fff;
      font-size: 20px;
      img {
        width: 50px;
        height: 50px;
      }
      span {
        margin-left: 15px;
      }
    }
    .el-button {
      align-content: center;
    }
  }
  .el-container {
    .el-aside {
      background-color: #333744;
      .iconfont{
        margin-right: 10px;
      }
      .el-menu{
        border-right: none;
      }
      .toggle-button{
        color:#fff;
        text-align: center;
        letter-spacing: 0.2em;
        background-color: #4a5064;
        cursor: pointer;
        font-size: 10px;
        height: 24px;
        line-height: 24px;
      }
    }
    .el-main {
      background-color: #eaedf1;
    }
  }
}
</style>