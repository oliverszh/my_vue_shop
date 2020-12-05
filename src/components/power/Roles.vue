<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolesList" border stripe>
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', index === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item, index) in scope.row.children"
              :key="item.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item.id)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>

              <el-col :span="19">
                <el-row
                  :class="[index1 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item1, index1) in item.children"
                  :key="item1.id"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item1.id)"
                      type="success"
                      >{{ item1.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      type="warning"
                      v-for="item2 in item1.children"
                      :key="item2.id"
                      >{{ item2.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              type="warning"
              size="mini"
              icon="el-icon-setting"
              @click="setRights(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      width="30%"
      @close="setRightDialogClosed"
    >
      <!-- 权限树 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox default-expand-all node-key="id" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      setRightsDialogVisible: false,
      rightsList: [],
      treeProps: {
        children: "children",
        label: "authName",
      },
      defKeys : [],
      roleId : ""
    };
  },
  created() {
    this.getAllRolesList();
  },
  methods: {
    async getAllRolesList() {
      const { data } = await this.$http.get("roles");
      if (data.meta.status !== 200) {
        return this.$message.error(data.meta.msg);
      }
      this.rolesList = data.data;
      console.log(data.data);
    },
    async removeRightById(role, rightId) {
      var confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult === "cancel") {
        this.$message.info("取消删除");
      }
      const { data } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (data.meta.status !== 200) {
        this.$message.erro("删除失败");
      }
      //this.getAllRolesList();
      role.children = data.data;
    },
    async setRights(role) {
      this.roleId=role.id;
      const { data } = await this.$http.get("rights/tree");
      if (data.meta.status !== 200) {
        return this.$message.error(data.meta.msg);
      }
      this.rightsList = data.data;
      //console.log(this.rightsList);
      this.getLeafKeys(role,this.defKeys);//该角色下的所有子权限
      this.setRightsDialogVisible = true;
    },
    getLeafKeys(node,arr){
      if(!node.children){
        return arr.push(node.id);
      }
      //递归获取所有的子权限
      node.children.forEach(item => {
        this.getLeafKeys(item,arr);
      });
      console.log(this.defKeys)
    },
    setRightDialogClosed(){
      this.defKeys=[];
    },
    async allotRights(){
      const keys=[
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const strKeys=keys.join(",");
      const {data} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:strKeys})
      if(data.meta.status!==200){
        return this.$message.error(data.meta.msg);
      }
      this.$message.success("分配权限成功!");
      this.setRightsDialogVisible=false;
      this.getAllRolesList();
    }
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>