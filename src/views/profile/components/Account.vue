<template>
  <el-form ref="user" :model="user" :rules="rules" label-width="100px">
    <el-form-item label="账号" prop="name">
      <el-input v-model.trim="user.name" :disabled="isDisabled" />
    </el-form-item>
    <el-form-item label="昵称" prop="nickname">
      <el-input v-model.trim="user.nickname" :disabled="isDisabled" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model.trim="user.email" :disabled="isDisabled" />
    </el-form-item>
    <el-form-item label="手机号" prop="phone">
      <el-input v-model.trim="user.phone" :disabled="isDisabled" />
    </el-form-item>
    <el-form-item label="备注" prop="introduction">
      <el-input v-model.trim="user.introduction" :disabled="isDisabled" />
    </el-form-item>
    <el-form-item>
      <el-button v-if="isDisabled" type="primary" @click="isDisabled=false">修改</el-button>
      <el-button v-if="!isDisabled" type="primary" @click="submit('user')">保存</el-button>
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
          name: '',
          email: '',
          nickname: '',
          phone: '',
          introduction: ''
        }
      }
    }
  },
  data() {
    return {
      isDisabled: true,
      rules: {
        name: [
          { required: true, message: '请输入账号名', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符之间', trigger: 'blur' }
        ],
        nickname: [
          { max: 20, message: '长度不能超过20个字符', trigger: 'blur' }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        phone: [
          {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          {
            pattern: /^0{0,1}(13[0-9]|15[7-9]|153|156|18[7-9])[0-9]{8}$/,
            message: '手机号格式不对',
            trigger: 'blur'
          }

        ],
        introduction: [
          { max: 200, message: '长度不能超过200个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.upadteInfo()
        } else {
          this.$message.error('请填写正确再提交')
        }
      })
    },
    upadteInfo() {
      const infoParam = {}
      infoParam.nickname = this.user.nickname
      infoParam.email = this.user.email
      infoParam.phone = this.user.phone
      infoParam.note = this.user.introduction
      infoParam.username = this.user.name
      this.$store.dispatch('user/updateInfo', infoParam).then(() => {
        this.tips()
        location.reload()
        this.$router.go(0)
      })
    },
    tips() {
      this.$message({
        message: '修改个人信息成功',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
