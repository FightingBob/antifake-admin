<template>
  <div class="app-container">
    <upload @parentFuction="getList" />
    <el-button v-if="list != null && list.tableData.length > 0" class="btn-save" type="primary" icon="el-icon-document" @click="save">
      保存
    </el-button>
  </div>
</template>
<script>
import Upload from '@/components/UploadExcel/upload'
import { batchSuppliesInsert } from '@/api/supplies'
export default {
  name: 'ImportSupplies',
  components: { Upload },
  data() {
    return {
      list: null
    }
  },
  methods: {
    getList(list) {
      this.list = list
    },
    setData() {
      const list = this.list.tableData
      return list.map((item) => {
        const admin = {}
        admin.purchaseTime = item.采购日期
        admin.serialNumber = item.物资编号
        admin.departmentName = item.使用部门
        admin.nickname = item.使用人
        admin.status = item.使用状态
        admin.typeName = item.类别名称
        admin.description = item.配置信息
        admin.price = item.采购价格
        return admin
      })
    },
    save() {
      const data = this.setData()
      // console.log(data)
      batchSuppliesInsert(data).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
      })
    }
  }
}
</script>
<style scoped>
.btn-save {
  margin: 15px 0px;
  float: right;
}
</style>
