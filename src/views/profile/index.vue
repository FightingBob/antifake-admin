<template>
  <div class="app-container">
    <div v-if="user">
      <el-row :gutter="20">

        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>

        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="个人信息" name="account">
                <account :user="user" />
              </el-tab-pane>
              <el-tab-pane label="密码修改" name="password">
                <password />
              </el-tab-pane>
              <el-tab-pane label="更换头像" name="icon">
                <icon ref="tabIcon" v-model="photo" @callFather="getChild" />
                <el-button v-if="fileList[0].url" size="small" type="primary" style="margin-top: 10px;" @click="updateIcon">保存<i class="el-icon-s-claim el-icon--right" /></el-button>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>

      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import UserCard from './components/UserCard'
import Account from './components/Account'
import Password from './components/Password'
import Icon from './components/Icon'
export default {
  name: 'Profile',
  components: { UserCard, Account, Password, Icon },
  data() {
    return {
      photo: '',
      user: {},
      activeTab: 'account',
      fileList: [{
        name: null,
        url: null
      }]
    }
  },
  computed: {
    ...mapGetters([
      'name',
      'avatar',
      'roles',
      'nickname',
      'phone',
      'email',
      'introduction'
    ])
  },
  created() {
    this.getUser()
  },
  methods: {
    getUser() {
      this.user = {
        name: this.name,
        role: this.roles.join(' | '),
        avatar: this.avatar,
        nickname: this.nickname,
        phone: this.phone,
        email: this.email,
        introduction: this.introduction
      }
    },
    updateIcon() {
      const iconParam = {}
      iconParam.iconName = this.fileList[0].name
      iconParam.iconUrl = this.fileList[0].url
      this.$store.dispatch('user/updateIcon', iconParam).then(() => {
        location.reload()
      })
      this.$router.go(0)
    },
    getChild() {
      this.fileList = this.$refs.tabIcon.fileList
    }
  }
}
</script>
