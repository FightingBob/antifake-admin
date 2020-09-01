<template>
  <div>
    <FilenameOption v-model="filename" />
    <!-- <AutoWidthOption v-model="autoWidth" />
      <BookTypeOption v-model="bookType" /> -->
    <el-button v-if="canExport" :loading="downloadLoading" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="handleDownload">
      导出
    </el-button>
    <el-button v-if="canImport" style="margin:0 0 20px 20px;" type="primary" icon="el-icon-document" @click="importAdmin">
      导入
    </el-button>
  </div>
</template>
<script>
import { parseTime } from '@/utils'
import FilenameOption from '@/views/excel/components/FilenameOption'
// import AutoWidthOption from '@/views/excel/components/AutoWidthOption'
// import BookTypeOption from '@/views/excel/components/BookTypeOption'
export default {
  name: 'ExportExcel',
  components: { FilenameOption },
  props: {
    // filename: {
    //   type: String,
    //   default: 'excel-list'
    // },
    theader: {
      type: Array,
      default: null
    },
    filterval: {
      type: Array,
      default: null
    },
    list: {
      type: Array,
      default: null
    },
    canExport: {
      type: Boolean,
      default: true
    },
    canImport: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      downloadLoading: false,
      autoWidth: true,
      bookType: 'xlsx',
      filename: ''
    }
  },
  methods: {
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = this.theader
        const filterVal = this.filterval
        const list = this.list
        const data = this.formatJson(filterVal, list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: this.filename,
          autoWidth: this.autoWidth,
          bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    importAdmin() {
      this.$router.push('/ums/importAdmin')
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
