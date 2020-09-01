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
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="物资编号/使用人" clearable />
          </el-form-item>
          <el-form-item label="使用状态：">
            <el-select v-model="listQuery.statusOption" placeholder="默认选择全部" clearable class="input-width">
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets" />
      <span>数据列表</span>
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
        <el-table-column label="采购日期" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.purchaseTime }}</template>
        </el-table-column>
        <el-table-column label="物资编号" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.serialNumber }}</template>
        </el-table-column>
        <el-table-column label="使用部门" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.departmentName }}</template>
        </el-table-column>
        <el-table-column label="使用人" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.nickname }}</template>
        </el-table-column>
        <el-table-column label="使用状态" width="150" align="center">
          <template slot-scope="scope">{{ scope.row.status }}</template>
        </el-table-column>
        <el-table-column label="类别名称" width="200" align="center">
          <template slot-scope="scope">{{ scope.row.typeName }}</template>
        </el-table-column>
        <el-table-column label="配置信息" align="center">
          <template slot-scope="scope">{{ scope.row.description }}</template>
        </el-table-column>
        <el-table-column label="采购价格" width="100" align="center">
          <template slot-scope="scope">{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              type="text"
              @click="handleUpdate(scope.$index, scope.row)"
            >
              编辑
            </el-button> -->
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
  </div>

</template>
<script>
import ExportExcel from '@/components/ExportExcel'
import { suppliesList, deleteSupplies, suppliesListByPagination } from '@/api/supplies'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null,
  statusOption: -1
}
export default {
  name: 'SuppliesList',
  components: { ExportExcel },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      excelList: null,
      total: null,
      listLoading: false,
      exportExcel: {
        parentId: 0,
        tHeader: null,
        filterVal: null,
        listData: null
      },
      statusOptions: [
        {
          value: -1,
          label: '全部'
        },
        {
          value: 0,
          label: '闲置'
        },
        {
          value: 1,
          label: '使用中'
        },
        {
          value: 2,
          label: '报废'
        },
        {
          value: 3,
          label: '维修中'
        },
        {
          value: 4,
          label: '转赠'
        }
      ],
      demoList: [
        {
          departmentId: 1,
          departmentName: '人资行政中心',
          nickname: '王荣廷',
          price: '180',
          purchaseTime: '2017-01-02',
          serialNumber: 'BG283',
          status: '在用',
          suppliesId: 1,
          typeName: '三层文件柜',
          userId: 202
        }
      ]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
      this.getList()
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    importExcel() {
      this.$router.push('/supplies/importSupplies')
    },
    getList() {
      suppliesList(this.listQuery).then(response => {
        this.listLoading = false
        this.excelList = response.data
        this.setExcelData()
      })
      suppliesListByPagination(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data.list
        this.total = response.data.total
      })
    },
    handleDelete(index, row) {
      this.$confirm('是否要删除该物资?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteSupplies(row.suppliesId).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
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
    setExcelData() {
      if (this.excelList.length === 0) {
        this.exportExcel.listData = this.demoList
      } else {
        this.exportExcel.listData = this.excelList
      }
      this.exportExcel.tHeader = ['采购日期', '物资编号', '使用部门', '使用人', '使用状态', '类别名称', '配置信息', '采购价格']
      this.exportExcel.filterVal = ['purchaseTime', 'serialNumber', 'departmentName', 'nickname', 'status', 'typeName', 'description', 'price']
    }
  }
}
</script>
