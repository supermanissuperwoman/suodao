<template>
  <el-row>
    <el-col style="height:100%;" :span="24">
      <div
        :class="{ damageRoot: true, removePaddingTop: titleFlag == 'suodao' }"
      >
        <div class="title" v-if="titleFlag != 'suodao'">
          <h4>损伤列表</h4>
        </div>
        <el-table
          :data="
            tableData.length == 0
              ? tableData
              : tableData.slice(
                  (currentPage - 1) * pageCount,
                  currentPage * pageCount
                )
          "
          :cell-style="cellStyle"
          :header-cell-style="headerCellStyle"
          @sort-change="sortChange"
        >
          <el-table-column prop="damageValue" label="损伤值" sortable="custom">
            <template v-slot="scope"> {{ scope.row.damageValue }}% </template>
          </el-table-column>
          <el-table-column
            prop="damageLocation"
            label="损伤位置"
            sortable="custom"
          >
            <template v-slot="scope">
              {{ scope.row.damageLocation }}cm
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="getCurrentPageData"
          v-model:currentPage="currentPage"
          :page-size="pageCount"
          layout="total, prev, pager, next"
          :pager-count="5"
          :total="tableData.length"
          small
          background
        >
        </el-pagination>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { getItem } from "../../api/index";
import { eventBus } from "@ai-zen/event-bus";

export default {
  name: "DamageList",
  data() {
    return {
      // 损伤列表数据
      tableData: [],
      // 当前选中的页码
      currentPage: 1,
      // 当前设备的设备编码
      currentEquipCode: "",
      // 表格头部样式
      headerCellStyle: {
        background: "#33394E",
        border: 0,
        textAlign: "center",
        color: "#fff",
      },
      // 所有单元格的样式
      cellStyle: {
        // height: "30px",
        margin: 0,
        padding: 0,
        backgroundColor: "#1C1F30",
        boxSizing: "border-box",
        borderRight: "1px solid #292B3D",
        borderBottom: "1px solid #292B3D",
        textAlign: "center",
        color: "#fff",
      },
      titleFlag: "nosuodao",
      // 每页显示多少条
      pageCount: 10,
    };
  },

  created() {
    // 从全局概览页面跳转而来，判断传递的参数是否为空对象，如果不为空，则初始化当前设备的损伤列表
    if (getItem("equipData")) {
      // 初始化损伤列表
      this.getTableData(getItem("equipData").equipmentCode);
    }
  },
  mounted() {
    // 监听search组件事件，获取设备编码
    eventBus.on("queryEquipInfo", (data) => {
      // 更新损伤列表
      this.getTableData(data.currentEquipCode);
      // 保存当前设备的设备编码
      this.currentEquipCode = data.currentEquipCode;
    });
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

    // 给列表整个数据排序
    sortChange(column) {
      this.currentPage = 1;
      if (column.order != null) {
        this.tableData = this.tableData.sort(
          this.sortFun(column.prop, column.order === "ascending")
        );
      } else {
        // 如果用户没有选中升序或降序，恢复表格未排序的状态
        this.getTableData(this.currentEquipCode);
      }
    },

    // 排序算法
    sortFun(attr, rev) {
      //第一个参数传入info里的prop表示排的是哪一列，第二个参数是升还是降排序
      if (rev == undefined) {
        rev = 1;
      } else {
        rev = rev ? 1 : -1;
      }
      return function(a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
          return rev * -1;
        }
        if (a > b) {
          return rev * 1;
        }
        return 0;
      };
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../assets/css/detail.css";
.el-row {
  width: 100%;
  height: 100%;
  background-color: #1c1f30;
  .damageRoot {
    width: 100%;
    // height: 538px;
    height: 90.878375%;
    padding-top: 20px;
    box-sizing: border-box;
    position: relative;
  }
  .removePaddingTop {
    padding-top: 0 !important;
  }
  .el-table {
    width: 80%;
    // height: 456px;
    height: 87.75836%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 10px;
  }
  @media screen and (min-width: 1200px) {
    .el-table {
      width: 76.22222%;
    }
  }
  .el-pagination {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  @media screen and (min-width: 768px) {
    .el-pagination {
      bottom: -14px;
    }
  }
  .title {
    margin-left: 4.94%;
    color: #ffffff;
    h4 {
      font-size: 18px;
    }
  }
}
.el-table-column {
  width: 20%;
}
:deep(.btn-prev),
:deep(.more),
:deep(.el-pager .number) {
  background-color: #1c1f30 !important;
}
:deep(.el-table__header) {
  height: 35px !important;
  width: 100% !important;
}
:deep .el-table tbody tr:hover > td {
  background-color: transparent;
}
:deep .el-table tbody {
  border-left: 1px solid #292b3d;
  //  width: 288px;
  width: 100%;
}
:deep(.el-table .cell) {
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}
@media screen and (min-width: 1200px) {
  :deep(.el-table .cell) {
    height: 29px;
  }
}
:deep(.el-table th.is-sortable) {
  padding: 0px !important;
}

:deep(.el-table .hidden-columns) {
  width: 0 !important;
}
:deep(.el-table__body) {
  // 使表格兼容safari，不错位
  width: 100% !important;
  table-layout: fixed !important;
}
</style>
