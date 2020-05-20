<template>
  <div class="login">
    <div id="mylogin" >
        <el-row  type="flex" justify="center">
          <el-col  :xs="8" :sm="7" :md="6" :lg="5" :xl="4">
            <h2>&ensp;newChat</h2>
          </el-col>
        </el-row>

          <el-row class="item" type="flex" justify="center">
            <el-col  :xs="15" :sm="7" :md="6" :lg="5" :xl="1">
              <el-input id="name" v-model="params.userName" placeholder="请输入帐号" v-on:keyup.enter.native="check"
                         style="width:245px;">
                <!--<template slot="prepend">帐号</template>-->
                <template slot="prepend" class="pre"><i class="el-icon-user"></i></template>
              </el-input>
            </el-col>
          </el-row>

          <el-row class="item" type="flex" justify="center">
            <el-col :xs="15" :sm="7" :md="6" :lg="5" :xl="4" >
              <el-input id="password" v-model="params.passWord" type="password" placeholder="请输入密码" v-on:keyup.enter.native="check"
                        style="width:245px;">
                <!--<template slot="prepend">密码</template>-->
                <template slot="prepend" class="pre"><i class="el-icon-lock"></i></template>
              </el-input>
            </el-col>
          </el-row>

          <el-row class="item" type="flex" justify="center">
            <el-col :xs="8" :sm="7" :md="6" :lg="5" :xl="4" >
              <el-button id="login" @click="check" style="width:100%" type="primary" v-on:keyup.enter.native="check">登录</el-button>
            </el-col>
          </el-row>

        <el-row class="item" type="flex" justify="center">
          <el-col :xs="8" :sm="7" :md="6" :lg="5" :xl="4" >
            <span @click="$router.push({path:'/reg'})" >&emsp;注册 |</span>
            <span @click="$router.push({path:'/forget'})" >忘记密码</span>
          </el-col>
        </el-row>
    </div>
  </div>
</template>

<script>

import {loginBynameAndPwd} from "../api/userApi";
import qs from 'qs';

export default {
  name: 'login',
  data () {
    return {
        params:{
          userName:'',
          passWord:''
        },
        userToken: ''

    }
  },
  mounted(){

  },
  methods: {
    check(){
        let name = this.params.userName
        let pass = this.params.passWord
        console.log(name)
        if (name === '' || pass === '') {
            this.$message({
                type: 'error',
                message: '账号或密码不能为空'
            })
        }else{
            let postData = qs.stringify({
                userName: name,
                passWord: pass
            })
            loginBynameAndPwd(postData).then(res => {
                if (res && res.status === 200 && res.data.errorCode==200) {
                    //暂存用户信息，包括机构、角色权限等信息
                    sessionStorage.setItem('userName', this.params.userName);//JSON.stringify()
                    sessionStorage.setItem('x-auth-token', res.headers['x-auth-token']);
                    sessionStorage.setItem('login_state', 'true');
                    //页面跳转
                    this.$router.push("/index")
                }else{
                    this.$message({
                        type: 'error',
                        message: res.data.msg
                    })
                    sessionStorage.removeItem('userName');
                    sessionStorage.removeItem('x-auth-token');
                    sessionStorage.removeItem('login_state');
                }
            }).catch(err => {
                this.$message({
                    type: 'error',
                    message: '用户或密码错误'
                })
                console.log('异常信息：' + err.message)
                sessionStorage.removeItem('userName');
                sessionStorage.removeItem('x-auth-token');
                sessionStorage.removeItem('login_state');
            })
        }
    }




  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #mylogin{
    display: flex;
    flex-direction: column;
    margin-top: 200px;
  }
  .item{
    margin-bottom: 20px;
  }
  .pre{
    background: #A6C1D3 !important;
  }
  .el-input-group__append, .el-input-group__prepend {
    background-color:#A6C1D3 !important;
  }

</style>
<style>

  .login .el-input-group__append, .login .el-input-group__prepend {
    background-color:#A6C1D3 !important;
    color: white;
    font-size: 1.5em;
    border:1px solid #A6C1D3
  }
  .login .el-input__inner{
    border:1px solid #A6C1D3
  }
</style>
