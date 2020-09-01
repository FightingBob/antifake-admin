import { login, logout, getInfo, updateAvatar, updateInfo, updatePassword } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { defaultAvatar, defaultIntroduction, defaultNickname } from '@/utils/user'
import { validateBlank, isUndefined } from '@/utils/validate'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  nickname: '',
  phone: '',
  email: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = validateBlank(avatar) ? avatar : defaultAvatar()
  },
  SET_NICKNAME: (state, nickname) => {
    state.nickname = validateBlank(nickname) ? nickname : defaultNickname()
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone
  },
  SET_EMAIL: (state, email) => {
    state.email = email
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = validateBlank(introduction) ? introduction : defaultIntroduction()
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        const tokenStr = data.tokenHead + data.token
        commit('SET_TOKEN', tokenStr)
        setToken(tokenStr)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 修改个人信息
  updateInfo({ commit }, infoParam) {
    return new Promise((resolve, reject) => {
      updateInfo(infoParam).then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 修改密码
  updatePassword({ commit }, passwordParam) {
    return new Promise((resolve, reject) => {
      updatePassword(passwordParam).then(response => {
        const { data } = response
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 更换头像
  updateIcon({ commit }, iconParam) {
    const { iconName, iconUrl } = iconParam
    return new Promise((resolve, reject) => {
      updateAvatar({ iconName: iconName.trim(), iconUrl: iconUrl.trim() }).then(response => {
        const { data } = response
        const { avatar } = data
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const { roles, phone, nickname, email, name, avatar, introduction } = data

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_ROLES', isUndefined(roles))
        commit('SET_NAME', isUndefined(name))
        commit('SET_AVATAR', isUndefined(avatar))
        commit('SET_NICKNAME', isUndefined(nickname))
        commit('SET_PHONE', isUndefined(phone))
        commit('SET_EMAIL', isUndefined(email))
        commit('SET_INTRODUCTION', isUndefined(introduction))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout().then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      // reset visited views and cached views
      dispatch('tagsView/delAllViews', null, { root: true })

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
