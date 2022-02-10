<template>
  <div class="jointListWrap">
    <el-table
      :data="
        tableData.length == 0
          ? tableData
          : tableData.slice((currentPage - 1) * 5, currentPage * 5)
      "
      style="width: 100%"
      :header-cell-style="headerCellStyle"
      :cell-style="cellStyle"
    >
      <el-table-column prop="damageLocation" label="时间"> </el-table-column>
      <el-table-column prop="damageValue" label="接头区长度"> </el-table-column>
    </el-table>
    <el-pagination
      @current-change="getCurrentPageData"
      v-model:currentPage="currentPage"
      :page-size="5"
      layout="total, prev, pager, next"
      :pager-count="5"
      :total="tableData.length"
      small
      background
    >
    </el-pagination>
  </div>
</template>

<script>
import { getItem } from "../../../api/index";
import { eventBus } from "@ai-zen/event-bus";
export default {
  name: "JointList",
  data() {
    return {
      tableData: [],
      headerCellStyle: {
        background: "linear-gradient(0deg, #252838, #1E2234, #242839)",
        border: 0,
        textAlign: "center",
        color: "#fff",
        borderRight: "1px solid #292B3D",
      },
      // 所有单元格的样式
      cellStyle: {
        margin: 0,
        padding: 0,
        backgroundColor: "#1C1F30",
        boxSizing: "border-box",
        borderRight: "1px solid #292B3D",
        borderBottom: "1px solid #292B3D",
        textAlign: "center",
        color: "#fff",
      },
      currentEquipCode: "",
      // 当前选中的页码
      currentPage: 1,
    };
  },
  created() {
    // 从全局概览页面跳转而来，判断传递的参数是否为空对象，如果不为空，则初始化当前设备的损伤列表
    if (getItem("equipData")) {
      // 初始化损伤列表
      this.getTableData(getItem("equipData").equipmentCode);
    }
  },

  methods: {
    // 获取列表数据
    async getTableData(equipmentCode) {
      let cacheData = {};
      const res = await this.$http.post(this.$urlObj.queryEquipMonitorResult, {
        userCode: getItem("userData").userCode,
        equipmentCode: equipmentCode,
      });
      if (res.status === 200 && res.data.data.damageLocationArr) {
        this.tableData = [];
        let data = res.data.data;
        for (let i = 0; i < data.damageLocationArr.length; i++) {
          cacheData = {};
          cacheData.damageLocation =
            data.damageLocationArr[i].damageLocation * data.encodeWidth;
          cacheData.damageValue = data.damageLocationArr[i].damageValue / 10;
          this.tableData.push(cacheData);
        }
      }
    },
    // 选择当前页，更新表格数据
    getCurrentPageData(page) {
      this.currentPage = page;
    },
    // 提供给父组件调用，重新渲染
    handleAgainRender(data) {
      // 更新损伤列表
      this.getTableData(data.currentEquipCode);
      // 保存当前设备的设备编码
      this.currentEquipCode = data.currentEquipCode;
    },
  },
};
</script>

<style lang="scss" scoped>
.jointListWrap {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding-top: 10px;
  box-sizing: border-box;
  position: relative;
  .el-table {
    width: 76.22222% !important;
  }
  .el-pagination {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  :deep(.btn-prev),
  :deep(.more),
  :deep(.el-pager .number) {
    background-color: #1c1f30 !important;
  }
}
:deep(.el-table th.is-leaf) {
  padding: 6px 0;
  text-align: center;
  background: linear-gradient(0deg, #252838, #1e2234, #242839);
  color: #fff;
  border-bottom: 0;
}

:deep(.el-table__body td .cell) {
  height: 29px;
  display: flex;
  align-items: center;
  justify-content: center;
}
:deep(.el-table tbody) {
  border-left: 1px solid #292b3d;
  //  width: 288px;
  width: 100%;
}
:deep(.el-table .hidden-columns) {
  width: 0 !important;
}
:deep(.el-table__fixed::before) {
  height: 0;
}
</style>
