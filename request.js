import axios from 'axios'
import { Message } from 'element-ui'
import { baseUrl } from './env'

// 创建axios实例
const Axios = axios.create({
    baseURL: baseUrl,
    timeout: 20 * 1000,
    withCredentials: true, // 需要登录权限的要带cookie
    headers: {
      'Authorization': ''
    }
})

// request拦截器
Axios.interceptors.request.use(config => {
    if (window.localStorage.getItem('token')) {
        config.headers.Authorization = JSON.parse(window.localStorage.getItem('token')).token
    }
    if (window.localStorage.getItem('NECaptchaValidate')) {
      config.headers.necaptchavalidate = window.localStorage.getItem('NECaptchaValidate')
      window.localStorage.removeItem('NECaptchaValidate')
    }
    return config
}, error => {
      Message({
        showClose: true,
        message: (error && error.msg) || '请求异常',
        type: 'error'
      })
      return Promise.reject(error)
})

// response拦截器
Axios.interceptors.response.use(
    response => {
        const res = response.data
        // success表示业务成功，直接resolve
        if (!res.code) {
            return Promise.resolve(res)
        }
        if (res.code === 3153) {
          return Promise.resolve(res)
        }
        Message({
          showClose: true,
          message: (res && res.msg) || '系统异常',
          type: 'error'
        })
        return Promise.reject(res)
    },
    error => {
        Message({
            showClose: true,
            message: (error && error.msg) || '网络异常',
            type: 'error'
        })
        return Promise.reject(error)
    }
)

export default (url = '', data = {}, method = 'get', MoreConfig = {}) => {
    let config = {
      url,
      method,
      ...MoreConfig
    }
    if(method.toLocaleLowerCase() === 'get'){
      config['params'] = data
    }else {
      config['data'] = data
    }
    return Axios.request(config)
}

