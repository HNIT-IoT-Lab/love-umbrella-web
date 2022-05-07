<template>
  <div class="app-container">
    <el-table
      :data="tableData"
      :row-class-name="tableRowClassName"
      v-loading="loading"
      style="width: 100%"
    >
      <el-table-column prop="userName" label="姓名"> </el-table-column>
      <el-table-column prop="studentId" label="学号"> </el-table-column>
      <el-table-column prop="phoneNumber" label="电话号码"> </el-table-column>
      <el-table-column prop="qqNumber" label="QQ"> </el-table-column>
      <el-table-column prop="borrowDate" label="借伞时间">
        <template slot-scope="scope">{{
          scope.row.borrowDate | dateFormat
        }}</template>
      </el-table-column>
      <el-table-column prop="borrowDurations" label="借伞时长">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="small" @click="openAlamDialog(scope.row.openID)"
            >邮件提醒</el-button
          >
          <el-button
            size="small "
            type="primary"
            @click="handleDelete(scope.row)"
            >删除</el-button
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
    <!-- 对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose"
    >
      <el-form :model="form" status-icon>
        <el-form-item label="收件人" prop="addressee">
          <el-input v-model.number="form.addressee"></el-input>
        </el-form-item>
        <el-form-item label="收件人邮箱" prop="mailTo">
          <el-input v-model.number="form.mailTo"></el-input>
        </el-form-item>
        <el-form-item label="邮件主题" prop="subject">
          <el-input v-model.number="form.subject"></el-input>
        </el-form-item>
        <el-form-item label="邮件内容">
          <el-input type="textarea" v-model="form.emailMsg"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button
          type="primary"
          @click="dialogCommit"
          :loading="form.loading"
          >{{ commitButtonMsg }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  selectOverTimeList,
  sendAlarmEmail,
  deleteOvertime,
} from "../../api/umbrella.js";
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
      dialogTitle: "",
      dialogVisible: false,
      commitButtonMsg: "发 送",
      form: {
        //表单
        emailMsg: "同学你好,您借取爱心雨伞的时间已经超时了，请您尽快归还",
        addressee: "", //收件人姓名
        mailTo: "", //收件人地址
        subject: "爱心雨伞借取超时提醒", //邮件主题
        loading: false, //发送按钮是否处于加载状态
      },
      relus: {
        //表单信息校验
      },
    };
  },
  created() {
    //初始化数据
    this.getList();
  },
  methods: {
    getList() {
      selectOverTimeList(this.queryForm).then(
        (res) => {
          if (res.code === 200) {
            this.tableData = res.data.records;
            this.total = res.data.Total;
            this.loading = false; //取消加载框
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
    // 邮件提醒
    openAlamDialog(val) {
      let userObj;
      this.tableData.forEach((obj) => {
        if (obj.openID === val) {
          userObj = obj;
        }
      });
      //更新一下表单中的默认数据
      this.form = {
        emailMsg: "同学你好,您借取爱心雨伞的时间已经超时了，请您尽快归还",
        addressee: userObj.userName,
        mailTo: userObj.emailAddress, //收件人地址
        subject: "爱心雨伞借取超时提醒", //邮件主题
        loading: false, //发送按钮是否处于加载状态
      };
      //发送按钮是否处于加载状态;
      //显示dialog框
      this.dialogTitle = "邮件提醒";
      this.dialogVisible = true;
    },
    //取消编辑
    handleClose(done) {
      this.dialogVisible = false;
      this.clearDialogData();
    },
    //清除表格数据
    clearDialogData() {},
    //删除该条记录
    handleDelete(val) {
      // 用户的key由固定字段(有英文冒号)：umbrellaOvertime:+用户姓名+openID
      let openID = val.openID;
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let params = new URLSearchParams();
          params.append("openID", openID);
          deleteOvertime(params).then(
            (res) => {
              if (res.code === 200) {
                //刷新列表
                this.getList();
                setTimeout(() => {
                  this.confirm("删除成功", "消息提示");
                }, 500);
              } else {
                this.confirm(res.message, "删除失败");
              }
            },
            (err) => {
              this.confirm(err, "删除失败");
            }
          );
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    //提交表单数据
    dialogCommit() {
      //检查表单后发送成功
      this.form.loading = true;
      let params = new URLSearchParams();
      params.append("mailTo", this.form.mailTo);
      params.append("content", this.form.emailMsg);
      params.append("subject", this.form.subject);
      sendAlarmEmail(params).then(
        (res) => {
          //关闭表单
          this.dialogVisible = false;
          setTimeout(() => {
            if (res.code === 200) {
              //成功
              this.confirm("发送成功", "消息提醒");
            } else {
              this.confirm(res.data, "错误提醒");
            }
          }, 500);
        },
        (err) => {
          this.confirm("系统错误，" + err, "消息提醒");
          //关闭表单
          this.dialogVisible = false;
        }
      );
    },
    //   设置表格斑马线
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 4 === 0 ? "success-row" : "";
    },
    //确认框，只有确认按钮
    confirm(content, title) {
      this.$alert(content, title, {
        confirmButtonText: "确定",
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
