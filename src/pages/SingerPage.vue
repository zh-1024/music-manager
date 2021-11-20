<template>
  <div class="table">
    <div class="container">
      <div class="habdle-box">
        <el-button type="primary" size="mini" @click="delAll">批量删除</el-button>
        <el-input
          v-model="select_word"
          size="mini"
          placeholder="请输入歌手名"
          class="handle-input"
        ></el-input>
        <el-button
          type="primary"
          size="mini"
          @click="centerDialogVisible = true"
          >添加歌手</el-button
        >
      </div>
    </div>

    <el-table
      size="mini"
      border
      style="width: 100%"
      height="665px"
      :data="data"
      @selection-change="handleSelectChange"
    >
      <el-table-column type="selection" width="40"></el-table-column>
      <el-table-column label="歌手图片" width="110" align="center">
        <template slot-scope="scope">
          <div class="singer-img">
            <img :src="getUrl(scope.row.picture)" style="width: 100%" />
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
      <el-table-column prop="name" label="歌手名" width="120" align="center">
      </el-table-column>
      <el-table-column label="性别" width="50" align="center">
        <template slot-scope="scope">
          {{ getSex(scope.row.sex) }}
        </template>
      </el-table-column>
      <el-table-column label="生日" width="120" align="center">
        <template slot-scope="scope">
          {{ getBirth(scope.row.birth) }}
        </template>
      </el-table-column>
      <el-table-column
        label="地区"
        prop="location"
        width="100"
        align="center"
      ></el-table-column>
      <el-table-column label="简介">
        <template slot-scope="scope">
          <el-scrollbar height="100px">
          <p >
            {{ scope.row.introduction }}
          </p>
          </el-scrollbar>
        </template>
      </el-table-column>
      <el-table-column label="歌曲管理" width="110">
        <template slot-scope="scope">
          <el-button size="mini" @click="songEdit(scope.row.id, scope.row.name)"
            >歌曲管理</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle @click="handleEdit(scope.row)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row.id)"></el-button>
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
    <el-dialog
      title="添加歌手"
      :visible.sync="centerDialogVisible"
      width="400px"
      center
    >
      <el-form :model="registerForm" ref="registerForm" label-width="80px">
        <el-form-item prop="name" label="歌手名" size="mini">
          <el-input v-model="registerForm.name" placeholder="歌手名"></el-input>
        </el-form-item>
        <el-form-item label="性别" size="mini">
          <el-radio-group v-model="registerForm.sex">
            <el-radio label="0">女</el-radio>
            <el-radio label="1">男</el-radio>
            <el-radio label="2">组合</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="birth" label="生日" size="mini">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="registerForm.birth"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="location" label="地区" size="mini">
          <el-input
            v-model="registerForm.location"
            placeholder="地区"
          ></el-input>
        </el-form-item>
        <el-form-item prop="introduction" label="简介" size="mini">
          <el-input
            v-model="registerForm.introduction"
            placeholder="简介"
            type="textarea"
            :rows="5"
            style=""
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          type="primary"
          size="small"
          @click="centerDialogVisible = false"
          >取消</el-button
        >
        <el-button type="primary" size="small" @click="addSinger"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改弹窗 -->
    <el-dialog
      title="修改歌手"
      :visible.sync="editVisible"
      width="400px"
      center
    >
      <el-form :model="editForm" ref="editForm" label-width="80px">
        <el-form-item prop="name" label="歌手名" size="mini">
          <el-input v-model="editForm.name" placeholder="歌手名"></el-input>
        </el-form-item>
        <el-form-item label="性别" size="mini">
          <el-radio-group v-model="editForm.sex">
            <el-radio label="0">女</el-radio>
            <el-radio label="1">男</el-radio>
            <el-radio label="2">组合</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="birth" label="生日" size="mini">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="editForm.birth"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item prop="location" label="地区" size="mini">
          <el-input v-model="editForm.location" placeholder="地区"></el-input>
        </el-form-item>
        <el-form-item prop="introduction" label="简介" size="mini">
          <el-input
            v-model="editForm.introduction"
            placeholder="简介"
            type="textarea"
            :rows="5"
            style=""
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" size="small" @click="editVisible = false"
          >取消</el-button
        >
        <el-button type="primary" size="small" @click="editSave"
          >确定</el-button
        >
      </span>
    </el-dialog>
    <!-- 删除弹窗 -->
    <el-dialog
      title="修改歌手"
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
import { setSinger, getAllSinger, updateSinger, delSinger } from "../api/index";
import { mixin } from "../mixins/index";
export default {
  mixins: [mixin],
  data() {
    return {
      centerDialogVisible: false, //添加 弹窗是否显示
      editVisible: false, //编辑弹窗是否显示
      deleteVisible: false, //删除弹窗是否显示
      registerForm: {
        //添加框
        name: "",
        sex: "",
        birth: "",
        location: "",
        introduction: "",
      },
      editForm: {
        //添加框
        id: "",
        name: "",
        sex: "",
        birth: "",
        location: "",
        introduction: "",
      },
      tableData: [],
      tempData: [],
      select_word: "",
      pageSize: 5, //分页大小
      currentPage: 1, //当前页
      idx: "-1", //当前选择项
      multipleSelection: [], //多选删除项
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
    this.getData();
  },
  methods: {
    //查询所有歌手
    getData() {
      this.tableData = [];
      this.tempData = [];
      getAllSinger()
        .then((res) => {
          this.tableData = res;
          this.tempData = res;
          console.log(res);
          console.log("获取歌手");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //添加歌手
    addSinger() {
      let d = this.registerForm.birth;
      let datetime =
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      console.log(datetime);
      let params = new URLSearchParams();
      params.append("name", this.registerForm.name);
      params.append("picture", "/img/singerPic/singer.jpg");
      params.append("birth", datetime);
      params.append("location", this.registerForm.location);
      params.append("sex", this.registerForm.sex);
      params.append("introduction", this.registerForm.introduction);
      console.log("参数" + params);
      setSinger(params)
        .then((res) => {
          console.log(res);
          if (res.code == 1) {
            this.getData();
            this.notify("添加成功", "success");
          } else {
            this.notify("添加失败", "error");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      this.centerDialogVisible = false;
    },
    //编辑歌手
    handleEdit(row) {
      this.editVisible = true;
      this.editForm = {
        id: row.id,
        name: row.name,
        sex: row.sex,
        birth: row.birth,
        location: row.location,
        introduction: row.introduction,
      };
      console.log(this.editForm);
    },
    //保存修改
    editSave() {
      let d = new Date(this.editForm.birth);
      let datetime =
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      console.log(datetime);
      let params = new URLSearchParams();
      params.append("id", this.editForm.id);
      params.append("name", this.editForm.name);
      params.append("birth", datetime);
      params.append("location", this.editForm.location);
      params.append("sex", this.editForm.sex);
      params.append("introduction", this.editForm.introduction);
      updateSinger(params)
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
      console.log(this.idx);
      delSinger(this.idx).then((res) => {
        if (res.code == 1) {
          this.notify("删除成功", "success");
          this.getData();
          this.deleteVisible = false;
        } else {
          this.notify("删除失败", "error");
        }
      });
    },
    //更新图片
    uploadUrl(id) {
      return `${this.$store.state.HOST}/singer/uploadImg?id=${id}`;
    },
    //获取当前页
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    //转向歌曲管理页面
    songEdit(id, name) {
      this.$router.push({ path: `/Song`, query: { id, name } });
    },
  },
};
</script>
<style  scoped>
.habdle-box {
  margin-bottom: 0px;
}
.singer-img {
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

</style>