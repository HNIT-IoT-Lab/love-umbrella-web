<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="queryForm" :inline="true">
        <el-form-item label="ID" prop="id">
          <!-- ID搜索条件 -->
          <el-input
            placeholder="请输入ID"
            size="medium"
            v-model="queryForm.id"
            clearable
            style="width: 150px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <!-- 姓名搜索条件 -->
          <el-input
            placeholder="请输入姓名"
            size="medium"
            v-model="queryForm.name"
            clearable
            style="width: 150px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="学院" prop="institude">
          <!-- 学院搜索条件 -->
          <el-input
            placeholder="请输入学院"
            size="medium"
            v-model="queryForm.institude"
            clearable
            style="width: 150px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="专业" prop="major">
          <!-- 专业搜索条件 -->
          <el-input
            placeholder="请输入专业"
            size="medium"
            v-model="queryForm.major"
            clearable
            style="width: 150px"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <!-- 手机号搜索条件 -->
          <el-input
            placeholder="请输入手机号"
            size="medium"
            v-model="queryForm.phoneNumber"
            clearable
            style="width: 150px"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <!-- 搜索按钮 -->
          <el-button type="primary" icon="el-icon-search" @click="doSearch"
            >搜索</el-button
          >
          <el-button type="success" @click="openAddDialog()">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID"> </el-table-column>
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="institude" label="学院"> </el-table-column>
      <el-table-column prop="major" label="专业"> </el-table-column>
      <el-table-column prop="phoneNumber" label="手机号"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="openEditDialog(scope.row.id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryForm.pageNo"
        :page-sizes="pageSizes"
        :page-size="queryForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="volunteerInfo" label-width="100px">
        <el-form-item label="志愿者姓名">
          <el-input v-model="volunteerInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="学 院">
          <el-input v-model="volunteerInfo.institude"></el-input>
        </el-form-item>
        <el-form-item label="专 业">
          <el-input v-model="volunteerInfo.major"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="volunteerInfo.phoneNumber"
            type="number"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮 箱">
          <el-input
            v-model="volunteerInfo.emailAddress"
            type="email"
          ></el-input>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="volunteerInfo.studentId" type="number"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="volunteerInfo.password"
            type="password"
            :show-password="showPassword"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="dialogCommit">{{
          dialogCommitButtonName
        }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
//import { mapState, mapActions, mapMutations } from "vuex";
import {
  fetchData,
  getById,
  update,
  deleteById,
  add,
} from "../../api/volunteer";
export default {
  computed: {
    // 从仓库中获取解构的数据
    //...mapState("volunteer", ["total", "currentPage", "pageSize", "tableData"]),
  },
  name: "ComplexTable",
  components: {},
  directives: {},
  filters: {},
  data() {
    return {
      pageSizes: [10, 20, 30, 50, 100],
      total: 100,
      tableData: [],
      queryForm: {
        name: undefined,
        pageNo: 1,
        pageSize: 20,
      },
      dialogTitle: "",
      dialogVisible: false,
      volunteerInfo: {},
      isEdit: true,
      dialogCommitButtonName: "新 增",
      showPassword: true,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    //...mapActions("volunteer", ["fetchData"]),
    //...mapMutations("volunteer", ["setPageSize"]),
    getList() {
      // 获取表格数据
      fetchData(this.queryForm).then((response) => {
        if (response.code == 200) {
          console.log(response);
          this.tableData = response.data.records;
          this.total = response.data.total;
          this.queryForm.pageNo = response.data.current;
          this.queryForm.pageSize = response.data.size;
        } else {
          this.$message.error("列表数据更新异常");
        }
      });
    },
    doSearch() {
      this.queryForm.pageNo = 1;
      this.queryForm.pageSize = 20;
      this.getList();
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.queryForm.pageNo = val;
      this.getList();
    },
    openEditDialog(id) {
      this.dialogCommitButtonName = "修 改";
      this.dialogTitle = "编辑志愿者";
      let param = {
        id: id,
      };
      this.clearDialogData();
      getById(param)
        .then((response) => {
          this.volunteerInfo = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
      this.dialogVisible = true;
    },
    openAddDialog() {
      this.dialogCommitButtonName = "新 增";
      this.isEdit = false;
      this.dialogTitle = "新增志愿者";
      this.clearDialogData();
      this.dialogVisible = true;
    },
    clearDialogData() {
      this.volunteerInfo = {};
    },
    handleClose(done) {
      this.dialogVisible = false;
      this.clearDialogData();
    },
    dialogCommit() {
      if (this.isEdit) {
        this.handleUpdate();
      } else {
        this.handleAdd();
      }
    },
    handleUpdate() {
      if (this.volunteerInfo.id) {
        update(this.volunteerInfo)
          .then((response) => {
            if (response.code == 200) {
              this.$message({
                message: "编辑成功",
                type: "success",
              });
              this.dialogVisible = false;
              this.clearDialogData();
              this.getList();
            } else {
              this.$message.error(response.message);
            }
          })
          .catch((err) => {
            console.log(err);
            this.$message.error("网络异常");
          });
      }
    },
    handleAdd() {
      console.log("新增了");
      add(this.volunteerInfo)
        .then((response) => {
          if (response.code == 200) {
            this.$message({
              message: "新增成功",
              type: "success",
            });
            this.dialogVisible = false;
            this.clearDialogData();
            this.getList();
          } else {
            this.$message.error(response.message);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("网络异常");
        });
      this.dialogVisible = false;
    },
    handleDelete(id) {
      deleteById(id)
        .then((response) => {
          if (response.code == 200) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getList();
          } else {
            this.$message.error("删除失败");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("网络异常");
        });
    },
  },
};
</script>
