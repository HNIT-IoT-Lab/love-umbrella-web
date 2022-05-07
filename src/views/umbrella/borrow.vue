<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column prop="userName" label="姓名" />
      <el-table-column prop=" " label="学号" />
      <el-table-column prop="phoneNumber" label="电话号码" />
      <el-table-column prop="qqNumber" label="QQ" />
      <el-table-column prop="borrowDate" label="借伞时间">
        <template slot-scope="scope">{{
          scope.row.borrowDate | dateFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="borrowDurations" label="借伞时长" />
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            size="small "
            type="primary"
            @click="handleReturn(scope.row)"
            >归还</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 页面下面的导航 -->
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
  </div>
</template>

<script>
import { selectBorrowList, returnUmbrellaByAdmin } from "../../api/umbrella.js";
import moment from "moment";
export default {
  data() {
    return {
      loading: true,
      tableData: [], //借取雨伞的用户列表
      pageSizes: [10, 20, 30, 50, 100],
      total: 100,
      queryForm: {
        name: "",
        pageNo: 1,
        pageSize: 20,
      },
      dialogVisible: false, //dialog
    };
  },
  created() {
    //初始化数据
    this.getList();
  },
  methods: {
    getList() {
      selectBorrowList(this.queryForm).then(
        (res) => {
          if (res.code === 200) {
            this.tableData = res.data.records;
            this.total = res.data.Total;
            this.loading = false;
          }
        },
        (err) => {
          console.log(err);
        }
      );
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

    //   设置表格斑马线
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 4 === 0 ? "success-row" : "";
    },
    //由管理员手动归还雨伞
    handleReturn(val) {
      // 用户的key由固定字段(有英文冒号)：umbrellaOvertime:+用户姓名+openID
      let openID = val.openID;
      this.$confirm("是否手动归还该条用户的借伞信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = new URLSearchParams();
          params.append("openID", openID);
          returnUmbrellaByAdmin(params).then(
            (res) => {
              if (res.code === 200) {
                //刷新列表
                this.getList();
                setTimeout(() => {
                  this.confirm("归还成功", "消息提示");
                }, 500);
              } else {
                this.confirm(res.message, "归还失败");
              }
            },
            (err) => {
              this.confirm(err, "归还失败");
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消归还",
          });
        });
    },
  },
  filters: {
    dateFormat(date) {
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
  },
};
</script>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
