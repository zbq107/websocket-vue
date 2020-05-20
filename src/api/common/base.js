import axios from 'axios'
import JWT from 'jsonwebtoken'
import {MessageBox,Message} from 'element-ui'

const CryptoJS = require('crypto-js')

let base = '/api'
let sessionTimeout = false
// 持续集成环境
/*
if (process.env.NODE_ENV === 'prod') {
  base = 'http://mkbbs.freer.xyz:8001'
}
*/

// base = 'http://mkbbs.freer.xyz:8001'
// base = 'http://42.56.89.210:8001'

axios.defaults.withCredentials = true // 让ajax携带cookie

/** yp add
 * 设置token头**/

axios.defaults.headers.common['x-auth-token'] = sessionStorage.getItem('x-auth-token');

export const httpClient = axios.create({
  baseURL: base
  // 导出excel数据量大时，1分钟下载不下来。暂时放开
  // timeout: 60000,
})

// export const httpClient2 = axios.create()

// 统一异常拦截，统一异常处理
httpClient.interceptors.response.use(response => {
  return response
}, err => {
  try {
    console.log('try',status)
    const result = err.response.data
    const status = err.response.status
    if(status == 401){
      if(!sessionTimeout){
        sessionTimeout = true;
        MessageBox.alert('登录超时，请重新登录。', '提示信息', {
          confirmButtonText: '确定',
          callback: action => {
            //清除登录信息
            sessionStorage.removeItem('userName');
            sessionStorage.removeItem('x-auth-token');
            sessionStorage.removeItem('login_state');

            window.open ('/#/login','_self');
            //window.location.href="/#login"
          }
        });
      }
      return;
    }else if(status == 417){
       Message.error({showClose:true,message:result.message})
       return
    }
    /*const ecode = result.ecode;
    //签收
    if (ecode == 'SIGN000006') {
      history.go(-1);S
    } else if (ecode == 'SIGN000007') {
      history.go(-1);
    }
    if (ecode == 'SYS000101' || ecode == 'SYS000102') {
      let errorMsg = '此账号已在其他地方登录! 点击确定后将返回登录页面。';
      if (ecode == 'SYS000101') {
        errorMsg = '此账号Session过期，拒绝访问，请重新登录！点击确定后将返回登录页面。'
      }
      MessageBox.alert(errorMsg, '提示信息', {
        confirmButtonText: '确定',
        callback: action => {
          // window.open('/ltms/login', '_self');
        }
      });
      return;
    }*/
    if (result.errorMsg) {
      const params = {value: result.errorMsg, type: 'error', time: new Date()}
      GLOBAL_VUE_INSTANCE.$store.dispatch('setMessageList', params)
    }
    return result
  } catch (e) {
    return Promise.reject(err)
  }
})

// 配置post请求时，后台接口数据通过@ReqeustParam获取不到适配
export const postParamConfig = {
  transformRequest: [function (data) {
    // Do whatever you want to transform the data
    let ret = ''
    let isComplex = false
    for (let it in data) {
      if (typeof (data[it]) === 'object') {
        isComplex = true
        break
      }
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    if (isComplex) return data
    return ret
  }],
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}
