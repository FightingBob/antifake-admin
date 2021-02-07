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
          <!-- <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="批次" clearable />
          </el-form-item> -->
          <el-form-item label="品牌分类：">
            <el-select v-model="listQuery.keyword" placeholder="全部" clearable class="input-width">
              <el-option
                v-for="item in brandList"
                :key="item.id"
                :label="item.name"
                :value="item.preNumber"
              />
            </el-select>
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
        ref="batchTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        border
      >
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="品牌名称" align="center">
          <template slot-scope="scope">{{ scope.row.firstNumber | formatBrandName(brandList) }}</template>
        </el-table-column>
        <el-table-column label="需求量" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.demand }} 个</template>
        </el-table-column>
        <el-table-column label="防伪码前缀" align="center">
          <template slot-scope="scope">{{ scope.row.preThreeNumber }}</template>
        </el-table-column>
        <el-table-column label="添加时间" width="160" align="center">
          <template slot-scope="scope">{{ scope.row.createTime | formatDateTime }}</template>
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
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.encryptCodeSufUrl != null && scope.row.encryptCodeSufUrl != undefined"
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
              v-if="scope.row.encryptCodeSufUrl != null && scope.row.encryptCodeSufUrl != undefined"
              size="mini"
              type="text"
              @click="handleDeleteFile(scope.$index, scope.row)"
            >删除文件
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
      :title="isEdit?'编辑批次':'添加批次'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="batchForm"
        :model="batchParam"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="需求量：" prop="demand">
          <el-input v-model.number="batchParam.demand" style="width: 250px" />
        </el-form-item>
        <el-form-item label="防伪品牌：" prop="firstNumber">
          <el-select v-model="batchParam.firstNumber" placeholder="请选择品牌:" clearable class="input-width">
            <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="item.name"
              :value="item.preNumber"
            />
          </el-select>
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
import { batchList, createFile, createFwBatch, deleteFwBatch, updateStatus, deleteTxtFile } from '@/api/fwBatch'
import { fetchList } from '@/api/identificationBrand'
import { getIp } from '@/utils/IPUtil'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null,
  brandId: null
}
const defaultBatchParam = {
  firstNumber: null,
  demand: null
}
export default {
  name: 'Batch',
  filters: {
    formatDateTime(time) {
      if (time == null || time === '') {
        return 'N/A'
      }
      return time
    },
    formatBrandName(firstNumber, brandList) {
      let brandName = ''
      if (brandList == null) {
        return '-'
      }
      brandList.forEach((item) => {
        if (item.preNumber == firstNumber) {
          brandName = item.name
        }
      })
      return brandName
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
      ipAddress: null,
      preNumber: null,
      batchParam: Object.assign({}, defaultBatchParam),
      rules: {
        demand: [
          { required: true, message: '数量不能为空' },
          { type: 'number', min: 1, trigger: ['blur', 'change'], message: '数量不能为空' }
        ],
        firstNumber: [
          { required: true, message: '防伪品牌不能为空' }
          // { type: 'number', min: 1, max: 9, message: '请在1-9内进行选择', trigger: ['blur'] }
        ]
      },
      brandList: null
    }
  },
  watch: {
    ipAddress() {
      var tempwindow = window.open('_blank')
      tempwindow.location = this.ipAddress
      // window.open(this.ipAddress, '_blank')
    }
  },
  created() {
    this.getList()
    this.getBrandList()
  },
  mounted() {
    this.getParams()
  },
  methods: {
    handleSizeChange(val) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.getList()
    },
    getBrandList() {
      fetchList().then(response => {
        this.brandList = response.data.list
      })
    },
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
      batchList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    handleAdd() {
      this.dialogVisible = true
      this.isEdit = false
      this.batchParam = Object.assign({}, defaultBatchParam)
    },
    exportSerialNumber(index, row) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (row.encryptCodeSufUrl === null || row.encryptCodeSufUrl === undefined) {
        const message = '请先生成文件，再导出'
        loading.close()
        const type = 'error'
        this.tips(message, type)
      } else {
        getIp().then(response => {
          console.log(window.location.host)
          // this.ipAddress = 'http://' + response.data + ':8666/batch/export?batchId=' + row.id + '&code=' + row.encryptCodeSufUrl
          // this.ipAddress = 'https://laikou-cn.wesheda.com/' + 'prod-api/batch/export?batchId=' + row.id + '&code=' + row.encryptCodeSufUrl
          this.ipAddress = 'https://' + window.location.host + '/prod-api/batch/export?batchId=' + row.id + '&code=' + row.encryptCodeSufUrl
          // window.open('http://' + this.ipAddress + ':8666/batch/export?batchId=' + row.id + '&code=' + row.encryptCodeSufUrl, '_blank')
          loading.close()
        })
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
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (row.encryptCodeSufUrl !== null && row.encryptCodeSufUrl !== undefined) {
        loading.close()
        const message = '已生成文件，直接导出即可'
        const type = 'error'
        this.tips(message, type)
      } else {
        const params = {
          batchId: row.id
        }
        createFile(params).then(response => {
          loading.close()
          const message = '正在生成文件，请稍后'
          const type = 'success'
          this.tips(message, type)
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
          batchId: row.id
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
    handleDeleteFile(index, row) {
      this.$confirm('是否要删除该批次生成的文件？【不会删除防伪码】', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          batchId: row.id
        }
        deleteTxtFile(params).then(response => {
          this.$message({
            type: 'success',
            message: '删除文件成功!'
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
              this.addFwBatch(this.batchParam)
            } else {
              this.$message.error('请填写正确再提交')
            }
          })
        }
      })
    },
    addFwBatch(batchParam) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      createFwBatch(batchParam).then(response => {
        const message = '后台正在生成防伪码，请稍候！'
        const type = 'success'
        this.tips(message, type)
        this.dialogVisible = false
        loading.close()
        this.getList()
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
    }
  }
}
</script>
