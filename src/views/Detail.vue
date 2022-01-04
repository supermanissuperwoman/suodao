<template>
  <!-- 详情上-开始 -->
  <el-row class="searchRow">
    <el-col :xs="24" :lg="24">
      <search @showComponent="showComponent"></search>
    </el-col>
  </el-row>

  <!-- 详情上-结束 -->

  <!-- 详情主内容-开始 -->
  <!-- 非索道项目 开始 -->
  <el-row class="mainRow" v-if="componentFlag == 'nosuodao'">
    <el-col
      class="overviewCol"
      :xs="24"
      :sm="24"
      :md="24"
      :lg="12"
      :xl="9"
      :span="9"
    >
      <overview ref="overViewRef"></overview>
    </el-col>
    <el-col
      class="monitorCol"
      :xs="24"
      :sm="24"
      :md="24"
      :lg="12"
      :xl="15"
      :span="15"
    >
      <monitor-result ref="monitorRef"></monitor-result>
    </el-col>
    <el-col
      class="damageValueCol"
      :xs="24"
      :sm="24"
      :md="24"
      :lg="8"
      :xl="9"
      :span="9"
    >
      <damage-value ref="damageValueRef"></damage-value>
    </el-col>
    <el-col
      class="goDistanceCol"
      :xs="24"
      :sm="24"
      :md="24"
      :lg="9"
      :xl="11"
      :span="11"
    >
      <go-distance ref="goDistanceRef"></go-distance>
    </el-col>
    <el-col
      class="damageListCol"
      :xs="24"
      :sm="24"
      :md="24"
      :lg="7"
      :xl="4"
      :span="4"
      style="padding-right:0;"
    >
      <damage-list ref="damageListRef"></damage-list>
    </el-col>
  </el-row>
  <!-- 非索道项目 结束 -->

  <!-- 索道项目 开始 -->
  <el-row class="mainRow" v-if="componentFlag == 'suodao'">
    <cableway ref="cablewayRef"></cableway>
  </el-row>
  <!-- 索道项目 结束 -->

  <!-- 详情主内容-结束 -->
</template>

<script>
import Search from "../components/detail/Search.vue";
import Overview from "../components/detail/Overview.vue";
import MonitorResult from "../components/detail/MonitorResult.vue";
import DamageValue from "../components/detail/DamageValue.vue";
import DamageList from "../components/detail/DamageList.vue";
import GoDistance from "../components/detail/GoDistance.vue";
import Cableway from "../components/detail/Cableway.vue";
import { getItem, removeItem } from "../api";
import { eventBus } from "@ai-zen/event-bus";
export default {
  data() {
    return {
      isClickSearch: "",
      componentFlag: "nosuodao",
    };
  },
  created() {
    eventBus.on("clickSearch", (data) => {
      this.isClickSearch = data.isClickSearch;
    });
  },
  mounted() {
    window.addEventListener("resize", () => {
      if (this.isClickSearch || getItem("equipData")) {
        if (this.$refs.overViewRef) {
          this.$refs.overViewRef.myResize();
        }
        if (this.$refs.monitorRef) {
          this.$refs.monitorRef.myResize();
        }
        if (this.$refs.damageValueRef) {
          this.$refs.damageValueRef.myResize();
        }
        if (this.$refs.goDistanceRef) {
          this.$refs.goDistanceRef.myResize();
        }
      }
    });
  },
  // 由其他页面跳转过来，重载当前页面
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (to.path == "/index/detail" && from.path !== "/") {
        window.location.reload();
      }
    });
  },
  // 当该路由离开前，清除equipData缓存
  beforeRouteLeave(to, from, next) {
    if (getItem("equipData")) {
      removeItem("equipData");
    }
    next();
  },
  components: {
    Search,
    Overview,
    MonitorResult,
    DamageValue,
    DamageList,
    GoDistance,
    Cableway,
  },
  methods: {
    // 监听search组件设备变化时选择的设备类型，展示不同的组件
    showComponent(data) {
      console.log(data);
      this.componentFlag = data.flag;
      this.$nextTick(() => {
        if (data.flag == "suodao") {
          this.$refs.cablewayRef.$refs.damageListRef.titleFlag = data.flag;
          this.$refs.cablewayRef.$refs.damageListRef.headerCellStyle.background =
            "linear-gradient(0deg, #252838, #1E2234, #242839)";
          this.$refs.cablewayRef.$refs.damageListRef.pageCount = 5;
        } else {
          this.$refs.damageListRef.titleFlag = data.flag;
          this.$refs.damageListRef.headerCellStyle.background = "#33394E";
          this.$refs.damageListRef.pageCount = 10;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.searchRow {
  width: 100%;
  // height: 7.40%;
  margin-top: 20px;
}
.mainRow {
  width: 100%;
  // height: 37.04%;
  margin-top: 20px;
  // min-width: 1000px;
  min-height: 275px;
  .overviewCol {
    width: 100%;
    height: 640px;
  }
  @media screen and (min-width: 1200px) {
    .overviewCol {
      height: 400px;
      padding-right: 10px;
    }
  }
  .monitorCol {
    width: 100%;
    height: 390px;
    margin-top: 20px;
  }
  @media screen and (min-width: 1200px) {
    .monitorCol {
      height: 400px;
      margin-top: 0;
      padding-left: 10px;
    }
  }
  .damageValueCol {
    width: 100%;
    height: 420px;
    margin-top: 20px;
  }
  @media screen and (min-width: 1200px) {
    .damageValueCol {
      height: 450px;
      padding-right: 5px;
    }
  }
  @media screen and (min-width: 1500px) {
    .damageValueCol {
      padding-right: 10px;
    }
  }
  .goDistanceCol {
    width: 100%;
    height: 490px;
    margin-top: 20px;
  }
  @media screen and (min-width: 1200px) {
    .goDistanceCol {
      height: 450px;
      padding-left: 5px;
      padding-right: 5px;
    }
  }
  @media screen and (min-width: 1500px) {
    .goDistanceCol {
      padding-left: 10px;
      padding-right: 10px;
    }
  }
  .damageListCol {
    width: 100%;
    height: 592px;
    margin-top: 20px;
  }
  @media screen and (min-width: 1200px) {
    .damageListCol {
      height: 450px;
      padding-left: 5px;
    }
  }
  @media screen and (min-width: 1500px) {
    .damageListCol {
      padding-left: 10px;
    }
  }
  .rightCol {
    width: 100%;
    height: 100%;
    padding-left: 1.074%;
  }
}
.downRow {
  width: 100%;
  height: 41.66%;
  margin-top: 1.04%;
  min-height: 317px;
  .el-col:nth-child(2) {
    padding-left: 1.074%;
  }
  .el-col:nth-child(3) {
    padding-left: 1.074%;
  }
}

/* 搜索的输入框颜色 */
:deep(.el-input__inner) {
  background: #33394e !important;
  border: 0px !important;
}
/* 总条目字体颜色 */
:deep(.el-pagination__total) {
  color: #fff !important;
  margin-right: 0;
}
:deep(.btn-prev) {
  margin: 0 !important;
}
:deep(.btn-next) {
  margin: 0 !important;
}
:deep(.el-pager .number) {
  margin: 0 !important;
}
/* 当前按钮的背景色和字体颜色 */
:deep(.el-pagination.is-background .el-pager li:not(.disabled).active) {
  background-color: #1c1f30;
  color: #0099ff;
}
/* 没有选中的按钮的背景色和字体颜色 */
:deep(.el-pagination.is-background .btn-next, .el-pagination.is-background
    .btn-prev, .el-pagination.is-background .el-pager li) {
  background-color: #1c1f30;
  color: #fff;
}
:deep(.el-table__body) {
  border-left: 1px solid #292b3d;
  border-right: 1px solid #292b3d;
  box-sizing: border-box;
}
/* 去除表格底部的白线 */
:deep(.el-table::before) {
  height: 0px;
}
:deep(.el-table, .el-table__expanded-cell) {
  background-color: #1c1f30;
}

/*
  .detailRootWrap {
    position: relative;
    .detaiTop {
      position: absolute;
      left: 20px;
      top: 20px;
    }
    .detailMiddle {
      position: absolute;
      left: 20px;
      top: 120px;
      .overview {
        float: left;
      }
      .monitorResult {
        float: left;
        margin-left: 20px;
      }
    }
    .detailDown {
      position: absolute;
      left: 20px;
      top: 540px;
      .damageValue {
        float: left;
      }
      .goDistance {
        float: left;
        margin-left: 20px;
      }
      .damageList {
        float: left;
        margin-left: 20px;
      }
    }
  }
*/
</style>
