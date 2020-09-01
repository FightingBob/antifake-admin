<template>
  <el-form ref="user" :model="user" status-icon :rules="rules" label-width="100px">
    <el-form-item label="原密码" prop="oldPassword">
      <el-input v-model.trim="user.oldPassword" type="password" show-password autocomplete="off" />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model.trim="user.newPassword" type="password" show-password autocomplete="off" />
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input v-model.trim="user.checkPass" type="password" show-password autocomplete="off" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="update('user')">修改密码</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          oldPassword: '',
          newPassword: '',
          checkPass: ''
        }
      }
    }
  },
  data() {
    var checkPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.user.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        oldPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' },
          { validator: checkPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    update(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.updatePassword()
        } else {
          this.$message.error('请填写正确再提交')
        }
      })
    },
    updatePassword() {
      const passWordParam = {}
      passWordParam.oldPassword = this.user.oldPassword
      passWordParam.newPassword = this.user.newPassword
      this.$store.dispatch('user/updatePassword', passWordParam).then(() => {
        this.tips()
        this.logout()
      })
    },
    tips() {
      this.$message({
        message: '修改密码成功,请使用新密码重新登录',
        type: 'success',
        duration: 5 * 1000
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>
