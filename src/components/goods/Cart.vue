<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <!-- 添加商品 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>

      <!-- 商品表格区 -->
      <tree-table
        class="treeTable"
        :data="cateList"
        :columns="columns"
        border
        :show-row-hover="false"
        :selection-type="false"
        show-index
        :expand-type="false"
      >
        <!-- 是否有效 -->
        <template v-slot:isok="scope">
          <i
            class="el-icon-check"
            v-if="!scope.row.cat_deleted"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-close" v-else style="color: lightgreen"></i>
        </template>

        <!-- 是否排序 -->
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            type="success"
            size="mini"
            >二级</el-tag
          >
          <el-tag v-else type="warning" size="mini">三级</el-tag>
        </template>

        <!-- 操作 -->
        <template v-slot:opt>
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCartDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="addCartForm"
        :rules="addCartFormRules"
        ref="addCartFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCartForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="cascadarProps"
            @change="parentCateChanged"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCartDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCart">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          //表示，将当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "isok",
        },
        {
          label: "排序",
          //表示，将当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "order",
        },
        {
          label: "操作",
          //表示，将当前列定义为模板列
          type: "template",
          //表示当前这一列使用模板名称
          template: "opt",
        },
      ],
      addCartDialogVisible: false,
      addCartForm: {
        //将要添加分类的名称
        cat_name: "",
        //父级分类的Id
        cat_pid: 0,
        //分类的等级，默认要添加的是1级分类
        cat_level: 0,
      },
      addCartFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      parentCateList: [],
      cascadarProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
        checkStrictly: true,
      },
      selectKeys: [],
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (data.meta.status !== 200) {
        return this.$message.error(data.meta.msg);
      }
      this.cateList = data.data.result;
      this.total = data.data.total;
      console.log(this.cateList);
    },
    //监听pageSize改变
    handleSizeChange(newpageSize) {
      this.queryInfo.pagesize = newpageSize;
      this.getCateList();
    },
    //监听pagenum改变
    handleCurrentChange(newpageNum) {
      this.queryInfo.pagenum = newpageNum;
      this.getCateList();
    },
    showAddCateDialog() {
      this.getPartentCateList();
      this.addCartDialogVisible = true;
    },
    async getPartentCateList() {
      const { data } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (data.meta.status !== 200) {
        return this.$message.error(data.meta.msg);
      }
      this.parentCateList = data.data;
      //console.log(this.parentCateList);
    },
    parentCateChanged() {
      if (this.selectKeys.length > 0) {
        this.addCartForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
        this.addCartForm.cat_level = this.selectKeys.length;
        return;
      } else {
        this.addCartForm.cat_pid = 0;
        this.addCartForm.cat_level = 0;
      }
      //console.log(this.selectKeys);
    },
    addCateDialogClosed() {
      this.$refs.addCartFormRef.resetFields();
      this.selectKeys = [];
      this.addCartForm.cat_level = 0;
      this.addCartForm.cat_pid = 0;
    },
    addCart() {
      this.$refs.addCartFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data } = await this.$http.post("categories", this.addCartForm);
        if (data.meta.status !== 201) {
          return this.$message.error(data.meta.msg);
        }
        this.$message.success("添加分类成功!");
        this.getCateList();
        this.addCartDialogVisible = false;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>