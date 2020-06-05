<template>
    <div class="form">
        <h3>netty 聊天室({{ onlineCount }})</h3><span class ="out" @click="out()">退出登录</span>
        <div id="message" type="text" class="div">
          <div id="textarea" class="textarea" v-html="message">
            {{message}}
          </div>

        </div>
        <br>
        <input id="text" class="msg" v-model="text" type="text" name="message" placeholder="发送消息" value="">
        <input class="btn" type="button" value="发送" @click="send()">
      <input id="md" style="margin-bottom: 0px;" type="hidden"></input>

    </div>

</template>

<script>

import {exit} from "../api/userApi";
import qs from 'qs';

  //在线人数
  // let onlineCount;
  let aa;
  //用来判定重连的次数
  let count;
  let that = this

  export default {
      name:"index",
      data(){
        return{
            text:"",
            message:"",
            url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
            onlineCount: 1,
            gotop: false
        }
      },
      mounted() {
          aa = 1; //用来判定第一次返回的消息
          count = 0
          //html加载完成之后执行initWesocket（）方法进行对webSocket初始化
          this.initWebSocket();
      },
      watch:{
          //下边的这个检测不生效，先放一下
          // '$route.path':function () {
          //     console.log(this.websocket.readyState);
          //     if(this.websocket.readyState != 1){
          //         this.$router.push("/login")
          //     }
          // },

      },
      methods:{
          //初始化websocket
          initWebSocket(){
              //后台的地址
            const path = "ws://localhost:8087/webSocket/websocket"
              this.websocket = new WebSocket(path)
              this.websocket.onopen = this.websocketOnOpen
              this.websocket.onmessage = this.websocketOnMessage
              this.websocket.onerror = this.websocketOnError
              this.websocket.onclose = this.websocketOnClose
          },
          //建立成功的信号
          websocketOnOpen(){
              console.log("初始化成功")
          },
          //建立失败重新连接
          websocketOnError(){
              count++;
              console.log("第"+ count + "次重连")
              if(count >= 5){
                  console.log("重连次数"+count)
                  this.websoket.close();
              }
              //如果报错的话重新连接，断线重连
              this.initWebSocket();
          },
          //关闭的信号
          websocketOnClose(){
              this.websocket.close();
              console.log("断开连接")
          },
          //接收消息
          websocketOnMessage(e){
              console.log(e)  //e这个变量就是后台返回的数据。这个函数里边可以进行处理返回的值
              //转一下json格式
              let mess = JSON.parse(e.data);
              if(mess.onlineCount != null && mess.onlineCount != ''){
                  // this.onlineCount = mess.onlineCount
                  // sessionStorage.setItem("onlineCount",mess.onlineCount)
                  localStorage.setItem("onlineCount",mess.onlineCount)
                  this.onlineCount = mess.onlineCount
                  this.message = "<center>欢迎使用websocket</center>"

              }else{
                  //在广播消息的时候同步当前用户登录数量
                  this.onlineCount = localStorage.getItem("onlineCount")

                  //如果消息是自己发的，消息靠右
                  if(mess.userName === sessionStorage.getItem("userName")){
                      $(".textarea").append(
                          "<div class='lt'>" +
                            "<div class='hp_right'><img class='headPhoto' src='"+ mess.headPhoto +"'></div>"+
                            "<div id='ltqp_right' class='chat-bubble chat-bubble-right'>"+ mess.msg +"</div>" +
                          "</div><br>"
                      );
                      // 解决样式不生效
                      $(".textarea").trigger("create")
                  }else{
                      $(".textarea").append(
                          "<div class='lt'>" +
                            "<div class='hp_left'><img class='headPhoto' src='"+ mess.headPhoto +"'></div>"+
                            "<div class='show'>" +
                              "<div class='showUserName'>"+mess.userName+"</div>" +
                              "<div id='ltqp_left' class='chat-bubble chat-bubble-left'>"+ mess.msg +"</div>" +
                            "</div>"+
                          "</div><br>"

                      );
                      // 解决样式不生效
                      $(".textarea").trigger("create")
                  }

              }
          },

          // 数据发送
          websocketSend (Data) {
              this.websocket.send(Data)// Data变量就是你想对后台说些啥，根据后端给你的接口文档传值进行交互
          },

          send(){
              //判定websocket的开关状态
              if(this.websocket.readyState === 1){
                  let message = this.text;//document.getElementById('text').value;
                  //添加发送为空校验
                  if(this.text != ""){
                      let json = {
                          userName: sessionStorage.getItem("userName"),
                          msg:  this.text
                      }
                      this.websocketSend(JSON.stringify(json))
                      //websocket.send(JSON.stringify(json));
                      this.text="";
                  }
              }else{
                  this.websocketOnError()
              }

          },
          out(){
              let un = qs.stringify({
                  userName:sessionStorage.getItem("userName")
              })
              exit(un).then(res =>{
                  if (res && res.status === 200 && res.data.errorCode==200) {
                      this.$message({
                          type:"success",
                          message:"退出成功"
                      });
                      sessionStorage.removeItem('userName');
                      sessionStorage.removeItem('x-auth-token');
                      sessionStorage.removeItem('login_state');
                      this.websocketOnClose()
                      this.$router.push("/login")
                  }else{
                      this.$message({
                          type:"error",
                          message:"失败，请重试"
                      });
                  }
              })

          },
      },
      //离开层时执行
      destroyed(){
          //离开路由之后断开websocket的连接
          this.websocketOnClose()
          // 路由跳转时结束websocket链接
          // this.$router.afterEach(function () {
          //     ws.close()
          // })
      },
  }
</script>



<style scoped>
  /*@import "../theme/css/2.css";*/
  .div {
    background:#ffffff;
    border:1px #ADADAD solid;
    resize: none;
    font-size: 35px;
    line-height:40px;
    width: 98%;
    height: 590px;
    margin-bottom: 5px;
  }
  .textarea {
    margin: 0px;
    width: 391px;
    height: 585px;
    font-size: 16px;
    line-height:40px;
    overflow-x: hidden; /*x轴禁止滚动*/
    overflow-y: scroll;/*y轴滚动*/
  }
  .textarea::-webkit-scrollbar {
    display: none;/*隐藏滚动条*/
  }
  .btn {
    width: 80px;
    height: 48px;
    background-color: #d8f1f9;
    border-radius: 6px;
    border: 1px solid #98bcde;
    font-size: 16px;
    color: #92acdc;
    font-weight: bold;
    margin: auto auto;
  }
  .form {
    width: auto;
    height: 720px;
    border: 4px solid #98bcde;
    border-radius: 10px;
    margin: -8px -8px;
    background-color: #eceff9;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    scrollbar-width: none;
  }
  .msg {
    width: 272px;
    height: 43px;
    text-indent: 10px;
    font-size: 16px;
    margin: 5px auto;
    outline: none;
  }
  .out{
    margin: auto 0px;
  }
</style>

<style>
  .headPhoto{
    width: 41px;
    height: 41px;
    /*margin: -14px 5px;*/
  }
  .lt{
    margin-top: -12px;
    margin-bottom: 18px;
    height: auto;
    width: 100%;
    float: left;
  }
  .hp_left{
    margin: 8px 0px 5px 5px;
    float: left;
  }
  .hp_right{
    margin: 8px 0px 5px 5px;
    float: right;
  }
  #ltqp_left{
    /*margin-left: 13px;*/
    /*margin-top: 26px;*/
    margin: 2px 0px 0px 13px;
    float: left;
    /*width: 100%;*/
   }
  #ltqp_right{
    margin-left: 13px;
    float: right;
  }
  .show{
    float: left;
  }
  .showUserName{
    margin: 8px 0px 0px 13px;
    line-height: 20px;
    float: left;
    width: 100%;
    color: #0a8ddf;
  }
  /*气泡样式*/
  .chat-bubble {
    position: relative;
    margin-top: -20px;
    margin:8px;
    padding:0px 8px;
    word-break: break-all;
    background:#fff;
    border: 1px solid #989898;
    border-radius: 5px;
    width:auto;
    /*display:inline-block !important;*/
    display:inline;/*根据内容长度发生改变*/
    max-width:180px;
  }

  .chat-bubble-left {}
  .chat-bubble-left:before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    left: -14px;
    top:12px;
    border: 7px solid;
    border-color:transparent #989898 transparent  transparent ;
  }
  .chat-bubble-left:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    left:-10px;
    top:14px;
    border: 5px solid;
    border-color:transparent #ffffff transparent  transparent ;
  }

  .chat-bubble-right {
    background-color: #4cd964;
  }
  .chat-bubble-right:before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    right: -14px;
    top:12px;
    border: 7px solid;
    border-color:transparent transparent transparent #989898;
  }
  .chat-bubble-right:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    right:-10px;
    top:14px;
    border: 5px solid;
    border-color:transparent transparent transparent #4cd964;
  }

  .chat-bubble-top {}
  .chat-bubble-top:before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    left:10px;
    top:31px;
    border: 10px solid;
    border-color: #989898 transparent  transparent  transparent ;
  }
  .chat-bubble-top:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    left:12px;
    top:30px;
    border: 8px solid;
    border-color:#ffffff transparent transparent transparent  ;
  }

  .chat-bubble-bottom {}
  .chat-bubble-bottom:before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    right:10px;
    top:-21px;
    border: 10px solid;
    border-color:transparent transparent #989898 transparent ;
  }
  .chat-bubble-bottom:after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    right:12px;
    top:-16px;
    border: 8px solid;
    border-color:transparent transparent #ffffff transparent  ;
  }
</style>
