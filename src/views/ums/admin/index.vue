<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search" />
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          size="small"
          @click="handleSearchList"
        >
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          size="small"
          @click="handleResetSearch"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="帐号/姓名" clearable />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" style="margin-left: 20px" @click="handleAdd()">添加</el-button>
      <el-button size="mini" class="btn-add" style="margin-left: 20px" @click="importExcel">导入</el-button>
    </el-card>
    <div class="table-container">
      <export-excel
        :theader="exportExcel.tHeader"
        :filterval="exportExcel.filterVal"
        :list="exportExcel.listData"
        style="margin-top: 15px"
      />
      <el-table
        ref="adminTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        border
      >
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="帐号" align="center">
          <template slot-scope="scope">{{ scope.row.username }}</template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">{{ scope.row.nickname }}</template>
        </el-table-column>
        <el-table-column label="手机" align="center">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template slot-scope="scope">{{ scope.row.email }}</template>
        </el-table-column>
        <el-table-column label="备注" align="center">
          <template slot-scope="scope">{{ scope.row.note }}</template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.createTime | formatDateTime }}</template>
        </el-table-column>
        <el-table-column label="最后登录" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.loginTime | formatDateTime }}</template>
        </el-table-column>
        <el-table-column label="是否启用" width="140" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleSelectRole(scope.$index, scope.row)"
            >分配角色
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handelResetPassword(scope.$index, scope.row)"
            >
              重置密码
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :page-sizes="[10,15,20]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog
      :title="isEdit?'编辑用户':'添加用户'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="adminForm"
        :model="admin"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="帐号：" prop="username">
          <el-input v-model="admin.username" style="width: 250px" />
        </el-form-item>
        <el-form-item label="姓名：" prop="nickname">
          <el-input v-model="admin.nickname" style="width: 250px" />
        </el-form-item>
        <el-form-item label="手机：" prop="phone">
          <el-input v-model="admin.phone" style="width: 250px" />
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="admin.email" style="width: 250px" />
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="admin.password" type="password" style="width: 250px" />
        </el-form-item>
        <el-form-item label="备注：" prop="note">
          <el-input
            v-model="admin.note"
            type="textarea"
            :rows="5"
            style="width: 250px"
          />
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="admin.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('adminForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="allocDialogVisible"
      width="30%"
    >
      <el-select v-model="allocRoleIds" multiple placeholder="请选择" size="small" style="width: 80%">
        <el-option
          v-for="item in allRoleList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="allocDialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleAllocDialogConfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList, createAdmin, updateStatus, deleteAdmin, getRoleByAdmin, allocRole, exportList, resetPassword } from '@/api/user'
import { fetchAllRoleList } from '@/api/role'
import ExportExcel from '@/components/ExportExcel'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
}
const defaultAdmin = {
  id: null,
  username: null,
  password: null,
  phone: null,
  nickName: null,
  email: null,
  note: null,
  status: 1
}
export default {
  name: 'AdminList',
  components: { ExportExcel },
  filters: {
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      return time
    }
  },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      admin: Object.assign({}, defaultAdmin),
      listLoading: false,
      list: null,
      excelList: null,
      total: null,
      dialogVisible: false,
      isEdit: false,
      allocDialogVisible: false,
      allocDialogVisible2: false,
      allocRoleIds: [],
      allRoleList: [],
      allocAdminId: null,
      rules: {
        username: [
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ],
        nickname: [
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: '手机号格式不对',
            trigger: 'blur'
          }

        ],
        note: [
          { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
        ]
      },
      downloadLoading: false,
      exportExcel: {
        parentId: 0,
        tHeader: null,
        filterVal: null,
        listData: null
      }
    }
  },
  created() {
    this.getList()
    this.getAllRoleList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
      exportList(this.listQuery).then(response => {
        this.excelList = response.data
        this.setExcelData()
      })
    },
    importExcel() {
      this.$router.push('/ums/importAdmin')
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAdmin(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      })
    },
    handelResetPassword(index, row) {
      this.$confirm('是否要重置该用户的密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPassword(row.id).then(response => {
          this.$message({
            type: 'success',
            message: '重置成功!'
          })
          this.getList()
        })
      })
    },
    handleAllocDialogConfirm() {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = new URLSearchParams()
        params.append('adminId', this.allocAdminId)
        params.append('roleIds', this.allocRoleIds)
        allocRole(params).then(response => {
          this.$message({
            message: '分配成功！',
            type: 'success'
          })
          this.allocDialogVisible = false
          this.$router.go(0)
        })
      })
    },
    getRoleListByAdmin(adminId) {
      getRoleByAdmin(adminId).then(response => {
        const allocRoleList = response.data
        this.allocRoleIds = []
        if (allocRoleList != null && allocRoleList.length > 0) {
          for (let i = 0; i < allocRoleList.length; i++) {
            this.allocRoleIds.push(allocRoleList[i].id)
          }
        }
      })
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleSelectRole(index, row) {
      this.allocAdminId = row.id
      this.allocDialogVisible = true
      this.getRoleListByAdmin(row.id)
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
      this.getList()
    },
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.admin = Object.assign({}, defaultAdmin)
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    handleDialogConfirm(formName) {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          console.log('编辑用户')
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.register(this.admin)
            } else {
              this.$message.error('请填写正确再提交')
            }
          })
        }
      })
    },
    handleStatusChange(index, row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(row.id, { status: row.status }).then(response => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        })
        this.$router.go(0)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        })
        this.getList()
      })
    },
    register(admin) {
      createAdmin(this.admin).then(response => {
        const message = '添加成功'
        const type = 'success'
        this.tips(message, type)
        this.dialogVisible = false
        this.getList()
      })
    },
    getAllRoleList() {
      fetchAllRoleList().then(response => {
        this.allRoleList = response.data
      })
    },
    setExcelData() {
      this.exportExcel.listData = this.excelList
      this.exportExcel.tHeader = ['编号', '账号', '姓名', '手机', '邮箱', '备注', '添加时间', '最后登录']
      this.exportExcel.filterVal = ['id', 'username', 'nickname', 'phone', 'email', 'note', 'createTime', 'loginTime']
    },
    tips(message, type) {
      this.$message({
        message,
        type,
        duration: 1000
      })
    }
  }
}
</script>

