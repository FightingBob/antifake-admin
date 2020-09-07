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
        ref="adminTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        border
      >
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="批次" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.midNumber }}</template>
        </el-table-column>
        <el-table-column label="品牌名称" align="center">
          <template>{{ brandName }}</template>
        </el-table-column>
        <el-table-column label="需求量" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.demand }} 个</template>
        </el-table-column>
        <el-table-column label="有效时间" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.expirationTime }} 年</template>
        </el-table-column>
        <el-table-column label="防伪码前缀" align="center">
          <template>{{ preNumber }}</template>
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
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.encrptCodeSufUrl != null && scope.row.encrptCodeSufUrl != undefined"
              size="mini"
              type="text"
              @click="exportSerialNumber(scope.$index, scope.row)"
            >导出防伪码
            </el-button>
            <el-button
              v-else
              size="mini"
              type="text"
              @click="handelCreate(scope.$index, scope.row)"
            >生成文件
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
      :title="isEdit?'编辑批次':'添加批次'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="batchForm"
        :model="fwBatch"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="需求量：" prop="demand">
          <el-input v-model.number="fwBatch.demand" style="width: 250px" />
        </el-form-item>
        <el-form-item label="防伪码总长度：" prop="length">
          <el-input v-model.number="fwBatch.length" style="width: 250px" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('batchForm')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
import { fetchList, createFile, createFwBatch, deleteFwBatch } from '@/api/fwBatch'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null,
  brandId: null
}
const defaultFwBatch = {
  id: null,
  fwBrandId: null,
  demand: null,
  length: null
}
export default {
  name: 'Batch',
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
      brandName: null,
      preNumber: null,
      fwBatch: Object.assign({}, defaultFwBatch),
      rules: {
        demand: [
          { type: 'number', min: 1, trigger: ['blur', 'change'] }
        ],
        preNumber: [
          { type: 'number', max: 2, trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.getParams()
  },
  methods: {
    getParams() {
      this.listQuery.brandId = this.$route.query.brandId
      this.brandName = this.$route.query.brandName
      this.preNumber = this.$route.query.preNumber
    },
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
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.fwBrand = Object.assign({}, defaultFwBatch)
    },
    exportSerialNumber(index, row) {
      if (row.encrptCodeSufUrl === null || row.encrptCodeSufUrl === undefined) {
        const message = '请先生成文件，再导出'
        const type = 'error'
        this.tips(message, type)
      } else {
        window.open('http://localhost:8888/fwBatch/export?fwBatchId=' + row.id + '&code=' + row.encrptCodeSufUrl, '_blank')
      }
    },
    tips(message, type) {
      this.$message({
        message,
        type,
        duration: 1000
      })
    },
    handelCreate(index, row) {
      console.log()
      if (row.encrptCodeSufUrl !== null && row.encrptCodeSufUrl !== undefined) {
        const message = '已生成文件，直接导出即可'
        const type = 'error'
        this.tips(message, type)
      } else {
        const params = {
          fwBatchId: row.id
        }
        createFile(params).then(response => {
          this.$router.go(0)
        })
      }
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该批次，也会删除旗下的所有防伪码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          fwBatchId: row.id
        }
        deleteFwBatch(params).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      })
    },
    handleDialogConfirm(formName) {
      this.$confirm('是否要确认?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          console.log('编辑批次')
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.addFwBatch(this.fwBatch)
            } else {
              this.$message.error('请填写正确再提交')
            }
          })
        }
      })
    },
    addFwBatch(fwBatch) {
      fwBatch.fwBrandId = this.listQuery.brandId
      createFwBatch(fwBatch).then(response => {
        const message = '添加成功'
        const type = 'success'
        this.tips(message, type)
        this.dialogVisible = false
        this.getList()
      })
    }
  }
}
</script>
