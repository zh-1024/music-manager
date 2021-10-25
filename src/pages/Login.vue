<template>
    <div class="login-wrap">
        <div class="ms-title">音乐后台管理登陆</div>
        <div class="parent-login"></div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                 <el-form-item prop="password">
                    <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm">登陆</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script >
import {getLoginStatus} from "../api/index" //引入index.js中的getLoginStatus方法
import {mixin} from "../mixins/index"
export default {
    mixins:[mixin],
    data: function(){
        return{
            ruleForm:{
                username:"admin",
                password:"123"
            },
             rules:{
                 username:[
                     {required:true,message:"请输入用户名",trigger:"blur"}
                 ],
                 password:[
                     {required:true,message:"请输入密码",trigger:"blur"}
                 ]
             }
        }
       
    },
    methods:{
        submitForm(){
            let params= new URLSearchParams();
            params.append("name",this.ruleForm.username);
            params.append("password",this.ruleForm.password);
            getLoginStatus(params)
                .then((res)=>{
                    if(res.code==1){
                        localStorage.setItem("username",this.ruleForm.username);//将用户名放入缓存
                        this.$router.push("/Info");
                        this.notify("登陆成功","success");
                    }else{
                        this.notify("用户名或密码错误","error");
                    }
                })
        }
    }
}
</script>

<style scoped>
.login-wrap{
	    background: url('../assets/img/background.jpg') center center no-repeat;
	    background-size: 100% 100%;
        height: 100%;
        position: fixed;
        width: 100%;
}
.ms-title{
    position: absolute;
    top: 60%;
    width: 100%;
    margin-top: -240px;
    text-align: center;
    font-weight: 600;
    font-size: 30px;
    color:#fff;
    z-index: 1;
}
.ms-login{
    position: absolute;
    left: 50%;
    top: 50%;
    width: 300px;
    height: 160px;
    margin-left: -190px;
    margin-top: -120px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
    z-index: 1;
}
.parent-login{
     position: absolute;
    left: 50%;
    top: 50%;
    width: 400px;
    height: 260px;
    margin-left: -240px;
    margin-top: -175px;
    padding: 40px;
    border-radius: 5px;
    background: #fff;
    opacity: 0.3;
}
.login-btn{
    text-align: center;
}
.login-btn button{
    width: 100%;
    height: 36px;
}
</style>