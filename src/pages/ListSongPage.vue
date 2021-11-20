<template>
  <div class="table">
    <div class="container">
        
      <div class="habdle-box">
        <el-button type="primary" size="mini" @click="delAll"
          >批量删除</el-button
        >
        <el-input
          v-model="select_word"
          size="mini"
          placeholder="请输入歌曲名"
          class="handle-input"
        ></el-input>
        <el-button
          type="primary"
          size="mini"
          @click="centerDialogVisible = true"
          >添加歌曲</el-button
        >
      </div>
    </div>

    <el-table
      size="mini"
      ref="multipleTable"
      border
      style="width: 100%"
      height="673px"
      :data="tableData"
      @selection-change="handleSelectChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column prop="name" label="歌手-歌名" align="center"></el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row.id)" ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加弹窗 -->
    <el-dialog  title="添加歌曲" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form action="" :model="registerForm" id="tf">
         <el-form-item prop="singerName" label="歌手" size="mini">
          <el-input v-model="registerForm.singerName" placeholder="歌手名字"></el-input>
        </el-form-item>
        <el-form-item prop="songName" label="歌曲名字" size="mini">
          <el-input v-model="registerForm.songName" placeholder="歌曲名字"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="getSongId">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除弹窗 -->
    <el-dialog
      title="删除歌曲"
      :visible.sync="deleteVisible"
      width="300px"
      center
    >
      <div align="align">删除不可恢复,是否确定删除</div>
      <span slot="footer">
        <el-button type="primary" size="small" @click="deleteVisible = false"
          >取消</el-button
        >
        <el-button type="primary" size="small" @click="deleteRow"
          >确定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {queryListSongById,getSongBySongId,getSongBySongName,insertListSong,deleteListSong } from "../api/index";
import { mixin } from "../mixins/index";
export default {
  mixins: [mixin],
  data() {
    return {
      centerDialogVisible: false, //添加 弹窗是否显示
      deleteVisible: false, //删除弹窗是否显示
      registerForm: {
        //添加框
        singerName:'',
        songName:''
      },
      tableData: [],
      tempData: [],
      select_word: "",
      idx: "-1", //当前选择项
      multipleSelection: [], //多选删除项
      songListId:''
    };
  },
  watch: {
    //动态搜索歌手
    select_word: function () {
      this.tableData = [];
      for (let item of this.tempData) {
        if (item.name.includes(this.select_word)) {
          this.tableData.push(item);
        }
      }
    },
  },
  created() {
    this.songListId=this.$route.query.id;
    this.getData();
  },
  methods: {
    //查询所有歌手
    getData() {
      this.tableData = [];
      this.tempData = [];
      console.log("歌单id"+this.songListId)
      queryListSongById(this.songListId)
        .then((res) => {
          console.log("根据歌单id查歌曲id")
          
          for(let item of res){
            this.getSong(item.songId);
          }
        })
        .catch((err) => {
          console.log(err);
        });
        console.log(this.tableData);
    },
    //根绝歌曲id查询歌曲信息,放到tableData和tempData
    getSong(id){
        getSongBySongId(id)
        .then((res)=>{
          console.log("根据歌曲查id")
          console.log(res);
          this.tempData.push(res);
          this.tableData.push(res)
        })
        .catch((err)=>{
          console.log(err);
        })
    },
    //添加歌曲前获取到歌曲id
    getSongId(){
      let _this=this;
      var songOfName=_this.registerForm.singerName+"-"+_this.registerForm.songName;
      console.log(songOfName);
      getSongBySongName(songOfName)
      .then((res)=>{
        console.log(res[0].id);
        this.addSong(res[0].id);
      })
    },
    //添加歌曲
    addSong(songId) {
       let params = new URLSearchParams();
      params.append("songId", songId);
      params.append("songListId", this.songListId);
      insertListSong(params)
        .then((res) => {
          console.log(res);
          if (res.code == 1) {
            this.notify("添加成功", "success");
            this.getData();
          } else {
            this.notify("添加失败", "error");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.centerDialogVisible = false;
    },
    //删除歌曲
    deleteRow() {
      deleteListSong(this.idx,this.songListId).then((res) => {
        if (res.code == 1) {
          this.notify("删除成功", "success");
          this.deleteVisible = false;
          this.getData();
             
        } else {
          this.notify("删除失败", "error");
        }
      });
    },

  },
};
</script>
<style  scoped>
.habdle-box {
  margin-bottom: 0px;
}
.song-img {
  width: 100%;
  height: 80px;
  border-radius: 5px;
  margin-bottom: 5px;
  overflow: hidden;
}
.handle-input {
  width: 300px;
  display: inline-block;
}
.pageination {
  display: flex;
  justify-content: center;
}
.play{
  position: absolute;
  z-index: 100;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
   font-size:250%;
   top:10px;
   left: 15px;

}
</style>