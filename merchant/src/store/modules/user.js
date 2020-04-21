import { login, logout, getInfo, register, getPublicKey } from '@/api/user'
import { setToken, getToken, removeToken } from '@/utils/auth'
import addRouter from '@/utils/router-control'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: 'https://iconfont.alicdn.com/t/1562932918092.jpg@100h_100w.jpg',
  router: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROUTER: (state, router) => {
    state.router = router
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({
        account: username.trim(),
        password,
        loginType: 'merchant'
      }).then(response => {
        const { result } = response
        // commit('SET_NAME', username)
        localStorage.setItem('merchantId', result.userInfo.id)
        localStorage.setItem('userInfo', JSON.stringify(result.userInfo))
        setToken(result.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get public key
  getPublicKey({ commit, state }) {
    return new Promise((resolve, reject) => {
      getPublicKey().then(response => {
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo({ userName: localStorage.getItem('name'), commercialNumber: localStorage.getItem('number') }).then(response => {
        const { data } = response

        if (!data) {
          reject('认证失败，请重新登录')
        }
        const { menuList } = data
        commit('SET_ROUTER', menuList || [])
        addRouter()
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        // commit('SET_NAME', name)
        localStorage.clear()
        removeToken()
        resetRouter()
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
      removeToken()
      resolve()
    })
  },

  register({ commit }, userInfo) {
    const { commercialName, commercialIphone, userType, commercialPassword } = userInfo
    return new Promise((resolve, reject) => {
      register({ commercialName, commercialIphone, userType, commercialPassword }).then(response => {
        debugger
        const { errorCode } = response
        if (errorCode === '10000') {
          resolve()
        } else {
          reject()
        }
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

