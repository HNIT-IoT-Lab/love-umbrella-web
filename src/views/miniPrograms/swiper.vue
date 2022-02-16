<template>
  <div style="app-container">
    <div class="miniPrograms-swiper">
      <el-form ref="form" label-width="80px" label-position="left">
        <el-form-item label="模块选择">
          <el-select v-model="selectBoxValue" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查看">
          <el-button @click="openDialog">查看微信里现存图片</el-button>
        </el-form-item>
      </el-form>
      <el-upload
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          上传图片不超过10MB，首页轮播图比例3:2最佳，关于青协界面5:2最佳
        </div>
      </el-upload>
    </div>
    <!-- 参看服务器类图片的表单 -->
    <el-dialog :title="selectBoxValue" :visible.sync="dialogFormVisible">
      <el-upload
        :action="uploadUrl"
        :data="getParams"
        list-type="picture-card"
        :before-remove="handleRemove"
        :file-list="swiperList"
        :on-error="handFail"
        :before-upload="beforeUpload"
        ref="myupload"
        :on-preview="handlePictureCardPreview"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="" />
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelButton">取 消</el-button>
        <el-button type="primary" @click="confirmButton">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getImageList, deleteImage } from "../../api/umbrella.js";
export default {
  data() {
    return {
      options: [
        {
          value: "首页轮播图",
          label: "首页轮播图",
        },
        {
          value: "关于青协界面轮播图",
          label: "关于青协界面轮播图",
        },
      ],
      selectBoxValue: "", //选择框值
      dialogTableVisible: false,
      dialogFormVisible: false, //参看微信中现存图片
      dialogImageUrl: "",
      dialogVisible: false, //参看微信中现存图片里的dialog
      uploadUrl: "http://localhost:8080/miniProgram/upLoadImage/",
      swiperList: [],
    };
  },
  methods: {
    openDialog() {
      if (!this.selectBoxValue) {
        this.confirm("没有选择模块", "消息提示");
      } else {
        //先请求服务器里存放的图片
        this.getswiperList();
        //先将用户之前存的图片显示出来
        this.dialogFormVisible = true;
      }
    },
    /**
     * 用户手动删除图片的钩子函数
     */
    handleRemove(file, fileList) {
      let params = new URLSearchParams();
      params.append("key", file.storePath + ":" + file.url);
      //调用接口删除轮播图
      deleteImage(params).then(
        (res) => {
          if (res.code === 200) {
            this.$message.info("删除成功");
          }
        },
        (err) => {
          this.confirm("删除失败：" + err, "消息提示");
        }
      );
    },
    /**
     * 上传失败的钩子函数
     */
    handFail(err, file, fileList) {
      this.confirm("图片上传失败:" + err, "错误提示");
    },
    /**
     * 图片上传之前的钩子函数
     */
    beforeUpload(file) {
      let fileName = file.name,
        regex = /(.jpg|.jpeg|.png|.bmp)$/; //图片格式
      let isImg = regex.test(fileName.toLowerCase());
      let isLt10M = file.size / 1024 / 1024 < 10; //上传大小2m
      if (!isImg) {
        this.$message.error("图片格式为：" + fileName + "，不符合规范");
      }
      if (!isLt10M) {
        this.$message.error("上传图片的大小不能超过10M!");
      }
      return isLt10M && isImg;
    },
    /**
     * 图片预览钩子
     */
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    /**
     * 从服务器后台得到图片列表
     */
    getswiperList() {
      let params = new URLSearchParams();
      params.append("storePath", this.getStorePath);
      getImageList(params).then(
        (res) => {
          //由于后端序列化问题，这里传过来的是字符串，需要转成对象
          let obj = JSON.parse(res.data);
          //将url从对象中取出来
          let arr = [];
          obj.swiperList.forEach((element) => {
            arr.unshift(element);
          });
          this.swiperList = arr;
        },
        (err) => {
          this.confirm("获取服务器图片失败" + err, "错误提示");
        }
      );
    },
    /**
     * 用户点击dialog里的确认按钮和取消按钮
     */
    confirmButton() {
      //先清除掉上一次的图片列表
      this.$refs.myupload.clearFiles();
      this.dialogFormVisible = false;
    },
    cancelButton() {
      //先清除掉上一次的图片列表
      this.$refs.myupload.clearFiles();
      this.dialogFormVisible = false;
    },
    //确认框，只有确认按钮
    confirm(content, title) {
      this.$alert(content, title, {
        confirmButtonText: "确定",
      });
    },
  },
  computed: {
    //将每一张轮播图的信息都封装起来
    getParams: {
      get: function () {
        let storePath = this.getStorePath;
        return {
          uid: "",
          title: "",
          summary: "",
          storePath: storePath, //图片存在oss中的相对路径，ex：qxImages/categoryImages0/")
        };
      },
      set: function () {},
    },
    getStorePath: {
      get() {
        return this.selectBoxValue === "关于青协界面轮播图"
          ? "qxImages/categoryImages1/"
          : "qxImages/categoryImages0/";
      },
      set() {},
    },
  },
};
</script>

<style>
/* 让整个盒子水平、垂直居中 */
.miniPrograms-swiper {
  position: absolute;
  top: 45%;
  left: 45%;
  transform: translate(-50%, -50%);
}
</style>
