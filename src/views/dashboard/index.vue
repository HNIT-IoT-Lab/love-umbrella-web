<template>
  <div class="dashboard-container">
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="date" label="作者" width="180"> </el-table-column>
      <el-table-column prop="name" label="简介" width="180"> </el-table-column>
      <el-table-column prop="address" label="联系方式"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Dashboard",
  data() {
    return {
      tableData: [
        {
          date: "VernHe、梁峰源",
          name: "每天都要加油鸭！",
          address: "fengyuan-liang@foxmail.com",
        },
      ],
    };
  },
  computed: {
    // ...mapGetters([
    //   'name'
    // ])
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
