<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" style="margin-left: 20px" @click="handleAdd()">添加</el-button>
    </el-card>

    <div class="table-container">
      <el-table
        ref="brandTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        border
      >
        <el-table-column label="关键词" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.code }}</template>
        </el-table-column>
        <el-table-column label="提示" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.codeName }}</template>
        </el-table-column>
        <el-table-column label="内容" align="center">
          <template slot-scope="scope">{{ scope.row.codeValue }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.$index, scope.row)"
            >
              编辑
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

    <el-dialog
      :title="isEdit?'编辑品牌':'添加品牌'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="brandForm"
        :model="fwConfig"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="提示关键词" prop="code">
          <el-input v-model="fwConfig.code" type="textarea" :rows="4" style="width: 250px" />
        </el-form-item>
        <el-form-item label="提示定义" prop="codeName">
          <el-input v-model="fwConfig.codeName" type="textarea" :rows="4" style="width: 250px" />
        </el-form-item>
        <el-form-item label="提示内容" prop="codeValue">
          <el-input v-model.number="fwConfig.codeValue" type="textarea" :rows="4" style="width: 250px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('brandForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { createConfig, fetchList, deleteFwConfig, updateFwConfig } from '@/api/fwConfig'
const defaultConfig = {
  id: null,
  code: null,
  codeName: null,
  codeValue: null
}
export default {
  name: 'Config',
  data() {
    return {
      listLoading: false,
      list: null,
      isEdit: false,
      dialogVisible: false,
      fwConfig: Object.assign({}, defaultConfig),
      rules: {
        code: [
          { required: true, message: '请输入提示关键词，使用英文与下划线', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在2到50个字符之间', trigger: ['blur', 'change'] }
        ],
        codeName: [
          { required: true, message: '请输入提示定义', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在2到100个字符之间', trigger: ['blur', 'change'] }
        ],
        codeValue: [
          { required: true, message: '请输入提示内容', trigger: 'blur' },
          { min: 2, message: '太短', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.fwConfig = Object.assign({}, defaultConfig)
    },
    handleDialogConfirm(formName) {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateFwConfig(this.fwConfig).then(response => {
            const message = '修改成功！'
            const type = 'success'
            this.tips(message, type)
            this.dialogVisible = false
            this.getList()
          })
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.addFwConfig(this.fwConfig)
            } else {
              this.$message.error('请填写正确再提交')
            }
          })
        }
      })
    },
    addFwConfig(data) {
      createConfig(data).then(response => {
        const message = '添加成功'
        const type = 'success'
        this.tips(message, type)
        this.dialogVisible = false
        this.getList()
      })
    },
    getList() {
      this.listLoading = true
      fetchList().then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该提示?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          fwConfigId: row.id
        }
        deleteFwConfig(params).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      })
    },
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.fwConfig = Object.assign({}, row)
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
