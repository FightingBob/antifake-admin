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
            <el-input v-model="listQuery.keyword" class="input-width" placeholder="物资编号" clearable />
          </el-form-item>
        </el-form>
      </div>
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
        <el-table-column label="领取日期" width="180" align="center">
          <template slot-scope="scope">{{ scope.row.drawTime }}</template>
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
      </el-table>
    </div>
  </div>

</template>
<script>
import ExportExcel from '@/components/ExportExcel'
import { recordList } from '@/api/supplies'
const defaultListQuery = {
  pageNum: 1,
  pageSize: 10,
  keyword: null
}
export default {
  name: 'RecordList',
  components: { ExportExcel },
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      list: null,
      listLoading: false,
      exportExcel: {
        parentId: 0,
        tHeader: null,
        filterVal: null,
        listData: null
      },
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
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
      this.getList()
    },
    handleSearchList() {
      this.listQuery.pageNum = 1
      this.getList()
    },
    getList() {
      recordList(this.listQuery).then(response => {
        this.listLoading = false
        this.list = response.data
        this.setExcelData()
      })
    },
    setExcelData() {
      if (this.list.length === 0) {
        this.exportExcel.listData = this.demoList
      } else {
        this.exportExcel.listData = this.list
      }
      this.exportExcel.tHeader = ['领取日期', '物资编号', '使用部门', '使用人', '使用状态', '类别名称', '配置信息', '采购价格']
      this.exportExcel.filterVal = ['drawTime', 'serialNumber', 'departmentName', 'nickname', 'status', 'typeName', 'description', 'price']
    }
  }
}
</script>
