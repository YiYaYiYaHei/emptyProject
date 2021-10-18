<template>
  <div class="user-manage-container full">
    <el-button @click="addOrEditUser.type = 'add';addOrEditUser.nodeId = +new Date()" type="primary" class="mgb20">新 增</el-button>
    <base-table ref="table"
                :tableData="tableData"
                :pagingData="pagingData"
                @sizeChange="pagingEvent"
                @currentChange="pagingEvent"
                @sortChange="sortChangeEvt">
      <template #columnType>
        <el-table-column type="index" :index="rowIndex" width="60" label="序号" align="center"></el-table-column>
      </template>
      <template #otherColumns>
        <el-table-column label="操作" :min-width="120" align="center" fixed="right">
          <template #default="scope">
            <el-button @click="operatorEvt('edit', scope.row)" type="primary" size="small">编 辑</el-button>
            <el-button @click="operatorEvt('delete', scope.row)" type="danger" size="small">删 除</el-button>
          </template>
        </el-table-column>
      </template>
    </base-table>

    <!-- 新增/编辑用户 -->
    <base-dialog ref="addOrEditUser"
                 :title="`${addOrEditUser.type === 'add' ? '新增' : '编辑'}用户`"
                 :dialogId.sync="addOrEditUser.nodeId"
                 @dialogConfirm="submitForm(addOrEditUserEvt, 'addOrEditForm')"
                 @dialogClose="dialogCloseEvt('addOrEditUser', 'addOrEditForm')">
      <el-form :model="addOrEditUser.formData" :rules="addOrEditUser.formRules" ref="addOrEditForm" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-trim v-model="addOrEditUser.formData.userName" maxlength=20 placeholder="请输入用户名" clearable :disabled="addOrEditUser.type === 'edit'" onpaste="return false"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-trim v-model="addOrEditUser.formData.password" v-if="addOrEditUser.type === 'add' || addOrEditUser.isResetPwd" maxlength=20 type="password" placeholder="请输入密码" clearable onpaste="return false"></el-input>
          <el-button v-else type="primary" size="small" @click="addOrEditUser.isResetPwd=true">重 置</el-button>
        </el-form-item>
        <el-form-item  label="确认密码" prop="repeatPassword" v-if="addOrEditUser.type === 'add'">
          <el-input v-trim v-model="addOrEditUser.formData.repeatPassword" maxlength=20 type="password" placeholder="请再次输入密码" clearable onpaste="return false"></el-input>
        </el-form-item>
        <el-form-item label="用户角色">
          <el-select v-model="addOrEditUser.formData.role" placeholder="请选择用户角色" v-if="addOrEditUser.type === 'add'">
            <el-option label="管理员" value="管理员"></el-option>
            <el-option label="普通用户" value="普通用户"></el-option>
          </el-select>
          <el-tag v-else>{{addOrEditUser.formData.role}}</el-tag>
        </el-form-item>
        <el-form-item label="描述" prop="origin">
          <el-input v-trim v-model="addOrEditUser.formData.description" type="textarea" maxlength=250 placeholder="请输入描述" rows=4 resize="none"></el-input>
        </el-form-item>
      </el-form>
    </base-dialog>

    <!-- 删除用户 -->
    <base-dialog ref="deleteUser" title="删除用户" tips="确认删除该用户？" :dialogId.sync="deleteUser.nodeId" @dialogConfirm="deleteUserEvt" @dialogClose="dialogCloseEvt('deleteUser')"></base-dialog>
  </div>
</template>

<script>
import mixins from '@m';
export default {
  name: 'UserManage',
  mixins: [mixins.table, mixins.form],
  data() {
    return {
      tableData: {
        defaultSort: {prop: 'createdTime', order: 'descending'},
        columns: [
          {label: '创建时间', prop: 'createdTime', sortable: true, filter: 'formatDate', filterParam: [], width: 150},
          {label: '用户名', prop: 'userName'},
          {label: '用户角色', prop: 'role', align: 'center'},
          {label: '用户描述', prop: 'describe', align: 'center'}
        ]
      },
      addOrEditUser: {
        type: 'add',
        nodeId: 0,
        isResetPwd: false,
        formData: {
          userName: '',
          password: '',
          repeatPassword: '',
          role: '普通用户',
          description: ''
        },
        formRules: {
          userName: [{required: true, isEdit: false, fieldType: '用户名', validator: this.$validates.userName}],
          password: [{
            trigger: 'blur',
            fieldType: '密码',
            validator: (rule, value, callback) => {
              rule.required = this.addOrEditUser.type === 'add' || this.addOrEditUser.isResetPwd;
              this.$validates.password(rule, value, callback);
            }
          }],
          repeatPassword: [{
            required: true,
            trigger: 'blur',
            fieldType: '确认密码',
            validator: (rule, value, callback) => {
              rule.newPwdRepeat = this.addOrEditUser.formData.password;
              this.$validates.password(rule, value, callback);
            }
          }]
        }
      },
      deleteUser: {
        nodeId: 0,
        data: {}
      }
    };
  },
  methods: {
    getTableData() {
      this.reqTableData(this.$apis.systemManage.getUserTableList);
    },
    // 编辑/删除
    operatorEvt(type, row) {
      switch (type) {
        case 'edit':
          this.addOrEditUser.type = 'edit';
          this.addOrEditUser.nodeId = +new Date();
          this.$nextTick(() => {
            this.addOrEditUser.formData = row;
          });
          break;
        case 'delete':
          this.deleteUser.nodeId = +new Date();
          this.deleteUser.data = row;
          break;
      }
    },
    // 删除用户
    async deleteUserEvt() {
      this.$refs.deleteUser.openLoading();
      const res = await this.$apis.systemManage.deleteUser(this.deleteUser.data.id);
      this.$refs.deleteUser.closeLoading();
      if (res.status === 200) {
        this.$message.success('用户删除成功');
        this.dialogCloseEvt('deleteUser');
        this.refreshTableData();
      } else {
        this.$message.error('用户删除失败');
      }
    },
    // 新增/编辑用户
    async addOrEditUserEvt() {
      this.$refs.addOrEditUser.openLoading();
      const res = await this.$apis.systemManage.addOrEditUser(this.addOrEditUser.formData);
      this.$refs.addOrEditUser.closeLoading();
      if (res.status === 200) {
        this.$message.success(`${this.addOrEditUser.type === 'add' ? '新增' : '编辑'}用户成功`);
        this.dialogCloseEvt('addOrEditUser', 'addOrEditForm');
        if (this.addOrEditUser.type === 'add') {
          this.refreshTableData();
        } else {
          this.getTableData();
        }
      } else {
        this.$message.error(`${this.addOrEditUser.type === 'add' ? '新增' : '编辑'}用户失败`);
      }
    }
  },
  created() {
    this.getTableData();
  }
};
</script>

<style lang="less" scoped>
.base-table-container {
  height: calc(~"100% - 46px");
}
</style>
