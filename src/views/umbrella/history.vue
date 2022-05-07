<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column prop="id" label="索引"> </el-table-column>
      <el-table-column prop="userName" label="姓名"> </el-table-column>
      <el-table-column prop="studentId" label="学号"> </el-table-column>
      <el-table-column prop="borrowDate" label="借伞时间">
        <template slot-scope="scope">{{
          scope.row.borrowDate | dateFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="returnDate" label="还伞时间">
        <template slot-scope="scope">{{
          scope.row.returnDate | dateFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="borrowDurations" label="借伞时长">
      </el-table-column>
      <el-table-column prop="borrowStatus" label="是否归还">
        <template slot-scope="scope">{{
          scope.row.borrowStatus | statusFormat
        }}</template>
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
import { selectHistoryBorrow } from "../../api/umbrella.js";
import moment from "moment";
export default {
  data() {
    return {
      loading: true,
      tableData: [], //借取雨伞的用户列表
      pageSizes: [10, 20, 30, 50, 100],
      total: 100,
      queryForm: {
        name: undefined,
        pageNo: 1,
        pageSize: 20,
      },
    };
  },
  created() {
    //初始化数据
    this.getList();
  },
  methods: {
    getList() {
      selectHistoryBorrow(this.queryForm).then(
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
  },
  filters: {
    dateFormat(date) {
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    statusFormat(status) {
      return status === 0 ? "已归还" : "未归还";
    },
  },
};
</script>

<style scope>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
