<template>
  <el-row>
    <el-col :xs="24">
      <select-report
        ref="selectRef"
        @equipChange="equipChange"
        @changeComponent="changeComponent"
        @getCode="handleSelectClickSearch"
      ></select-report>
    </el-col>
  </el-row>
  <el-row class="dailyAndListRow" v-if="isShowTopDaily">
    <el-col class="dailyCol" :xs="24" :sm="24" :md="24" :lg="10">
      <div class="dailyDiv">
        <daily-survey ref="dailyRef"></daily-survey>
      </div>
    </el-col>
    <el-col class="listCol" :xs="24" :sm="24" :md="24" :lg="14">
      <div class="listDiv">
        <list ref="listRef"></list>
      </div>
    </el-col>
    <el-col class="distanceCol" :xs="24" :lg="10">
      <go-distance ref="distanceRef"></go-distance>
    </el-col>
    <el-col class="valueCol" :xs="24" :lg="valueColLg">
      <value ref="valueRef"></value>
    </el-col>
    <el-col class="jointCol" :xs="24" :lg="7" v-if="isShowJoint">
      <joint ref="jointRef"></joint>
    </el-col>
  </el-row>
  <!-- <el-row class="valueRow" v-if="false">
        
      </el-row> -->

  <el-row class="overAndValue" v-if="isShowTopWeek && !isShowWeekJoint">
    <el-col class="stateCol" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
      <state ref="refState"></state>
    </el-col>
    <el-col
      class="averageValueCol"
      :xs="24"
      :sm="24"
      :md="24"
      :lg="12"
      :xl="12"
    >
      <average-value ref="refAverageValue"></average-value>
    </el-col>
    <el-col class="mileageTimeCol" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
      <mileage-time ref="refMileageTime"></mileage-time>
    </el-col>
    <el-col class="stateListCol" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
      <state-list ref="stateListRef"></state-list>
    </el-col>
  </el-row>
  <el-row class="jointRow" v-if="isShowTopWeek && isShowWeekJoint">
    <el-col class="jointLeftCol" :lg="10">
      <el-row>
        <el-col><state ref="refState"></state></el-col>
        <el-col>
          <average-value ref="refAverageValue"></average-value>
        </el-col>
        <el-col>
          <state-list></state-list>
        </el-col>
      </el-row>
    </el-col>
    <el-col class="jointRightCol" :lg="14">
      <el-row>
        <el-col><mileage-time ref="refMileageTime"></mileage-time></el-col>
        <el-col class="jointPercentCol"
          ><joint-percent ref="jointPercentRef"></joint-percent
        ></el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { eventBus } from "@ai-zen/event-bus";
import SelectReport from "../components/report/Select.vue";
import DailySurvey from "../components/report/DailySurvey.vue";
import List from "../components/report/List.vue";
import Value from "../components/report/Value.vue";
import State from "../components/report/State.vue";
import AverageValue from "../components/report/AverageValue.vue";
import MileageTime from "../components/report/MileageTime.vue";
import StateList from "../components/report/StateList.vue";
import GoDistance from "../components/report/DailyGodistance.vue";
import Joint from "../components/common/Joint.vue";
import JointPercent from "../components/report/cableway/JointPercent.vue";
export default {
  data() {
    return {
      // 隐藏日报界面上方组件
      isShowTopDaily: false,
      // 隐藏日报界面下方组件
      isShowDownDaily: false,
      // 隐藏周报界面上方组件
      isShowTopWeek: true,
      // 隐藏周报界面下方组件
      isShowDownWeek: true,
      // 索道日报组件是否展示
      isShowJoint: false,
      // 索道周报组件是否展示
      isShowWeekJoint: false,
      valueColLg: 14,
    };
  },
  created() {
    // 监听点击周报按钮，隐藏日报界面，显示周报界面
    eventBus.on("closeDaily", (data) => {
      // 如果只选择了周报，则显示周报界面，关闭日报界面
      if (!data.isDailyDisable && data.isWeekDisable) {
        this.isShowTopWeek = true;
        this.isShowDownWeek = true;
        this.isShowTopDaily = false;
        this.isShowDownDaily = false;
      }
      // 如果只选择了日报，则显示日报界面，关闭周报界面
      if (data.isDailyDisable && !data.isWeekDisable) {
        this.isShowTopWeek = false;
        this.isShowDownWeek = false;
        this.isShowTopDaily = true;
        this.isShowDownDaily = true;
      }
    });
    // 监听点击日报按钮，隐藏周报界面，显示日报界面
    eventBus.on("closeWeek", (data) => {
      if (!data.isWeekDisable) {
        this.isShowTopWeek = false;
        this.isShowDownWeek = false;
        this.isShowTopDaily = true;
        this.isShowDownDaily = true;
      } else {
        this.isShowTopWeek = true;
        this.isShowDownWeek = true;
        this.isShowTopDaily = false;
        this.isShowDownDaily = false;
      }
    });
  },
  mounted() {
    window.addEventListener("resize", () => {
      if (this.isShowTopDaily && this.isShowDownDaily) {
        if (this.$refs.valueRef) {
          this.$refs.valueRef.myResize();
        }
        if (this.$refs.distanceRef) {
          this.$refs.distanceRef.myResize();
        }
        if (this.$refs.jointRef) {
          this.$refs.jointRef.myResize();
        }
      }
      if (this.isShowTopWeek && this.isShowDownWeek) {
        if (this.$refs.refState) {
          this.$refs.refState.myResize();
        }
        if (this.$refs.refAverageValue) {
          this.$refs.refAverageValue.myResize();
        }
        if (this.$refs.refMileageTime) {
          this.$refs.refMileageTime.myResize();
        }
        if (this.$refs.jointPercentRef) {
          this.$refs.jointPercentRef.myResize();
        }
        // this.$refs.refAverageValue.myResize();
        // this.$refs.refMileageTime.myResize();
      }
    });
  },
  // 由其他页面跳转过来，重载当前页面
  // beforeRouteEnter(to,from,next) {
  //   next(vm => {
  //     if(to.path == '/index/report' && from.path !== '/') {
  //       window.location.reload();
  //     }
  //   })
  // },
  components: {
    SelectReport,
    DailySurvey,
    List,
    Value,
    State,
    AverageValue,
    MileageTime,
    StateList,
    GoDistance,
    Joint,
    JointPercent,
  },
  methods: {
    // 监测日报界面设备类型变化 展示索道相关组件
    equipChange(data) {
      if (data.data.equipmentModel != "IOT01B") {
        this.isShowJoint = true;
        this.valueColLg = 7;
      } else {
        this.isShowJoint = false;
        this.valueColLg = 14;
      }
      if (data.date) {
        this.$refs.valueRef.getDamageOptions(data.data.value, data.date);
        this.$refs.dailyRef.getEquipInfo(data.data.value, data.date);
        this.$refs.listRef.getTopTenDamageValue(data.data.value, data.date);
        this.$refs.distanceRef.getDistanceOptions(data.data.value, data.date);
        this.$nextTick(() => {
          if (this.$refs.jointRef) {
            this.$refs.jointRef.currentEquipDamageOptions(data.data.value);
          }
        });
      }
    },
    // 监测周报界面设备类型变化 展示索道相关组件
    changeComponent(data) {
      if (data == "suodao") {
        this.isShowWeekJoint = true;
      } else {
        this.isShowWeekJoint = false;
      }
    },
    // 监听select子组件点击查询按钮发出的自定义事件
    handleSelectClickSearch(data) {
      // 发出自定义
      if (this.$refs.refAverageValue) {
        this.$refs.refAverageValue.getImageData(
          data.currentProjectCode,
          data.reportDate
        );
      }
      if (this.$refs.refState) {
        this.$refs.refState.healthContainer.dispose();
        this.$refs.refState.lightContainer.dispose();
        this.$refs.refState.middleContainer.dispose();
        this.$refs.refState.heavyContainer.dispose();
        this.$refs.refState.outContainer.dispose();
        this.$refs.refState.getImageData(
          data.currentProjectCode,
          data.reportDate
        );
      }
      if (this.$refs.refMileageTime) {
        this.$refs.refMileageTime.getImageData(
          data.currentProjectCode,
          data.reportDate
        );
      }
      if (this.$refs.stateListRef) {
        this.$refs.stateListRef.getImageData(
          data.currentProjectCode,
          data.reportDate
        );
      }
      if (this.$refs.jointRef) {
        this.$refs.jointRef.getDamageValue(data.currentEquipCode);
      }
      if (this.$refs.jointPercentRef) {
        this.$refs.jointPercentRef.getImageData(
          data.currentProjectCode,
          data.reportDate
        );
      }
      if (this.$refs.dailyRef) {
        this.$refs.dailyRef.getEquipInfo(
          data.currentEquipCode,
          data.reportDate
        );
      }
      if (this.$refs.listRef) {
        this.$refs.listRef.getTopTenDamageValue(
          data.currentEquipCode,
          data.reportDate
        );
      }
      if (this.$refs.distanceRef) {
        this.$refs.distanceRef.getDistanceOptions(
          data.currentEquipCode,
          data.reportDate
        );
      }
      if (this.$refs.valueRef) {
        this.$refs.valueRef.getDamageOptions(
          data.currentEquipCode,
          data.reportDate
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dailyAndListRow {
  margin-top: 20px;
  // min-width: 920px !important;
}
.dailyDiv {
  height: 400px;
  width: 100%;
  background-color: #1c1f30;
  margin-bottom: 20px;
}
@media screen and (min-width: 1200px) {
  .dailyCol {
    padding-right: 10px;
  }
  .dailyDiv {
    margin-bottom: 0;
  }
}

@media screen and (min-width: 1200px) {
  .listCol {
    padding-left: 10px;
  }
}
.listDiv {
  height: 400px;
}
.valueCol {
  height: 320px;
  width: 100%;
  margin-top: 20px;
}
.jointCol {
  height: 320px;
  width: 100%;
  margin-top: 20px;
}
@media screen and (min-width: 1200px) {
  .jointCol {
    padding-left: 20px;
  }
}
@media screen and (min-width: 1200px) {
  .valueCol {
    //  统计报表 日报 新增加的组件，待后端接口完成后，放开
    padding-left: 10px;
    box-sizing: border-box;
  }
}
.distanceCol {
  height: 320px;
  width: 100%;
  margin-top: 20px;
  // background-color: #1c1f30;
}
@media screen and (min-width: 1200px) {
  .distanceCol {
    padding-right: 10px;
  }
}
.overAndValue {
  width: 100%;
  height: 88%;
  .stateCol {
    width: 100%;
    height: 230px;
    margin-top: 20px;
    box-sizing: border-box;
  }
  @media screen and (min-width: 768px) {
    .stateCol {
      height: 260px;
    }
  }
  @media screen and (min-width: 1200px) {
    .stateCol {
      height: 48%;
      padding-right: 10px;
    }
  }

  .averageValueCol {
    width: 100%;
    height: 300px;
    margin-top: 20px;
    box-sizing: border-box;
  }
  @media screen and (min-width: 768px) {
    .averageValueCol {
      height: 300px;
    }
  }
  @media screen and (min-width: 1200px) {
    .averageValueCol {
      padding-left: 10px;
      height: 48%;
    }
  }

  .mileageTimeCol {
    width: 100%;
    height: 310px;
    margin-top: 20px;
    box-sizing: border-box;
  }
  @media screen and (min-width: 768px) {
    .mileageTimeCol {
      height: 300px;
    }
  }
  @media screen and (min-width: 1200px) {
    .mileageTimeCol {
      height: 400px;
      padding-right: 10px;
    }
  }
  .stateListCol {
    width: 100%;
    height: 250px;
    margin-top: 20px;
  }
  @media screen and (min-width: 1200px) {
    .stateListCol {
      height: 400px;
      padding-left: 10px;
    }
  }
}
.jointRow {
  padding-top: 20px;
  box-sizing: border-box;
  .jointLeftCol {
    height: 100%;
    .el-col:nth-child(1) {
      height: 270px;
      background-color: #1c1f30;
      margin-bottom: 20px;
    }
    @media screen and (min-width: 1200px) {
      .el-col:nth-child(1) {
        margin-bottom: 10px;
        height: 240px;
      }
    }
    .el-col:nth-child(2),
    .el-col:nth-child(3) {
      height: 300px;
      margin-bottom: 20px;
    }
    @media screen and (min-width: 1200px) {
      .el-col:nth-child(2) {
        margin-bottom: 10px;
        height: 240px;
      }
      .el-col:nth-child(3) {
        margin-bottom: 10px;
        height: 240px;
      }
    }
  }
  @media screen and (min-width: 1200px) {
    .jointLeftCol {
      padding-right: 10px;
    }
  }
  .jointRightCol {
    .el-col:nth-child(1) {
      height: 440px;
    }
    @media screen and (min-width: 1200px) {
      .el-col:nth-child(1) {
        height: 365px;
      }
    }
    .el-col:nth-child(2) {
      height: 440px;
      margin-bottom: 20px;
    }
    @media screen and (min-width: 1200px) {
      .el-col:nth-child(2) {
        height: 365px;
        margin-bottom: 0;
      }
    }
  }
}
</style>
