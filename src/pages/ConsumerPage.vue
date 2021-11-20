<template>
  <div class="table">
    <div class="container">
      <div class="habdle-box">
        <el-input
          v-model="select_word"
          size="mini"
          placeholder="请输入用户名"
          class="handle-input"
        ></el-input>
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
      <el-table-column label="用户头像" width="110" align="center">
        <template slot-scope="scope">
          <div class="singer-img">
            <img :src="getUrl(scope.row.avatar)" style="width: 100%" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="120" align="center"></el-table-column>
       <el-table-column label="密码" width="120" align="center">
        <template slot-scope="scope">
          {{ getSex(scope.row.password) }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="50" align="center">
        <template slot-scope="scope">
          {{ getSex(scope.row.sex) }}
        </template>
      </el-table-column>
       <el-table-column label="手机号" width="120" align="center">
        <template slot-scope="scope">
          {{ getSex(scope.row.phoneNum) }}
        </template>
      </el-table-column>
      <el-table-column label="邮箱" width="120" align="center">
        <template slot-scope="scope">
          {{ getSex(scope.row.email) }}
        </template>
      </el-table-column>
      <el-table-column label="生日" width="120" align="center">
        <template slot-scope="scope">
          {{ getBirth(scope.row.birth) }}
        </template>
      </el-table-column>
      <el-table-column label="地区" prop="location" width="100" align="center"></el-table-column>
      <el-table-column label="签名">
        <template slot-scope="scope">
            {{ scope.row.introduction }}
        </template>
      </el-table-column>
      <el-table-column label="禁用/启用" width="150" align="center">
        <template slot-scope="scope">
            <el-switch
                v-model="scope.row.forbidden"
                active-color="#13ce66"
                @change="forbidUser1(scope.row.forbidden,scope.row.id)">
            </el-switch>
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
  </div>
</template>
<script>
import { getAllgetAllUser,forbidUser} from "../api/index";
import { mixin } from "../mixins/index";
export default {
  mixins: [mixin],
  data() {
    return {
      value:1,
      registerForm: {
        //添加框
        name: "",
        password:"",
        sex: "",
        phoneNum:"",
        email:"",
        birth: "",
        location: "",
        introduction: "",
        forbidden:""
      },
      tableData: [],
      tempData: [],
      select_word: "",
      pageSize: 6, //分页大小
      currentPage: 1, //当前页
      idx: "-1", //当前选择项
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
    //动态搜索用户
    select_word: function () {
      this.tableData = [];
      for (let item of this.tempData) {
        if (item.username.includes(this.select_word)) {
          this.tableData.push(item);
        }
      }
    },
  },
  created() {
    this.getData();
  },
  methods: {
    //查询所有用户
    getData() {
      this.tableData = [];
      this.tempData = [];
      getAllgetAllUser()
        .then((res) => {
          for(var i=0;i<res.length;i++)
            {
                if(res[i].forbidden=='1')
                    res[i].forbidden=true;
                else
                    res[i].forbidden=false;
            }
          this.tableData = res;
          this.tempData = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //禁止用户
    forbidUser1(forbidden,id){
        if(forbidden)
            forbidden=1;
        else
            forbidden=0;
       forbidUser(forbidden,id)
        .then((res)=>{
            if(res.code==1)
             this.notify("操作成功", "success");
             else
             this.notify("操作失败","error");
        })
        .catch((err)=>{
            console.log(err);
        })
    },
    //获取当前页
    handleCurrentChange(val) {
      this.currentPage = val;
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