<template>
  <div>
    <div class="miniPrograms-content">
      <el-row :gutter="20" class="el-row" type="flex">
        <el-col :span="8" class="el-col" v-for="(item, index) in swiperList">
          <el-card @click.native="clickCardButton(item)">
            <span>{{ item.title }}</span>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="50%">
      <el-form :model="form" status-icon>
        <el-form-item label="活动标题" prop="addressee">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="活动概述">
          <el-input type="textarea" v-model="form.summary"></el-input>
        </el-form-item>
        <el-form-item label="活动图片">
          <el-upload
            ref="doctypeCrfile"
            class="upload-demo"
            list-type="picture"
            :action="uploadUrl"
            :data="getParams"
            :on-preview="handlePreview"
            :on-success="handleUploadSuccess"
            :before-remove="handlebeforeremove"
            :file-list="getUrl"
          >
            <el-button size="small" type="primary">选择图片并上传</el-button>
            <span style="margin-left: 10px"
              >注意，一个活动不能有两张主题图片，请先删除下面的图片！</span
            >
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="danger" @click="deleteButton">删除当前活动</el-button>
        <el-button type="primary" @click="updateButton">修改当前活动</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getImageList, deleteImage, updateImage } from "../../api/umbrella.js";
export default {
  data() {
    return {
      uploadUrl: "",
      storePath: "qxImages/categoryImages2/", //图片在oss中的路径
      //对话框部分
      dialogTitle: "志愿活动详情",
      dialogVisible: false, //是否展示卡片
      //从服务器拿到的活动信息，包括图片url、描述、标题等等
      swiperList: [],
      //这是当前打开窗口的图片地址,只显示一张但是还是得封装成一个数组
      imageUrl: [],
      form: {
        //表单
        storePath: "",
        summary: "",
        title: "", //邮件主题
        url: "",
        uid: "",
      },
    };
  },
  methods: {
    /**
     * 用户点击了卡片
     */
    clickCardButton(obj) {
      /**
       * 将当前表单的数据渲染,这里需要注意，饿了么<el-upload>组件回显图标的:file-list必须返回一个数组,里面存放对象
       */
      this.form = {
        storePath: obj.storePath,
        summary: obj.summary,
        title: obj.title,
        uid: obj.uid,
        url: obj.url,
      };
      this.dialogVisible = true;
    },
    // 上传组件部分
    /**
     * 上传之前的钩子
     */
    handlePreview(file) {
      console.log(file);
    },
    /**
     * 上传成功的钩子
     */
    handleUploadSuccess(res, file) {
      this.form.imageUrl = URL.createObjectURL(file.raw);
    },
    /**
     * 上传失败的钩子函数
     */
    handFail(err, file, fileList) {
      this.confirm("图片上传失败:" + err, "错误提示");
    },
    /**
     * 删除图片之前的钩子
     */
    handlebeforeremove(file, fileList) {},
    //对话框部分
    /**
     * 用户点击dialog里的更新按钮
     */
    updateButton() {
      let params = new URLSearchParams();
      params.append("storePath", this.form.storePath);
      params.append("summary", this.form.summary);
      params.append("title", this.form.title);
      params.append("uid", this.form.uid);
      params.append("url", this.form.url);
      updateImage(params).then(
        (res) => {
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: "更新成功!",
            });
            //刷新数据
            this.getswiperList();
            this.dialogVisible = false;
          }
        },
        (err) => {
          his.$message({
            type: "success",
            message: "更新失败!" + err,
          });
        }
      );
    },
    deleteButton() {
      //提示用户确认,传入用户确认之后的回调函数
      this.confirm(() => {
        let params = new URLSearchParams();
        params.append("key", this.storePath + ":" + this.form.url);
        deleteImage(params).then(
          (res) => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              //刷新界面
              this.getswiperList();
              setTimeout(() => {
                this.dialogVisible = false;
              }, 500);
            }
          },
          (err) => {
            this.$message({
              type: "fail",
              message: "删除失败!" + err,
            });
          }
        );
      });
    },
    /**
     * 从服务器后台得到图片列表
     */
    getswiperList() {
      let params = new URLSearchParams();
      params.append("storePath", this.storePath);
      getImageList(params).then(
        (res) => {
          //由于后端序列化问题，这里传过来的是字符串，需要转成对象
          let obj = JSON.parse(res.data);
          //将url从对象中取出来
          this.swiperList = obj.swiperList;
        },
        (err) => {
          this.confirm("获取服务器图片失败" + err, "错误提示");
        }
      );
    },
    /**
     * 确认框，传入一个确认删除的回调函数
     */
    confirm(callback) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          callback();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  /**
   * vue渲染界面之前的钩子，可以访问data和methods里的方法
   */
  created() {
    //先读取下配置文件，拿到图片自动上传的地址
    let appData = require("../../data.json");
    this.uploadUrl = appData.umbrella_upload_url;
    this.getswiperList();
  },
  computed: {
    /**
     * 阻止一个界面上传多张图片
     */
    uploadDisabled() {
      return this.imagelist.length > 0;
    },
    /**
     * 这一要返回一个数组，里面包对象，对象里面必须要有uid和url两个属性
     */
    getUrl() {
      let arr = [
        {
          uid: this.form.uid,
          url: this.form.url,
        },
      ];
      return arr;
    },
    //将每一张图片的信息都封装起来
    getParams: {
      get: function () {
        return {
          uid: this.form.uid,
          title: this.form.title,
          summary: this.form.summary,
          storePath: this.storePath, //图片存在oss中的相对路径，ex：qxImages/categoryImages0/")
        };
      },
      set: function () {},
    },
  },
};
</script>

<style>
/* 让整个模块居中 */
.miniPrograms-content {
  position: absolute;
  top: 45%;
  left: 45%;
  transform: translate(-50%, -50%);
}
/* 九宫格样式 */
.all {
  margin-top: -30px;
  word-break: break-all;
  height: 100%;
}
.mid {
  margin-top: 25%;
  height: 50%;
}
.mid_item {
  justify-content: center;
  align-items: center;
}
.item {
  margin-bottom: 10px;
}
.item_tag {
  float: left;
  text-align: left;
}
.item_desr {
  margin-left: 40%;
  min-height: 30px;
  text-align: left;
}
.text {
  width: 100%;
  font-size: 12px;
  font-family: "Microsoft YaHei";
  color: #909399;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.el-card {
  min-width: 100%;
  height: 100%;
  margin-right: 20px;
  text-align: center;
  /*transition: all .5s;*/
}
.el-card:hover {
  margin-top: -5px;
  color: rgb(74, 121, 250);
}
.el-row {
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
}
.el-col {
  border-radius: 4px;
  align-items: stretch;
  margin-bottom: 40px;
}

/* 上传图片组件样式 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
/* 上传了一张图片后就需要隐藏列表,一个活动只能上传一张图片 */
.disabled .el-upload--picture-card {
  display: none;
}
</style>
