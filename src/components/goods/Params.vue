<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <el-alert
        show-icon
        title="注意：只允许为第三级分类设置相关参数!"
        type="warning"
        :closable="false"
      ></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            v-model="selectCateKeys"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="tabHandleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisables"
            >动态参数</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisables"
            >静态属性</el-button
          >
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      selectCateKeys: [],
      cateProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      activeName: "many",
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    isBtnDisables() {
      if (this.selectCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    cateId(){
        if(this.selectCateKeys.length===3){
            return this.selectCateKeys[this.selectCateKeys.length-1];
        }
        return null;
    }
  },
  methods: {
    async getCateList() {
      const { data } = await this.$http.get("categories");
      if (data.meta.status !== 200) {
        return this.$message.error(data.meta.msg);
      }
      this.cateList = data.data;
    },
    async handleChange() {
      if (this.selectCateKeys.length !== 3) {
        this.selectCateKeys = [];
        return;
      }
      const {data}=await this.$http.get(`categories/${this.cateId}/attributes`,{params : {sel:this.activeName}});
      if(data.meta.status!==200){
          return this.$message.error(data.meta.msg);
      }
      console.log(data.data);
    },

    tabHandleClick() {
      console.log(this.activeName);
    },
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
</style>