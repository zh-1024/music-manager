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
      :data="data"
      @selection-change="handleSelectChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="歌曲图片" width="110" align="center">
        <template slot-scope="scope">
          <div class="song-img">
            <img :src="getUrl(scope.row.pic)" style="width: 100%;filter: blur(1px);" />
          </div>
          <div class="play" @click="setSongUrl(scope.row.url,scope.row.name)">
            <div v-if="toggle!=scope.row.name"  >
            <i  class="el-icon-video-play" ></i>
          </div>
          <div v-if="toggle==scope.row.name" >
            <i  class="el-icon-video-pause" ></i>
          </div>
          </div>
           
          <el-upload
            :action="uploadUrl(scope.row.id)"
            :before-upload="beforeAvatorUpload"
            :on-success="handleAvatorSuccess"
          >
            <el-button size="mini">更新图片</el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="歌手-歌名" width="120" align="center">
      </el-table-column>
       <el-table-column prop="introduction" label="专辑" width="150" align="center">
      </el-table-column>
      <el-table-column label="歌词" align="center">
        <template slot-scope="scope">
             <el-input :rows="5.5" v-model="scope.row.lyric" type="textarea" readonly="readonly"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="资源更新" width="110" align="center">
        <template slot-scope="scope">
          <el-upload
            :action="uploadSongUrl(scope.row.id)"
            :before-upload="beforeSongUpload"
            :on-success="handleSongSuccess">
            <el-button size="small">上传歌曲<i class="el-icon-upload el-icon--right"></i></el-button>
          </el-upload>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row.id)" ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageination">
      <el-pagination
        background
        layout="total,prev,pager,next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="tableData.length"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <!-- 添加弹窗 -->
    <el-dialog  title="添加歌曲" :visible.sync="centerDialogVisible" width="400px" center>
      <el-form action="" :model="registerForm" id="tf">
         <el-form-item prop="name" label="歌曲名" size="mini">
          <el-input v-model="registerForm.name" name="name" placeholder="歌曲名"></el-input>
         </el-form-item>
         <el-form-item prop="introduction" label="专辑" size="mini">
          <el-input v-model="registerForm.introduction" name="introduction" placeholder="专辑"></el-input>
         </el-form-item>
         <el-form-item prop="lyric" label="歌词" size="mini">
          <el-input v-model="registerForm.lyric" name="lyric" placeholder="歌词"></el-input>
         </el-form-item>

        <div class="upload-demo">
          <label>歌曲上传</label>
          <br>
          <input class="with:80px" type="file" name="file" id="upadte-file-input">
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSong">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改弹窗 -->
    <el-dialog title="修改歌曲" :visible.sync="editVisible" width="400px" center>
      <el-form :model="editForm" ref="editForm" label-width="80px">
        <el-form-item prop="name" label="歌手-歌名" size="mini">
          <el-input v-model="editForm.name" placeholder="歌手-歌名"></el-input>
        </el-form-item>
        <el-form-item prop="introduction" label="专辑" size="mini">
          <el-input  v-model="editForm.introduction" placeholder="专辑"></el-input>
        </el-form-item>
        <el-form-item prop="lyric" label="歌词" size="mini">
          <el-input :rows="5" v-model="editForm.lyric" placeholder="歌词" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" size="small" @click="editVisible = false" >取消</el-button>
        <el-button type="primary" size="small" @click="editSave">确定</el-button>
      </span>
    </el-dialog>
    <!-- 删除弹窗 -->
    <el-dialog
      title="修改歌曲"
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
import { querySongsBySingerId,updateSong,delSong } from "../api/index";
import { mixin } from "../mixins/index";
import {mapGetters} from 'vuex';
export default {
  mixins: [mixin],
  data() {
    return {
      singerId:'',//歌手id
      singerName:'',//歌手名字
      centerDialogVisible: false, //添加 弹窗是否显示
      editVisible: false, //编辑弹窗是否显示
      deleteVisible: false, //删除弹窗是否显示
      registerForm: {
        //添加框
        name: "",
        singerName: "",
        introduction: "",
        lyric:''
      },
      editForm: {
        //添加框
        id: "",
        name: "",
        introduction: "",
        lyric:''
      },
      tableData: [],
      tempData: [],
      select_word: "",
      pageSize: 5, //分页大小
      currentPage: 1, //当前页
      idx: "-1", //当前选择项
      multipleSelection: [], //多选删除项
      toggle:'', //播放器显示图标状态
    };
  },
  computed: {
    data() {
      return this.tableData.slice(
        (this.currentPage - 1) * this.pageSize,
        this.currentPage * this.pageSize
      );
    },
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
    this.singerId=this.$route.query.id;
    this.singerName=this.$route.query.name;
    console.log(this.singerName);
    this.getData();
  },
  destroyed(){
    this.$store.commit('setIsPlay',false);
  },
  methods: {
    //查询所有歌手
    getData() {
      this.tableData = [];
      this.tempData = [];
      querySongsBySingerId(this.singerId)
        .then((res) => {
          this.tableData = res;
          console.log(res);
          this.tempData = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //添加歌
    
    addSong() {
      let _this=this;
      var form=new FormData(document.getElementById('tf'));
      form.append("singerId",this.singerId);
      form.set('name',this.singerName+'-'+form.get('name'));
      console.log(form);
      if(!form.get('lyric')){
        form.set('lyric','[00:00:00]暂无歌词');
      }
      var req=new XMLHttpRequest();
      req.onreadystatechange=function(){
        //req.readyState==4获取到返回到的完整数据
        //req.status==200正常交互完成
        if(req.readyState==4&&req.status==200){
          let res=JSON.parse(req.response);
          if(res.code){
            _this.getData();
            _this.registerForm={};
            _this.notify(res.message,"success");
          }else
          {
            _this.notify("保存失败","error");
          }
        }
      }
      req.open(`post`,`${_this.$store.state.HOST}/song/insertSong`,false);
      req.send(form);
      _this.centerDialogVisible = false;
    },
    //编辑歌手
    handleEdit(row) {
      this.editVisible = true;
      this.editForm = {
        id: row.id,
        name: row.name,
        introduction: row.introduction,
        lyric:row.lyric
      };
    },
    //保存修改
    editSave() {
      let params = new URLSearchParams();
      params.append("id", this.editForm.id);
      params.append("name", this.editForm.name);
      params.append("introduction", this.editForm.introduction);
      params.append("lyric", this.editForm.lyric);
      updateSong(params)
        .then((res) => {
          console.log(res);
          if (res.code == 1) {
            this.notify("修改成功", "success");
            this.getData();
          } else {
            this.notify("修改失败", "error");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.editVisible = false;
    },
    //删除一名歌手
    deleteRow() {
      delSong(this.idx).then((res) => {
        if (res.code == 1) {
          this.notify("删除成功", "success");
          this.deleteVisible = false;
          this.getData();
             
        } else {
          this.notify("删除失败", "error");
        }
      });
    },
    //更新图片
    uploadUrl(id) {
      return `${this.$store.state.HOST}/song/uploadImg?id=${id}`;
    },
    //获取当前页
    handleCurrentChange(val) {
      this.currentPage = val;
    },
     //上传歌曲之前的校验
        beforeSongUpload(file){
            var testMsg=file.name.substring(file.name.lastIndexOf('.')+1);
            if(testMsg!='mp3'){
                this.$message.error("请上传mp3格式文件");
                return false;
            }
           return true;
        },
        //上传歌曲成功之后
        handleSongSuccess(res){
            console.log(res);
            let _this=this;
            if(res.code==1){
                _this.getData();
                _this.$notify({
                    title: '上传成功',
                    type:'success'
                })
            }else
            {
                _this.$notify({
                    title: '上传失败',
                    type:'error'
                })
            }
        },
        //更新歌曲URL
        uploadSongUrl(id){
          return `${this.$store.state.HOST}/song/uploadSongFile?id=${id}`;
        },
        setSongUrl(url,name){
          if(this.toggle!=name){
            this.toggle=name;
            this.$store.commit('setUrl',this.$store.state.HOST+url);
            this.$store.commit('setIsPlay',true);
          }else
          {
            this.toggle='';
            this.$store.commit('setIsPlay',false);
          }
        }
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