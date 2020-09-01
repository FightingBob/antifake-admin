<template>
  <div>
    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" />
    <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">
      <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />
    </el-table>
    <!-- <el-button v-if="tableData.length > 0" class="btn-save" type="primary" icon="el-icon-document" @click="save">
      保存
    </el-button> -->
  </div>
</template>

<script>
import UploadExcelComponent from '@/components/UploadExcel/index.vue'

export default {
  name: 'UploadExcel',
  components: { UploadExcelComponent },
  data() {
    return {
      tableData: [],
      tableHeader: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    save() {
      const data = {
        tableData: this.tableData,
        tableHeader: this.tableHeader
      }
      this.$emit('parentFuction', data)
    },
    handleSuccess({ results, header }) {
      this.tableData = results
      this.tableHeader = header
      this.save()
    }
  }
}
</script>

