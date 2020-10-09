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
        <el-form :inline="true" size="small" label-width="140px">
          <el-form-item label="输入搜索：">
            <el-input v-model="code" class="input-width" placeholder="防伪码" clearable />
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <div v-if="list1 != null" class="table-container">
      <el-table
        ref="codeTable1"
        :data="list1"
        style="width: 100%;"
        border
      >
        <el-table-column label="搜索结果" align="center">
          <el-table-column label="防伪码" align="center">
            <template slot-scope="scope">{{ scope.row.serialNumber }}</template>
          </el-table-column>
          <el-table-column label="真假" width="100" align="center">
            <template slot-scope="scope">{{ scope.row.status }}</template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status === '假'"
                size="mini"
                type="text"
                @click="handleAdd(scope.$index, scope.row)"
              >加入防伪库
              </el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>

    <div class="table-container">
      <el-table
        ref="codeTable"
        v-loading="listLoading"
        :data="list"
        style="width: 100%;"
        height="800"
        border
      >
        <el-table-column label="查询记录【以下都为真实的防伪码，默认识别超过5次失效】" align="center">
          <el-table-column label="编号" width="100" align="center">
            <template slot-scope="scope">{{ scope.row.codeId }}</template>
          </el-table-column>
          <el-table-column label="品牌名称" width="200" align="center">
            <template slot-scope="scope">{{ scope.row.brandName }}</template>
          </el-table-column>
          <el-table-column label="批次" width="100" align="center">
            <template slot-scope="scope">{{ scope.row.midNumber }}</template>
          </el-table-column>
          <el-table-column label="防伪码" align="center">
            <template slot-scope="scope">{{ scope.row.serialNumber }}</template>
          </el-table-column>
          <el-table-column label="查询次数" width="100" align="center">
            <template slot-scope="scope">{{ scope.row.times }}</template>
          </el-table-column>
          <el-table-column label="最新查询时间" width="100" align="center">
            <template slot-scope="scope">{{ scope.row.updateTime }}</template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                @click="handleDelete(scope.$index, scope.row)"
              >次数归零
              </el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>
<script>
import { queryCode, list, deleteCode, addNewCode } from '@/api/fwCode'
export default {
  name: 'Code',
  data() {
    return {
      code: null,
      listLoading: false,
      list: null,
      list1: null
    }
  },
  watch: {
    code() {
      this.list1 = null
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleSearchList() {
      this.query()
    },
    query() {
      const params = {
        code: this.code
      }
      queryCode(params).then(response => {
        if (response.data !== null && response.data !== undefined) {
          this.list1 = response.data.list
        } else {
          this.list1 = null
        }
        this.$notify.info({
          title: '消息',
          offset: 100,
          duration: 10000,
          message: this.list1[0].result
        })
        this.getList()
      })
    },
    handleResetSearch() {
      this.getList()
    },
    getList() {
      this.listLoading = true
      list().then(response => {
        this.listLoading = false
        if (response.data !== null && response.data !== undefined) {
          this.list = response.data.list
        } else {
          this.list = null
        }
      })
    },
    handleDelete(index, row) {
      this.$confirm('是否要清零掉防伪码识别次数', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          code: row.serialNumber
        }
        deleteCode(params).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      })
    },
    handleAdd(index, row) {
      this.$confirm('是否要添加这个防伪码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          code: row.serialNumber
        }
        addNewCode(params).then(response => {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.getList()
        })
      })
    }
  }
}
</script>
