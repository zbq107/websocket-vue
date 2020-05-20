import { httpClient } from './common/base.js'

// 登录
export const loginBynameAndPwd = params => {
  return httpClient.post("web/loginPD", params)
}

// 退出登录
export const exit = params => {
  return httpClient.post("web/exit", params)
}

// 注册
export const reg = params => {
  return httpClient.post("web/reg", params)
}
