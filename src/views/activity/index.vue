<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :model="queryForm" :inline="true">
        <el-form-item label="活动名称" prop="activityName">
          <!-- 活动名称 -->
          <el-input
            placeholder="请输入活动名称"
            size="medium"
            v-model="queryForm.activityName"
            clearable
            style="width: 150px;"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="活动状态" prop="status">
          <!-- 活动状态 -->
          <el-select 
            size="medium" v-model="queryForm.status" clearable placeholder="请选择状态">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动地点" prop="activityAddress">
          <!-- 活动地点 -->
          <el-input
            placeholder="请输入活动地点"
            size="medium"
            v-model="queryForm.activityAddress"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <!-- 搜索按钮 -->
          <el-button type="primary" icon="el-icon-search" @click="doSearch" style="margin-left: 10px;">搜索</el-button>
          <el-button type="success" icon="el-icon-plus" @click="openAddDialog()">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="id" label="ID" width="50"> </el-table-column>
      <el-table-column prop="activityName" label="活动名称"> </el-table-column>
      <el-table-column label="活动人数" width="90">
        <template slot-scope="scope">
          {{ scope.row.numberOfAttendees }}/{{ scope.row.numberOfNeed }}
        </template>
      </el-table-column>
      <el-table-column prop="activityAddress" label="活动地点">
      </el-table-column>
      <el-table-column prop="rewardPoints" label="奖励" width="70">
        <template slot-scope="scope">
          {{scope.row.rewardPoints}} 学分
        </template>
      </el-table-column>
      <el-table-column prop="predictDuration" label="预计花费时长" width="70">
        <template slot-scope="scope">
          {{scope.row.predictDuration}} 小时
        </template>
      </el-table-column>
      <el-table-column prop="actualDuration" label="实际花费时长" width="70"> 
        <template slot-scope="scope">
          <span v-if="scope.row.status === '02' && scope.row.isAudited === 1">{{scope.row.actualDuration}} 小时</span>
          <span v-else>未审核</span>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="活动开始时间"> </el-table-column>
      <el-table-column prop="endTime" label="活动结束时间" > </el-table-column>
      <el-table-column prop="status" label="状态" width="70">
        <template slot-scope="scope">
          {{ reversedStatus(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column prop="description" label="活动描述"> </el-table-column>
      <el-table-column label="操作" width="150">
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
      <el-form ref="form" :model="activityInfo" label-width="100px">
        <el-form-item label="ID" v-if="isEdit">
          <el-input v-model="activityInfo.id"></el-input>
        </el-form-item>
        <el-form-item label="活动名称">
          <el-input v-model="activityInfo.activityName"></el-input>
        </el-form-item>
        <el-form-item label="所需人数">
          <el-input v-model="activityInfo.numberOfNeed" type="number"></el-input>
        </el-form-item>
        <el-form-item label="活动地点">
          <el-input v-model="activityInfo.activityAddress"></el-input>
        </el-form-item>
        <el-form-item label="奖励(学分)">
          <el-input v-model="activityInfo.rewardPoints" type="number"></el-input>
        </el-form-item>
        <el-form-item label="预计花费时长(小时)">
          <el-input v-model="activityInfo.predictDuration" type="number"></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input v-model="activityInfo.contactName" type="text"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="activityInfo.contactNumber" type="text"></el-input>
        </el-form-item>
        <el-form-item label="时间">
          <el-date-picker
            v-model="activityDate"
            @change="dateChange"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动描述">
          <el-input v-model="activityInfo.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="活动图片">
          <el-upload
          :action="uploadUrl"
          :on-success="uploadImgSuccess"
          :on-error="uploadImgErr"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          name="file"
          :limit="fileNum"
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
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
import moment from "moment"
import {
  fetchData,
  getById,
  update,
  deleteById,
  add,
} from "../../api/activity";
import{
  uploadImg,
} from "../../api/upload";
export default {
  computed: {
    // 从仓库中获取解构的数据
    //...mapState("volunteer", ["total", "currentPage", "pageSize", "tableData"]),
    
  },
  name: "ComplexTable",
  components: {},
  directives: {},
  filters: {},
  /**
   * 数据
   */
  data() {
    return {
      pageSizes: [10, 20, 30, 50, 100],
      total: 100,
      tableData: [],
      queryForm: {
        activityName: "",
        pageNo: 1,
        pageSize: 20,
      },
      dialogTitle: "",
      dialogVisible: false,
      activityInfo: {},
      activityDate: [],
      isEdit: true,
      dialogCommitButtonName: "新 增",
      showPassword: true,
      // 图片列表[{name,url}]
      fileList: [],
      // 上传图片的url
      uploadUrl: 'http://localhost:8080/oss/uploadImg/',
      // 文件上传数量
      fileNum: 1,
      // 活动状态下拉选项
      statusOptions: [{
        value: '00',
        label: '进行中'
      },{
        value: '01',
        label: '招募中'
      },{
        value: '02',
        label: '已结束'
      }]
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
      this.dialogTitle = "编 辑";
      let param = {
        id: id,
      };
      this.clearDialogData();
      getById(param)
        .then((response) => {
          console.log(response);
          if(response.code === 200) {
            this.activityInfo = response.data;
            this.fileList = [{
              'nane': '封面图',
              'url': response.data.activityImg
            }];
            this.activityDate.push(this.activityInfo.startTime,this.activityInfo.endTime);
          }
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
      this.activityInfo = {};
      this.fileList = [];
    },
    handleClose(done) {
      this.activityDate = []
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
    /**
     * 更新
     */
    handleUpdate() {
      if (this.activityInfo.id) {
        update(this.activityInfo)
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
      add(this.activityInfo)
        .then((response) => {
          if (response.code == 200) {
            this.$message({
              message: "新增成功",
              type: "success",
            });
            this.dialogVisible = false;
            this.clearDialogData();
            this.getList();
            this.dialogVisible = false;
          } else {
            this.$message.error(response.message);
          }
        })
        .catch((err) => {
          console.log(err);
          this.$message.error("网络异常");
        });
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
    reversedStatus(status) {
        if(status === '01') {
          return "招募中";
        } else if (status === '00') {
          return "进行中";
        }else {
          return "已结束";
        }
    },
    handleRemove(file, fileList) {
      console.log('文件移除')
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    uploadImgSuccess(response, file, fileList) {
      console.log('文件上传成功')
      this.activityInfo.activityImg = response.data;
      fileList = [{
        'nane': file.name,
        'url': response.data
      }]
      console.log(response);
      console.log(file);
    },
    uploadImgErr(err, file, fileList) {
      console.log('文件上传失败')
      console.log(err,file,fileList)
    },
    /** 选择的日期发生改变 */
    dateChange() {
      if(this.activityDate[0] != undefined && this.activityDate[1] != undefined) {
        console.log(this.activityDate[0],this.activityDate[1]);
        this.activityInfo.startTime = this.activityDate[0];
        this.activityInfo.endTime = this.activityDate[1];
      }
    }
  },
};
</script>
