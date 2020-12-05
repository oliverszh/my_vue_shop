<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区  -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            v-model="queryInfo.query"
            placeholder="请输入内容"
            clearable
            @clear="getAllUsers"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getAllUsers"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4"
          ><el-button type="primary" @click="addUserFormVisible = true"
            >添加用户</el-button
          ></el-col
        >
      </el-row>

      <el-table style="width: 100%" :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialogue(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserFormVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addUserForm"
        :rules="addUserRules"
        ref="addUserFormRef"
        label-width="100px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addUserFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="40%"
      @close="editDialogClose"
    >
      <el-form
        :model="editUserForm"
        :rules="editUserFormRules"
        ref="editUserFormRef"
        label-width="70px"
      >
        <el-form-item label="用戶名">
          <el-input v-model="editUserForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户:{{ userInfo.username }}</p>
        <p>当前的角色:{{ userInfo.role_name }}</p>
        <p>分配新角色：
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.role_name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //自定义邮箱严重规则
    var checkEmail = (rule, value, cb) => {
      const regEail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (regEail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱!"));
    };

    var checkMobile = (rule, value, cb) => {
      const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号!"));
    };

    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
      addUserFormVisible: false,
      addUserForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 12,
            message: "用户名长度在 3 到 12 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "密码长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      editDialogVisible: false,
      editUserForm: {},
      editUserFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      userInfo: {},
      rolesList: [],
      selectRoleId: "",
      setRoleDialogVisible: false,
    };
  },
  created() {
    this.getAllUsers();
  },
  methods: {
    async getAllUsers() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("获取用户数据失败");
      this.userList = res.data.users;
      this.total = res.data.total;
      // console.log(this.userList);
    },
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      this.getAllUsers();
    },
    handleCurrentChange(pageindex) {
      this.queryInfo.pagenum = pageindex;
      this.getAllUsers();
    },
    async userStateChange(userinfo) {
      const { data } = await this.$http.put(
        `/users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (data.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败！");
      }
      this.$message.success("更新用户状态成功！");
    },
    addDialogClose() {
      this.$refs.addUserFormRef.resetFields();
    },
    addUser() {
      this.$refs.addUserFormRef.validate(async (valid) => {
        if (!valid) {
          this.addUserFormVisible = false;
          return;
        }
        const { data } = await this.$http.post("users", this.addUserForm);
        if (data.meta.status !== 201) {
          this.$message.error("添加用户失败");
        } else {
          this.$message.success("添加用户成功");
          this.getAllUsers();
        }
        this.addUserFormVisible = false;
      });
    },
    async showEditDialogue(id) {
      this.editDialogVisible = true;
      const { data } = await this.$http.get("users/" + id);
      if (data.meta.status !== 200) {
        this.$message.error("查询用户信息失败");
        return;
      }
      this.editUserForm = data.data;
    },
    editDialogClose() {
      this.$refs.editUserFormRef.resetFields();
    },
    editUser() {
      this.$refs.editUserFormRef.validate(async (valid) => {
        if (!valid) return;
        const { data } = await this.$http.put(`users/${this.editUserForm.id}`, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile,
        });
        console.log(data);
        if (data.meta.status !== 200) {
          this.$message.error("修改用户信息失败!");
          return;
        }
        this.$message.success("修改用户信息成功!");
        this.editDialogVisible = false;
        this.getAllUsers();
      });
    },
    async deleteUser(id) {
      var res = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((res) => res);
      if (res === "cancel") return;

      //处理删除的逻辑
      const { data } = await this.$http.delete(`users/${id}`);
      if (data.meta.status !== 200) {
        this.$message.error("删除失败");
        return;
      }
      this.$message.success("删除成功！");
      this.getAllUsers();
    },
    async setRole(userInfo) {
      const { data } = await this.$http.get("roles");
      if (data.meta.status !== 200) {
        return this.$message.error(data.meta.msg);
      }
      this.rolesList = data.data;
      this.userInfo = userInfo;
      this.setRoleDialogVisible = true;
    },
    async saveRoleInfo(){
     if(!this.selectRoleId) {
       return this.$message.error("请选择要分配的角色!");
     }
     const {data}=await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectRoleId});
     if(data.meta.status!==200){
       return this.$message.error(data.meta.msg);
     }
     this.$message.success("分配角色成功!");
     this.getAllUsers();
     this.setRoleDialogVisible=false;
     console.log(this.setRoleDialogVisible);
    },
    setRoleDialogClosed(){
      this.selectRoleId="";
      this.userInfo={}
    }
  },
};
</script>

<style lang="less" scoped>
</style>