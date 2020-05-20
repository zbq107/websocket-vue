<template>
  <div class="login">
    <div id="mylogin" >
      <el-row  type="flex" justify="center">
        <el-col  :xs="8" :sm="7" :md="6" :lg="5" :xl="4">
          <h2>&ensp;用户注册</h2>
        </el-col>
      </el-row>

      <el-row class="item" type="flex" justify="center">
        <el-col  :xs="15" :sm="7" :md="6" :lg="5" :xl="1">
          <el-input id="name" v-model="param.regUserName" placeholder="请输入帐号" v-on:keyup.enter.native="check"
                    style="width:245px;">
            <!--<template slot="prepend">帐号</template>-->
            <template slot="prepend" class="pre"><i class="el-icon-user"></i></template>
          </el-input>
        </el-col>
      </el-row>

      <el-row class="item" type="flex" justify="center">
        <el-col :xs="15" :sm="7" :md="6" :lg="5" :xl="4" >
          <el-input id="password" v-model="param.regPassWord" type="password" placeholder="请输入密码" v-on:keyup.enter.native="check"
                    style="width:245px;">
            <!--<template slot="prepend">密码</template>-->
            <template slot="prepend" class="pre"><i class="el-icon-lock"></i></template>
          </el-input>
        </el-col>
      </el-row>

      <el-row class="item" type="flex" justify="center">
        <el-col :xs="15" :sm="7" :md="6" :lg="5" :xl="4" >
          <el-input id="rePassword" v-model="param.rePassword" type="password" placeholder="请再次输入密码" v-on:keyup.enter.native="check"
                    style="width:245px;">
            <!--<template slot="prepend">密码</template>-->
            <template slot="prepend" class="pre"><i class="el-icon-lock"></i></template>
          </el-input>
        </el-col>
      </el-row>

      <el-row class="item" type="flex" justify="center">
        <el-col :xs="8" :sm="7" :md="6" :lg="5" :xl="4" >
          <el-button id="login" @click="check" style="width:100%" type="primary" v-on:keyup.enter.native="check">注册</el-button>
        </el-col>
      </el-row>

    </div>
  </div>
</template>


<script>
    import {reg} from "../api/userApi";
    import qs from 'qs';

    export default {
        name: 'reg',
        data () {
            return{
                param:{
                    regUserName:'',
                    regPassWord:'',
                    rePassword: '',
                },
            }
        },
        methods: {
            check(){
                let name = this.param.regUserName
                let pass = this.param.regPassWord
                let repw = this.param.rePassword

                if (name === '' || pass === '' || repw === '') {
                    this.$message({
                        type: 'error',
                        message: '账号或密码不能为空！'

                    })
                } else{
                    if (pass === repw) {
                        let postData = {
                            userName: name,
                            passWord: pass
                        }
                        let pushData = qs.stringify({
                            userName: name,
                            passWord: pass
                        })
                        //注册方法
                        reg(pushData).then(res =>{
                            if (res && res.status === 200 && res.data.errorCode==200) {
                                this.$message({
                                    type: 'success',
                                    message: '注册成功！'
                                })
                                //注册成功跳转到登录页面
                                this.$router.push("/login")
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: '注册失败，请重试！'

                                })
                            }
                        }).catch(err =>{
                            this.$message({
                                type: 'error',
                                message: '注册失败，请重试！'

                            })
                        })
                    }else {
                        this.$message({
                            type: 'error',
                            message: '两次密码输入不一致！'

                        })
                    }
                }

            }

        }
    }
</script>

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
