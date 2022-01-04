<template>
  <div id="rootStateListContainer">
    <div class="titleTextList">设备运行概况</div>
    <div class="chartListContainer">
      <el-table
        :data="tableData"
        :row-class-name="tableRowClassName"
        :header-cell-style="headerCellStyle"
        height="90%"
      >
        <el-table-column
          prop="equipmentName"
          label="设备名称"
          :show-overflow-tooltip="true"
        >
        </el-table-column>
        <el-table-column prop="riskLevel" label="风险等级"> </el-table-column>
        <el-table-column prop="isAlarm" label="是否报警"> </el-table-column>
        <el-table-column prop="ropeStatus" label="钢丝绳状态">
        </el-table-column>
        <el-table-column
          prop="avgDamage"
          sortable
          label="平均损伤值"
          min-width="100"
        >
          <template v-slot="scope"> {{ scope.row.avgDamage }}% </template>
        </el-table-column>
        <el-table-column prop="avgDamageCount" sortable label="损伤个数">
          <template v-slot="scope"> {{ scope.row.avgDamageCount }}个 </template>
        </el-table-column>
        <el-table-column
          prop="runningTime"
          sortable
          label="运行总时长"
          min-width="100"
        >
          <template v-slot="scope"> {{ scope.row.runningTime }}h </template>
        </el-table-column>
        <el-table-column
          prop="runningDistance"
          sortable
          label="运行总里程"
          min-width="100"
        >
          <template v-slot="scope">
            {{ scope.row.runningDistance }}km
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { eventBus } from "@ai-zen/event-bus";
export default {
  name: "StateList",
  data() {
    return {
      // 表格数据
      tableData: [],
      headerCellStyle: {
        background: "#2F3349",
        color: "#D8D8D8",
        textAlign: "center",
        border: 0,
        fontSize: "12px",
        padding: 0,
        height: "40px",
      },
      // 项目编号
      projectCode: "",
      // 选择日期
      reportDate: "",
    };
  },
  created() {
    eventBus.on("getCode", (data) => {
      this.projectCode = data.currentProjectCode;
      this.reportDate = data.reportDate;
      this.getImageData();
    });
  },
  methods: {
    // 控制表格单双行背景色
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return "even";
      }
      return "odd";
    },
    // 请求数据
    async getImageData() {
      const res = await this.$http.post(this.$urlObj.queryImageContent, {
        projectCode: this.projectCode,
        reportDate: this.reportDate,
      });
      if (
        res.status === 200 &&
        res.data.resultCode == "0000" &&
        res.data.data
      ) {
        let cache = {};
        this.tableData = [];
        for (let i = 0; i < res.data.data.runningDataList.length; i++) {
          cache = {};
          cache.avgDamage = parseFloat(
            res.data.data.runningDataList[i].avgDamage.slice(0, -1)
          );
          cache.avgDamageCount = parseInt(
            res.data.data.runningDataList[i].avgDamageCount.slice(0, -1)
          );
          cache.equipmentName = res.data.data.runningDataList[i].equipmentName;
          cache.projectName = res.data.data.runningDataList[i].projectName;
          cache.riskLevel = res.data.data.runningDataList[i].riskLevel;
          cache.ropeStatus = res.data.data.runningDataList[i].ropeStatus;
          cache.runningDistance = parseFloat(
            res.data.data.runningDataList[i].runningDistance.slice(0, -2)
          );
          cache.runningTime = parseFloat(
            res.data.data.runningDataList[i].runningTime.slice(0, -1)
          );
          cache.isAlarm = "否";
          this.tableData.push(cache);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/index.css";
#rootStateListContainer {
  width: 100%;
  height: 100%;
  background-color: #1c1f30;
  padding-top: 10px;
  box-sizing: border-box;
  .titleTextList {
    margin-left: 1.5%;
    color: #fff;
    font-size: 18px;
    font-weight: bold;
  }
  .chartListContainer {
    width: 100%;
    height: 88%;
    .el-table {
      background-color: #1c1f30;
      margin-top: 20px;
      // hseight: 91%;
    }
  }
}
// 曲线鼠标滑过样式
:deep(.el-table tbody tr:hover > td) {
  background-color: transparent;
}
.el-table::before {
  height: 0px;
}
:deep(.el-table--scrollable-x .el-table__body-wrapper) {
  overflow-x: scroll;
}
:deep(.el-table th > .cell) {
  padding: 0 !important;
}
:deep(.el-table__header-wrapper) {
  background-color: #2f3349;
}
:deep(.el-table__row) {
  width: 100%;
  height: 40px;
}
:deep(.el-table__row td) {
  padding: 0 !important;
  border: 0;
  color: #ffffff;
  text-align: center;
  font-size: 14px;
}
.el-table__body-wrapper {
  //  height: 86% !important;
}
:deep(.el-table__body-wrapper::-webkit-scrollbar) {
  height: 3px !important;
}
</style>
