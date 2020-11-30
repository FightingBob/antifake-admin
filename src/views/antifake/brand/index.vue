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
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="品牌名称" clearable />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
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
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column label="名称" align="center">
          <template slot-scope="scope">{{ scope.row.brandCode }}</template>
        </el-table-column>
        <el-table-column label="防伪码前缀" align="center">
          <template slot-scope="scope">{{ scope.row.preNumber }}</template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.createTime | formatDateTime }}</template>
        </el-table-column>
        <el-table-column label="修改时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.createTime | formatDateTime }}</template>
        </el-table-column>
        <el-table-column label="是否启用" width="140" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              :active-value="true"
              :inactive-value="false"
              @change="handleStatusChange(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template v-if="scope.row.enabled" slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleBatch(scope.$index, scope.row)"
            >批次管理
            </el-button>
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
      :title="isEdit?'编辑品牌':'添加品牌'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="brandForm"
        :model="fwBrand"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="品牌名称：" prop="name">
          <el-input v-model="fwBrand.name" style="width: 250px" />
        </el-form-item>
        <el-form-item label="品牌代号：" prop="name">
          <el-input v-model="fwBrand.brandCode" style="width: 250px" />
        </el-form-item>
        <el-form-item label="防伪码前缀：" prop="preNumber">
          <el-input v-model.number="fwBrand.preNumber" style="width: 250px" />
        </el-form-item>
        <el-form-item label="是否启用：">
          <el-radio-group v-model="fwBrand.enabled">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
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
import { fetchList, createFwBrand, deleteFwBrand, updateStatus, updateFwBrand } from '@/api/fwBrand'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
}
const defaultFwBrand = {
  id: null,
  name: null,
  preNumber: null,
  enabled: true
}
export default {
  name: 'Brand',
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
      listLoading: false,
      list: null,
      total: null,
      dialogVisible: false,
      isEdit: false,
      fwBrand: Object.assign({}, defaultFwBrand),
      rules: {
        name: [
          { min: 2, max: 15, message: '长度在2到15个字符之间', trigger: 'blur' }
        ],
        preNumber: [
          { required: true, message: '前缀不能为空' },
          { required: true, message: '请在1-9内进行选择', pattern: /^\d{1}$/ }
          // { type: 'number', min: 1, max: 9, message: '请在1-9内进行选择', trigger: ['blur'] }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
      this.getList()
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
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
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.fwBrand = Object.assign({}, defaultFwBrand)
    },
    handleUpdate(index, row) {
      this.dialogVisible = true
      this.isEdit = true
      this.fwBrand = Object.assign({}, row)
    },
    handleBatch(index, row) {
      this.$router.push({
        path: '/antifake/batch',
        name: 'batch',
        query: {
          brandId: row.id,
          brandName: row.name,
          preNumber: row.preNumber
        }
      })
    },
    handleDialogConfirm(formName) {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          updateFwBrand(this.fwBrand.id, this.fwBrand).then(response => {
            const message = '修改成功！'
            const type = 'success'
            this.tips(message, type)
            this.dialogVisible = false
            this.getList()
          })
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.addFwBrand(this.fwBrand)
            } else {
              this.$message.error('请填写正确再提交')
            }
          })
        }
      })
    },
    addFwBrand(fwBrand) {
      // fwBrand.preNumber += ''
      createFwBrand(fwBrand).then(response => {
        const message = '添加成功'
        const type = 'success'
        this.tips(message, type)
        this.dialogVisible = false
        this.getList()
      })
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该批次，也会删除旗下的所有防伪码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          fwBrandId: row.id
        }
        deleteFwBrand(params).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      })
    },
    handleStatusChange(index, row) {
      this.$confirm('是否要修改该状态?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatus(row.id, { enabled: row.enabled }).then(response => {
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
