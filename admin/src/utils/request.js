import axios from 'axios'
import qs from 'qs'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 50000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Access-Token'] = getToken()
    }

    if (config['Content-Type'] === 'multipart/form-data') {
      config.data = qs.stringify(config.data)
    }

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    const token = response.headers['X-Access-Token']
    if (token) {
      setToken(token)
      // store.commit('SET_TOKEN', token)
    }

    if (res.code && res.code !== 200 && res.code !== '10008' && res.code !== '-1003') {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return res
    } else if (res.code === '10008' || res.code === '-1003') {
      MessageBox.confirm('您的登录已过期, 您可以点击取消停留在该页面或者重新登录', '提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
          return
        })
      })
    }

    // if the custom code is not 20000, it is judged as an error.
    return res
  },
  error => {
    const { data } = error.response
    if (data.errorCode === '-1003') {
      MessageBox.confirm('您的登录已过期, 您可以点击取消停留在该页面或者重新登录', '提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/resetToken').then(() => {
          location.reload()
        })
      })

      return Promise.reject(error)
    }
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
