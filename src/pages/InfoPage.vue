<template>
    <div>
        <el-row :gutter="20" class="mgb20">
            <el-col :span="6">
                <el-card>
                    <div class="grid-content ">
                        <div class="grid-cont-center">
                               <div class="grid-num">{{consumerCount}}</div>
                                <div>用户总数</div>
                        </div>  
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <div class="grid-content ">
                        <div class="grid-cont-center">
                               <div class="grid-num">{{songCount}}</div>
                                <div>歌曲总数</div>
                        </div>  
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <div class="grid-content ">
                        <div class="grid-cont-center">
                               <div class="grid-num">{{songListCount}}</div>
                                <div>歌单数量</div>
                        </div>  
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <div class="grid-content ">
                        <div class="grid-cont-center">
                               <div class="grid-num">{{singerCount}}</div>
                                <div>歌手数量</div>
                        </div>  
                    </div>
                </el-card>
            </el-col>
        </el-row>
         <el-row :gutter="20" class="mgb20">
            <el-col :span="12">
                <el-card>
                <h3>用户性别比例</h3>
                <div style="backgroud-color:white" >
                    <ve-pie :data="consumerSex" :theme="options">
                    </ve-pie>
                </div>
                </el-card>
            </el-col>

              <el-col :span="12">
                <el-card>
                <h3>歌曲类型分布</h3>
                <div style="backgroud-color:white" >
                    <ve-histogram :data="songListStyle">
                    </ve-histogram>
                </div>
                </el-card>
            </el-col>
        </el-row>
         <el-row :gutter="20" class="mgb20">
            <el-col :span="12">
                <el-card>
                <h3>歌手分布</h3>
                <div style="backgroud-color:white" >
                    <ve-pie :data="singerSex" >
                    </ve-pie>
                </div>
                </el-card>
            </el-col>

              <el-col :span="12">
                <el-card>
                <h3>歌手国籍分布</h3>
                <div style="backgroud-color:white" >
                    <ve-histogram :data="countrys">
                    </ve-histogram>
                </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import {getAllgetAllUser,getSongListCount,getSingerCount,getSongCount,getAllSongList,getAllSinger} from "../api/index";
import { mixin } from "../mixins/index";
export default {
    mixins: [mixin],
    data(){
        return {
            consumerCount:0,    //用户总数
            songCount:0,         //歌曲数量
            songListCount:0,     //歌单数量
            singerCount:0,        //歌手总数
            consumerSex:{           //按性别分类的用户数
                columns:['性别','总数'],
                rows:[
                    {'性别':'男','总数':0},
                    {'性别':'女','总数':0}
                ]
            },
            options:{
                color:['#87cefa','#ffc0cb']
            },
            songListStyle:{           //按歌单风格分类
                columns:['风格','总数'],
                rows:[
                    {'风格':'华语','总数':0},
                    {'风格':'轻音乐','总数':0},
                    {'风格':'粤语','总数':0},
                    {'风格':'日韩','总数':0},
                    {'风格':'欧美','总数':0},
                    {'风格':'BGM','总数':0},
                    {'风格':'乐器-轻音乐','总数':0},
                    {'风格':'日韩-轻音乐','总数':0},
                ]
            },
             singerSex:{           //按性别分类的用户数
                columns:['性别','总数'],
                rows:[
                    {'性别':'男','总数':0},
                    {'性别':'女','总数':0},
                    {'性别':'组合','总数':0}
                ]
            },
            countrys:{           //按歌单风格分类
                columns:['国籍','总数'],
                rows:[
                    {'国籍':'中国','总数':0},
                    {'国籍':'韩国','总数':0},
                    {'国籍':'日本','总数':0},
                    {'国籍':'美国','总数':0},
                    {'国籍':'其他','总数':0}
                ]
            },
        }
    },
    created(){
        this.getAllConsumer();    
        this.getAllSong();   
        this.getAllSinger1();
        this.getAllSongList(); 
    },
    methods: {
        getAllConsumer(){
            getAllgetAllUser()
            .then((res)=>{
                this.consumerCount=res.length;
                this.consumerSex.rows[0]['总数']=this.setSex(1,res);
                this.consumerSex.rows[1]['总数']=this.setSex(0,res);
            })
            .catch((err)=>{
                console.log(err);
            })
        },
        //获取各个性别的数量
        setSex(sex,data){
            let count=0;
            for(let item of data){
                if(item.sex==sex)
                    count++;
            }
            return count;
        },
        getAllSong(){
            getSongCount()
            .then((res)=>{
                this.songCount=res;
            })
            .catch((err)=>{
                console.log(err);
            })
        },
        getAllSinger1(){
            getAllSinger()
            .then((res)=>{
                this.singerCount=res.length;
                this.singerSex.rows[0]['总数']=this.setSex(1,res);
                this.singerSex.rows[1]['总数']=this.setSex(0,res);
                this.singerSex.rows[2]['总数']=this.setSex(2,res);
                for(let item of res){
                    this.getBycountrys(item.location);
                }
                var count=0;
                for(let item of this.countrys.rows){
                    count+=item['总数'];
                }
                console.log(count+"  "+this.singerCount);
                this.countrys.rows[4]['总数']=this.singerCount-count;

            })
            .catch((err)=>{
                console.log(err);
            })
        },
          //获取各个风格歌曲的数量
        getBycountrys(location){
            for(let item of this.countrys.rows){
                if(location.includes(item['国籍'])){
                    item['总数']++;
                }
            }
        },
        getAllSongList(){
            getAllSongList()
            .then((res)=>{
                this.songListCount=res.length;
                for(let item of res){
                    this.getByStyle(item.style);
                }
            })
            .catch((err)=>{
                console.log(err);
            })
        },
          //获取各个风格歌曲的数量
        getByStyle(style){
            for(let item of this.songListStyle.rows){
                if(style.includes(item['风格'])){
                    item['总数']++;
                }
            }
        },
    },
}
</script>
<style scoped>
    .grid-content{
        display: flex;
        align-items: center;
        height: 60px;
    }
    .grid-cont-center{
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: darkgray;
    }
    .grid-num{
        font-size: 30px;
        font-weight: bold;
    }
</style>