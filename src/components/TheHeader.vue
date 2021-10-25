<template>
    <div class="header">
        <!-- 折叠左侧菜单 -->
        <div class="collapse-btn" @click="collapseChange">
            <i class="el-icon-menu"></i>
        </div>
        <div class="logo">music后台管理</div>
        <div class="header-right">
            <div class="btn-fullscreen" @click="handleFullScreen">
                <el-tooltip :content="fullscreen?'取消全屏':'全屏'" placement="bottom">
                <i class="el-icon-full-screen"></i>
                </el-tooltip>
            </div>
            <div class="user-avator">
                <img src="../assets/img/user.jpg" />
            </div>
            <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    {{username}}
                    <i class="el-icon-caret-bottom"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="myself">个人信息</el-dropdown-item>
                    <el-dropdown-item command="logout">退出登陆</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
import bus from "../assets/js/bus"
export default {
    data(){
        return{
            collapse:false,
            fullscreen:false
        }
    },
    computed:{
        username(){
            return localStorage.getItem("username");
        }
    },
    methods:{
        //侧边栏折叠
        collapseChange(){
            this.collapse=!this.collapse;
            bus.$emit("collapse",this.collapse)
        },
        //全屏事件
        handleFullScreen(){
            
            if(this.fullscreen){
                if(document.exitFullscreen){
                    document.exitFullscreen();
                }else if(document.webkitCancelFullScreen){  //safari chrom的一些版本执行这个
                    document.webkitCancelFullScreen();
                }else if(document.mozCancelFullScreen){ //firefox
                    document.mozCancelFullScreen();
                }else if(document.msExitFullScreen){    //ie
                    document.msExitFullScreen();
                }
            }else{
                let element=document.documentElement;
                if(element.requestFullscreen){
                    element.requestFullscreen();
                }else if(element.webRequestFullScreen){
                    element.webRequestFullScreen();
                }else if(element.mozRequestFullScreen){
                    element.mozRequestFullScreen();
                }else if(element.msRequestFullScreen){
                    element.msRequestFullScreen();
                }
            }
            this.fullscreen=!this.fullscreen;
            
        },
        handleCommand(command){
            if(command=="logout"){
                localStorage.removeItem('username');
                this.$router.push('/');
            }
        }
    }
}
</script>
<style  scoped>
.header{
    position: absolute;
    background-color: #253041;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    left: 0px;
    top: 0px;
    font-size: 22px;
    color: #ffffff;
}
.collapse-btn{
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
}
.logo{
    float: left;
    line-height: 70px;
}
.header-right{
    float: right;
    padding-right: 50px;
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen{
    margin-right: 5px;
    font-size: 24px;
}
.user-avator{
    margin-left: 20px;
}
.user-avator img{
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 50%;
}
.user-name{
    margin-left: 10px;
}
.el-dropdown-link{
    color: #ffffff;
    cursor: pointer;
}
</style>