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
import { listAllDepartment } from '@/api/department'
import { batchAdminInsert } from '@/api/user'
export default {
  name: 'ImportAdmin',
  components: { Upload },
  data() {
    return {
      list: null,
      listDepartment: []
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    getList(list) {
      this.list = list
    },
    setData() {
      const list = this.list.tableData
      return list.map((item) => {
        const admin = {}
        admin.phone = item.手机号
        admin.nickname = item.姓名
        admin.departmentId = this.getDepartmentId(item.部门)
        return admin
      })
    },
    getDepartmentId(departmentName) {
      var id = null
      this.listDepartment.forEach(item => {
        if (item.name === departmentName) {
          id = item.id
        }
      })
      return id
    },
    getDepartment() {
      listAllDepartment().then((response) => {
        this.listDepartment = response.data
      })
    },
    save() {
      const data = this.setData()
      // console.log(data)
      batchAdminInsert(data).then(response => {
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
