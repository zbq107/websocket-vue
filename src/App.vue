<template>
  <div id="app">
<!--    <img v-if="flag === true " src="./assets/logo.png">-->
    <router-view/>
  </div>
</template>

<script>
    export default {
        name: 'App',
        data(){
            return{
                //flag : true   这里不写也行,有个错误提示flag找不到
            }
        },
        methods:{

        },
        watch:{
            '$route.path':function () {
                this.flag = this.$route.path =='/'
                //console.log(this.flag)
            }
        }
    }
</script>

<style>
  /*#app {*/
  /*  font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  /*  -webkit-font-smoothing: antialiased;*/
  /*  -moz-osx-font-smoothing: grayscale;*/
  /*  text-align: center;*/
  /*  color: #2c3e50;*/
  /*  margin-top: 60px;*/
  /*}*/
</style>
