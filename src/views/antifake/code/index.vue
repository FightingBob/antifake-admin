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
          @click="handleSearchList('searchParam')"
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
        <el-form ref="searchParam" :inline="true" size="small" label-width="140px" :rules="searchRules" :model="searchParam">
          <el-form-item label="输入搜索：" prop="code">
            <el-input v-model="searchParam.code" class="input-width" placeholder="防伪码" clearable />
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
            <template slot-scope="scope">{{ scope.row.isReal }}</template>
          </el-table-column>
          <el-table-column label="状态" width="100" align="center">
            <template slot-scope="scope">{{ scope.row.status }}</template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.isReal === '假'"
                size="mini"
                type="text"
                @click="handleAdd(scope.$index, scope.row)"
              >加入防伪库
              </el-button>
              <el-button
                v-if="scope.row.isReal === '真' && scope.row.status === '无效'"
                size="mini"
                type="text"
                @click="handleUpdate(scope.$index, scope.row)"
              >改为有效状态
              </el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="isEdit?'编辑防伪码':'添加防伪码'"
      :visible.sync="dialogVisible"
      width="40%"
    >
      <el-form
        ref="codeParam"
        :model="codeParam"
        label-width="150px"
        size="small"
        :rules="rules"
      >
        <el-form-item label="防伪码：" prop="serialNumber">
          <el-input v-model.number="codeParam.serialNumber" style="width: 250px" disabled />
        </el-form-item>
        <el-form-item label="防伪品牌：" prop="brandId">
          <el-select v-model="codeParam.brandId" placeholder="请选择品牌:" clearable class="input-width">
            <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" size="small" @click="handleDialogConfirm('codeParam')">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
const defaultSearchParam = {
  code: null
}
const defaultCodeParam = {
  serialNumber: null,
  brandId: null
}
import { queryCode, list, clearCode, addNewCode } from '@/api/fwCode'
import { fetchList } from '@/api/identificationBrand'
export default {
  name: 'Code',
  data() {
    return {
      code: null,
      listLoading: false,
      list: null,
      list1: null,
      isEdit: false,
      dialogVisible: false,
      rules: {
        serialNumber: [
          { required: true, message: '防伪码不能为空' }
        ],
        brandId: [
          { required: true, message: '防伪品牌不能为空' }
          // { type: 'number', min: 1, max: 9, message: '请在1-9内进行选择', trigger: ['blur'] }
        ]
      },
      searchParam: Object.assign({}, defaultSearchParam),
      codeParam: Object.assign({}, defaultCodeParam),
      brandList: null,
      searchRules: {
        code: [
          { required: true, message: '防伪码不能为空' },
          {
            pattern: /^[0-9]{15}$/,
            message: '防伪码必须是长度为15全数字的编码串',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    code() {
      this.list1 = null
    }
  },
  methods: {
    getBrandList() {
      fetchList().then(response => {
        this.brandList = response.data.list
      })
    },
    handleSearchList(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.query()
        } else {
          this.$message.error('请填写正确再提交')
        }
      })
    },
    query() {
      const params = {
        code: this.searchParam.code
      }
      queryCode(params).then(response => {
        if (response.data !== null && response.data !== undefined) {
          this.list1 = response.data.list
          this.$notify.info({
            title: '消息',
            offset: 100,
            duration: 10000,
            message: this.list1[0].result
          })
        } else {
          this.list1 = null
        }
      })
    },
    handleResetSearch() {
      this.searchParam = Object.assign({}, defaultSearchParam)
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
    handleUpdate(index, row) {
      this.$confirm('改为有效状态', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          serialNumber: row.serialNumber,
          status: row.status === '有效' ? 1 : 0,
          isReal: row.isReal === '真' ? 1 : 0
        }
        clearCode(data).then(response => {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.$router.go(0)
          // this.getList()
        })
      })
    },
    handleAdd(index, row) {
      this.dialogVisible = true
      this.isEdit = false
      this.codeParam = Object.assign({}, defaultCodeParam)
      this.codeParam.serialNumber = row.serialNumber
      this.getBrandList()
    },
    handleDialogConfirm(formName) {
      this.$confirm('是否要添加?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if (this.isEdit) {
          console.log('编辑防伪码')
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.addCode(this.codeParam)
            } else {
              this.$message.error('请填写正确再提交')
            }
          })
        }
      })
    },
    addCode(codeParam) {
      addNewCode(codeParam).then(response => {
        this.$message({
          type: 'success',
          message: '添加成功!'
        })
        this.$router.go(0)
      })
    }
  }
}
</script>
