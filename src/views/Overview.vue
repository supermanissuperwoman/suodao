<template>
  <!-- 状态概览开始 -->
  <!-- <div class="showStateWrap"> -->
  <el-row class="showStateWrap isDisplayMd" v-show="false">
    <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
      <div class="projectAmount stateCommon">
        <div
          @mouseover.stop="showBig = true"
          @mouseleave.stop="showBig = false"
          class="icon"
        >
          <img src="../assets/image/xiangmu.svg" alt="" />
          <div @mouseleave.stop="showBig = false" class="projectDropDownBox">
            <el-collapse-transition>
              <div v-show="showBig">
                <div class="transitionBox">
                  <div class="buttonWrap">
                    <el-button
                      @click="selectALLClick(projectGroup)"
                      type="primary"
                      >全部项目</el-button
                    >
                  </div>
                  <ul>
                    <li
                      @click="selectOneClick(item)"
                      v-for="item in projectGroup"
                      :key="item"
                    >
                      {{ item.projectName }}
                    </li>
                  </ul>
                </div>
              </div>
            </el-collapse-transition>
          </div>
        </div>
        <span
          v-show="isProjectShow"
          class="number"
          style="width:70px;overflow:hidden;textOverflow:ellipsis;whiteSpace: nowrap;"
          >{{ projectGroup.length }}</span
        >
        <span
          :title="currentProjectInfo.projectName"
          v-show="!isProjectShow"
          class="number"
          style="width:70px;overflow:hidden;textOverflow:ellipsis;whiteSpace: nowrap;"
          >{{ currentProjectInfo.projectName }}</span
        >
        <span v-show="isProjectShow" class="text">全部项目</span>
        <span v-show="!isProjectShow" class="text">当前项目</span>
      </div>
    </el-col>
    <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3">
      <div class="equipementAmount stateCommon">
        <div class="icon" @click="updataList('all')">
          <img src="../assets/image/shebei.svg" alt="" />
        </div>
        <span :class="{ number: true, allActive: lightObj.all }">{{
          equipStateGroup.equipmentCount
        }}</span>
        <span :class="{ text: true, allActive: lightObj.all }">全部设备</span>
      </div></el-col
    >
    <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3"
      ><div class="workingAmount stateCommon">
        <div class="icon" @click="updataList('working')">
          <img src="../assets/image/yunxing.svg" alt="" />
        </div>
        <span :class="{ number: true, workActive: lightObj.working }">{{
          equipStateGroup.runningCount
        }}</span>
        <span :class="{ text: true, workActive: lightObj.working }"
          >运行设备</span
        >
      </div></el-col
    >
    <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3"
      ><div class="offlineAmount stateCommon">
        <div class="icon" @click="updataList('offline')">
          <img src="../assets/image/lixian.svg" alt="" />
        </div>
        <span :class="{ number: true, offlineActive: lightObj.offline }">{{
          equipStateGroup.offlineCount
        }}</span>
        <span :class="{ text: true, offlineActive: lightObj.offline }"
          >离线设备</span
        >
      </div></el-col
    >
    <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3"
      ><div class="alarmAmount stateCommon">
        <div class="icon" @click="updataList('alarm')">
          <img src="../assets/image/baojing.svg" alt="" />
        </div>
        <span :class="{ number: true, alarmActive: lightObj.alarm }">{{
          equipStateGroup.alarmCount
        }}</span>
        <span :class="{ text: true, alarmActive: lightObj.alarm }"
          >报警设备</span
        >
      </div></el-col
    >
    <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3"
      ><div class="freeAmount stateCommon">
        <div class="icon" @click="updataList('standby')">
          <img src="../assets/image/daiji.svg" alt="" />
        </div>
        <span :class="{ number: true, standbyActive: lightObj.standby }">{{
          equipStateGroup.standbyCount
        }}</span>
        <span :class="{ text: true, standbyActive: lightObj.standby }"
          >待机设备</span
        >
      </div></el-col
    >
    <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3"
      ><div class="faultAmount stateCommon">
        <div class="icon" @click="updataList('fault')">
          <img src="../assets/image/guzhang.svg" alt="" />
        </div>
        <span :class="{ number: true, falutActive: lightObj.fault }">{{
          equipStateGroup.faultCount
        }}</span>
        <span :class="{ text: true, falutActive: lightObj.fault }"
          >故障设备</span
        >
      </div></el-col
    >
    <el-col :xs="3" :sm="3" :md="3" :lg="3" :xl="3"
      ><div class="disableAmount stateCommon">
        <div class="icon" @click="updataList('disabled')">
          <img src="../assets/image/tingyong.svg" alt="" />
        </div>
        <span :class="{ number: true, disabledActive: lightObj.disabled }">{{
          equipStateGroup.disableCount
        }}</span>
        <span :class="{ text: true, disabledActive: lightObj.disabled }"
          >停用设备</span
        >
      </div></el-col
    >
  </el-row>
  <!-- </div> -->
  <!-- 状态概览结束 -->
  <!-- 状态概览开始xs sm -->
  <el-row class="xsRow isDisplayState">
    <el-col style="width:100%;height:100%;">
      <swiper :pagination="{ clickable: true }">
        <swiper-slide>
          <el-col
            style="width:100%;height:100%;"
            :xs="6"
            :sm="6"
            :md="3"
            :lg="3"
            :xl="3"
          >
            <div class="itemWrap" @click.stop="show = !show">
              <div class="imgWrap">
                <img src="../assets/image/xiangmu.svg" alt="" />
              </div>
              <span
                v-show="isProjectShow"
                class="number"
                style="width:70px;overflow:hidden;textOverflow:ellipsis;whiteSpace: nowrap;"
                >{{ projectGroup.length }}</span
              >
              <span
                v-show="!isProjectShow"
                class="number"
                style="width:70px;overflow:hidden;textOverflow:ellipsis;whiteSpace: nowrap;"
                >{{ currentProjectInfo.projectName }}</span
              >
              <span v-show="isProjectShow" class="text">全部项目</span>
              <span v-show="!isProjectShow" class="text">当前项目</span>
            </div>
          </el-col>
          <el-col style="width:100%;height:100%;" :xs="6" :sm="6">
            <div class="itemWrap">
              <div class="imgWrap" @click="updataList('all')">
                <img src="../assets/image/shebei.svg" alt="" />
              </div>
              <span :class="{ number: true, allActive: lightObj.all }">{{
                equipStateGroup.equipmentCount
              }}</span>
              <span :class="{ text: true, allActive: lightObj.all }"
                >全部设备</span
              >
            </div></el-col
          >
          <el-col style="width:100%;height:100%;" :xs="6" :sm="6">
            <div class="itemWrap">
              <div class="imgWrap" @click="updataList('working')">
                <img src="../assets/image/yunxing.svg" alt="" />
              </div>
              <span :class="{ number: true, workActive: lightObj.working }">{{
                equipStateGroup.runningCount
              }}</span>
              <span :class="{ text: true, workActive: lightObj.working }"
                >运行设备</span
              >
            </div></el-col
          >
          <el-col style="width:100%;height:100%;" :xs="6" :sm="6">
            <div class="itemWrap">
              <div class="imgWrap" @click="updataList('offline')">
                <img src="../assets/image/lixian.svg" alt="" />
              </div>
              <span
                :class="{ number: true, offlineActive: lightObj.offline }"
                >{{ equipStateGroup.offlineCount }}</span
              >
              <span :class="{ text: true, offlineActive: lightObj.offline }"
                >离线设备</span
              >
            </div></el-col
          >
        </swiper-slide>
        <swiper-slide>
          <el-col style="width:100%;height:100%;" :xs="6" :sm="6">
            <div class="itemWrap">
              <div class="imgWrap" @click="updataList('alarm')">
                <img src="../assets/image/baojing.svg" alt="" />
              </div>
              <span :class="{ number: true, alarmActive: lightObj.alarm }">{{
                equipStateGroup.alarmCount
              }}</span>
              <span :class="{ text: true, alarmActive: lightObj.alarm }"
                >报警设备</span
              >
            </div>
          </el-col>
          <el-col style="width:100%;height:100%;" :xs="6" :sm="6">
            <div class="itemWrap">
              <div class="imgWrap" @click="updataList('standby')">
                <img src="../assets/image/daiji.svg" alt="" />
              </div>
              <span
                :class="{ number: true, standbyActive: lightObj.standby }"
                >{{ equipStateGroup.standbyCount }}</span
              >
              <span :class="{ text: true, standbyActive: lightObj.standby }"
                >待机设备</span
              >
            </div>
          </el-col>
          <el-col style="width:100%;height:100%;" :xs="6" :sm="6">
            <div class="itemWrap">
              <div class="imgWrap" @click="updataList('fault')">
                <img src="../assets/image/guzhang.svg" alt="" />
              </div>
              <span :class="{ number: true, falutActive: lightObj.fault }">{{
                equipStateGroup.faultCount
              }}</span>
              <span :class="{ text: true, falutActive: lightObj.fault }"
                >故障设备</span
              >
            </div>
          </el-col>
          <el-col style="width:100%;height:100%;" :xs="6" :sm="6">
            <div class="itemWrap">
              <div class="imgWrap" @click="updataList('disabled')">
                <img src="../assets/image/tingyong.svg" alt="" />
              </div>
              <span
                :class="{ number: true, disabledActive: lightObj.disabled }"
                >{{ equipStateGroup.disableCount }}</span
              >
              <span :class="{ text: true, disabledActive: lightObj.disabled }"
                >停用设备</span
              >
            </div>
          </el-col>
        </swiper-slide>
      </swiper>
    </el-col>
  </el-row>
  <div @click.stop="show = false" class="downWrap">
    <el-collapse-transition>
      <div v-show="show" class="itemWrap">
        <div class="transitionWrap">
          <div class="buttonWrap">
            <el-button @click="selectALLClick(projectGroup)" type="primary"
              >全部项目</el-button
            >
          </div>
          <ul>
            <li
              @click="selectOneClick(item), setMarkRedColor(item)"
              v-for="item in projectGroup"
              :key="item"
            >
              {{ item.projectName }}
            </li>
          </ul>
        </div>
      </div>
    </el-collapse-transition>
  </div>
  <!-- 状态概览结束 xs sm -->
  <!-- 下方区域开始 -->
  <el-row class="middleWrap">
    <el-col class="mapCol" :xs="24" :sm="24" :md="11" :lg="8" :xl="8">
      <div class="mapWrap stateAndViewCommon" id="map">
        <equipment-map ref="refMap"></equipment-map>
      </div>
    </el-col>
    <el-col
      class="stateOverviewCol"
      :xs="24"
      :sm="24"
      :md="13"
      :lg="10"
      :xl="10"
    >
      <div class="stateOverview stateAndViewCommon">
        <state-overview ref="refState"></state-overview>
      </div>
    </el-col>
    <el-col class="monitorCol" :xs="24" :sm="24" :md="11" :lg="6" :xl="6">
      <div class="monitorOverview stateAndViewCommon">
        <monitor-overview ref="resMonitor"></monitor-overview>
      </div>
    </el-col>
    <el-col class="lineCol" :xs="24" :sm="24" :md="13" :lg="8" :xl="8">
      <div class="chart">
        <div id="lineChart">
          <line-chart ref="refLine"></line-chart>
        </div>
      </div>
    </el-col>
    <el-col
      class="equipmentListCol"
      :xs="24"
      :sm="24"
      :md="24"
      :lg="16"
      :xl="16"
    >
      <div class="equipmentList" style="background-color:#1C1F30;">
        <equipment-list ref="refEquipList"></equipment-list>
      </div>
    </el-col>
  </el-row>
  <!-- 下方区域结束 -->
</template>

<script>
import EquipmentMap from "../components/overview/Map.vue";
import StateOverview from "../components/overview/Status.vue";
import MonitorOverview from "../components/overview/Monitor.vue";
import LineChart from "../components/overview/LineChart.vue";
import EquipmentList from "../components/overview/EquipmentList.vue";
import { getItem, setItem } from "../api";
import { eventBus } from "@ai-zen/event-bus";
import { Swiper, SwiperSlide } from "swiper/vue";
import SwiperCore, { Pagination } from "swiper";
SwiperCore.use([Pagination]);
export default {
  name: "Overview",
  data() {
    return {
      // 当前项目的名称
      currentProjectName: "项目总数",
      // 项目下拉框开关
      show: false,
      // 尺寸大于992px时的项目下拉框开关
      showBig: false,
      // 项目切换开关
      isProjectShow: true,
      // 项目信息
      projectGroup: [],
      // 当前项目的项目信息
      currentProjectInfo: {},
      // 设备信息
      equipGroup: [],
      // 设备状态
      equipStateGroup: [],
      // 高亮样式标志对象
      lightObj: {
        all: true,
        working: false,
        offline: false,
        alarm: false,
        standby: false,
        fault: false,
        disabled: false,
      },
    };
  },
  components: {
    EquipmentMap,
    StateOverview,
    MonitorOverview,
    LineChart,
    EquipmentList,
    Swiper,
    SwiperSlide,
    Pagination,
  },
  async created() {
    // 发送请求获取项目信息
    const resProject = await this.$http.post(this.$urlObj.queryProject, {
      userCode: getItem("userData").userCode,
    });
    if (resProject.status === 200) {
      this.projectGroup = resProject.data.data;
    }
    // 发送请求获取设备信息
    const resEquip = await this.$http.post(this.$urlObj.queryEquip, {
      userCode: getItem("userData").userCode,
    });
    if (resEquip.status === 200) {
      this.equipGroup = resEquip.data.data;
    }
    // 发送请求获取设备运行状态信息
    const resEquipState = await this.$http.post(
      this.$urlObj.querySummaryCount,
      { userCode: getItem("userData").userCode }
    );
    if (resEquipState.status === 200) {
      this.equipStateGroup = resEquipState.data.data;
      this.equipStateGroupBack = resEquipState.data.data;
    }
  },
  mounted() {
    window.addEventListener("resize", () => {
      if (this.$refs.refState) {
        this.$refs.refState.myResize();
      }
      if (this.$refs.resMonitor) {
        this.$refs.resMonitor.myResize();
      }
      if (this.$refs.refLine) {
        this.$refs.refLine.myResize();
      }
    });
    window.addEventListener("click", () => {
      this.showBig = false;
      this.show = false;
    });
    eventBus.on("closeDownWrap", () => {
      this.show = false;
      this.showBig = false;
    });
    eventBus.on("mapToOverview", (data) => {
      this.selectOneClick(data);
    });
  },
  // 由其他页面跳转过来，重载当前页面
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (to.path == "/index/overview" && from.path !== "/") {
        window.location.reload();
      }
    });
  },
  // 当该路由离开前，清除定时器
  beforeRouteLeave(to, from, next) {
    next();
    if (window.selectEquipTimer) {
      clearInterval(window.selectEquipTimer);
    }
  },
  methods: {
    // 单个项目选择点击事件
    async selectOneClick(data) {
      this.isProjectShow = false;
      this.lightObj.all = true;
      this.lightObj.working = false;
      this.lightObj.offline = false;
      this.lightObj.alarm = false;
      this.lightObj.standby = false;
      this.lightObj.fault = false;
      this.lightObj.disabled = false;
      this.show = false;
      this.showBig = false;
      this.currentProjectInfo = data;
      const res = await this.$http.post(this.$urlObj.querySummaryCount, {
        userCode: getItem("userData").userCode,
        projectCode: data.projectCode,
      });
      if (res.status === 200 && res.data.resultCode == "0000") {
        this.equipStateGroup = res.data.data;
      }
      // 执行EquipmentList子组件的获取当前项目设备的方法
      this.$refs.refEquipList.getOneProjectEquip(data);
      this.$refs.refState.getOneProjectState(data);
      this.$refs.refLine.getOneProjectLine(data);
    },

    // 全部项目选择点击事件
    async selectALLClick(projectGroup) {
      this.isProjectShow = true;
      this.lightObj.all = true;
      this.lightObj.working = false;
      this.lightObj.offline = false;
      this.lightObj.alarm = false;
      this.lightObj.standby = false;
      this.lightObj.fault = false;
      this.lightObj.disabled = false;
      this.show = false;
      this.showBig = false;
      const res = await this.$http.post(this.$urlObj.querySummaryCount, {
        userCode: getItem("userData").userCode,
      });
      if (res.status === 200 && res.data.resultCode == "0000") {
        this.equipStateGroup = res.data.data;
      }
      // 执行EquipmentList子组件获取所有设备的方法
      this.$refs.refEquipList.getAllProjectEquip(projectGroup);
      this.$refs.refState.getAllProjectState(projectGroup);
      this.$refs.refLine.getAllProjectLine(projectGroup);
    },

    // 单击单个项目地图上用颜色标注
    setMarkRedColor(data) {
      this.$refs.refMap.updataIcon(data);
    },
    // 按工作状态更新设备列表
    updataList(state) {
      switch (state) {
        case "all":
          this.changeFlag(state);
          break;
        case "working":
          this.changeFlag(state);
          break;
        case "offline":
          this.changeFlag(state);
          break;
        case "alarm":
          this.changeFlag(state);
          break;
        case "standby":
          this.changeFlag(state);
          break;
        case "fault":
          this.changeFlag(state);
          break;
        case "disabled":
          this.changeFlag(state);
          break;
        default:
          break;
      }
      this.$refs.refEquipList.getWorkState(state);
    },
    // 改变设备状态的函数
    changeFlag(state) {
      let keys = Object.keys(this.lightObj);
      keys.forEach((item) => {
        if (state == item) {
          this.lightObj[item] = true;
        } else {
          this.lightObj[item] = false;
        }
      });
    },
    // equipTypeChange(data) {
    //   console.log(data);
    // },
  },
};
</script>

<style lang="scss" scoped>
// 状态概览样式开始
.showStateWrap {
  width: 100%;
  height: 5%;
  padding-left: 4%;
  margin: 1.074% 0;
  min-height: 54px;
  .el-col {
    height: 100%;
    width: 100%;
    .stateCommon {
      width: 100%;
      height: 100%;
      position: relative;
      .icon {
        width: 23.19%;
        height: 100%;
        min-height: 54px;
        min-width: 54px;
        cursor: pointer;
        img {
          height: 100%;
          width: 100%;
          min-height: 54px;
          min-width: 54px;
        }
      }
      .number {
        color: #bababa;
        font-size: 20px;
        font-weight: bold;
        position: absolute;
        left: 26%;
        top: 0;
        padding-left: 3%;
      }
      @media screen and (min-width: 991px) {
        .number {
          margin-left: 14px !important;
          top: 5px !important;
          padding-left: 14px;
        }
        .text {
          font-size: 14px !important;
          margin-left: 24px;
          bottom: 8px !important;
        }
      }
      @media screen and (min-width: 1200px) {
        .number {
          top: -5px !important;
        }
        .text {
          bottom: 0 !important;
          font-size: 16px !important;
        }
      }
      .text {
        color: #adadad;
        float: left;
        position: absolute;
        left: 26%;
        bottom: 0;
        padding-left: 3%;
      }
      @media screen and (min-width: 1366px) {
        .number {
          padding-left: 10px !important;
        }
        .text {
          padding-left: 0 !important;
        }
      }
      @media screen and (min-width: 1366px) {
        .number {
          padding-left: 5px !important;
          top: 0 !important;
        }
        .text {
          margin-left: 20px !important;
        }
      }
      @media screen and (min-width: 1920px) {
        .number {
          padding-left: 0 !important;
          top: 0 !important;
        }
        .text {
          margin-left: 12px !important;
        }
      }
    }
  }
  .projectDropDownBox {
    background-color: #494c59;
    position: absolute;
    left: 1%;
    top: 103%;
    width: 200px;
    z-index: 999;
    .buttonWrap {
      position: relative;
      .el-button {
        background-color: #0f8ffd;
        width: 100%;
        left: 1%;
        top: 10%;
      }
    }
    .transitionBox {
      color: white;
      width: 100%;
      height: 300px;
      font-size: 14px;
      overflow: auto;
      background-color: #1c1f30;
      border: 1px solid #adadad;
      li {
        padding: 4px;
        cursor: pointer;
      }
      li:hover {
        color: #0f8ffd;
      }
    }
  }
}

// 状态概览样式结束

// 状态概览xs样式开始
.xsRow {
  width: 100%;
  height: 60px;
  .itemWrap {
    width: 100%;
    height: 100%;
    max-width: 140px;
    position: relative;
    .imgWrap {
      width: 43%;
      height: 60%;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      position: relative;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        cursor: pointer;
      }
    }
  }
  .number {
    position: absolute;
    display: block;
    text-align: left;
    left: 44%;
    top: 14%;
    font-weight: bold;
    color: #bababa;
  }

  @media screen and (min-width: 768px) {
    .number {
      font-size: 18px;
    }
  }
  .text {
    font-size: 0.5rem;
    position: absolute;
    left: 45%;
    color: #bababa;
  }
  .swiper-container {
    height: 100%;
  }
  .swiper-pagination {
    width: 100px;
  }
}
@media screen and (min-width: 768px) {
  .xsRow {
    height: 70px;
  }
}
.downWrap {
  position: absolute;
  left: 1%;
  top: 10%;
  z-index: 999;
  width: 98%;
  max-width: 367px;
  .itemWrap {
    width: 100%;
    height: 100%;
    border: 1px solid #adadad;
    .transitionWrap {
      color: white;
      width: 100%;
      height: 300px;
      font-size: 14px;
      overflow: auto;
      background-color: #1c1f30;
      .buttonWrap {
        width: 100%;
        .el-button {
          width: 100%;
        }
      }
      li {
        padding: 5px 0 5px 5px;
        cursor: pointer;
        box-sizing: border-box;
      }
    }
  }
}
@media screen and (min-width: 992px) {
  .isDisplayState {
    display: none;
  }
  .isDisplayMd {
    display: block !important;
  }
}
// 状态概览xs样式结束

// 状态概览以下样式xs开始
.middleWrap {
  width: 100%;
  margin-top: 3.074%;
  margin-bottom: 1.074%;
  .el-col {
    width: 100%;
    margin-bottom: 20px;
  }
  .mapCol {
    height: 300px;
    .mapWrap {
      height: 100%;
    }
  }
  @media screen and (min-width: 992px) {
    .mapCol {
      height: 320px;
    }
    .stateOverviewCol {
      height: 320px !important;
      padding-left: 8px !important;
      background-color: #070a1d !important;
      .stateOverview {
        background-color: #1c1f30;
      }
    }
  }
  @media screen and (min-width: 1200px) {
    .mapCol {
      height: 260px;
    }
    .stateOverviewCol {
      padding-left: 24px !important;
    }
  }
  .stateOverviewCol {
    height: 12.5em;
    background-color: #1c1f30;
    .stateOverview {
      height: 100%;
    }
  }
  @media screen and (min-width: 768px) {
    .stateOverviewCol {
      height: 18em;
    }
  }
  @media screen and (min-width: 1200px) {
    .stateOverviewCol {
      height: 260px !important;
    }
  }
  // @media screen and (min-width:600px) {
  //   .stateOverviewCol {
  //     height: 16em;
  //   }
  // }
  // @media screen and (min-width:768px) {
  //   .stateOverviewCol {
  //     height: 20em;
  //   }
  // }
  .monitorCol {
    height: 220px;
    .monitorOverview {
      height: 100%;
    }
  }
  @media screen and(min-width:768px) {
    .monitorCol {
      height: 260px;
    }
  }
  @media screen and (min-width: 992px) {
    .monitorCol {
      height: 376px;
    }
  }
  @media screen and (min-width: 1200px) {
    .monitorCol {
      height: 260px;
      padding-left: 24px !important;
    }
  }
  .lineCol {
    height: 420px;
    .chart {
      height: 100%;
    }
  }
  @media screen and (min-width: 768px) {
    .lineCol {
      height: 500px;
    }
  }
  @media screen and (min-width: 992px) {
    .lineCol {
      height: 376px;
      padding-left: 8px;
    }
  }
  @media screen and (min-width: 1200px) {
    .lineCol {
      height: 540px;
      padding-left: 0;
    }
  }
  .equipmentListCol {
    height: 481px;
    .equipmentList {
      height: 100%;
    }
  }
  @media screen and (min-width: 1200px) {
    .equipmentListCol {
      padding-left: 24px;
      background-color: #070a1d !important;
      height: 540px;
    }
  }

  .el-col:nth-child(2),
  .el-col:nth-child(3) {
    padding-left: 1%;
  }
  @media screen and (min-width: 375px) {
    .el-col:nth-child(2),
    .el-col:nth-child(3) {
      padding-left: 0;
    }
  }
  .chart {
    width: 100%;
    height: 100%;
    background-color: #1c1f30;
    #lineChart {
      width: 100%;
      height: 100%;
    }
  }
  .equipmentListCol {
    background-color: #1c1f30;
  }
}
@media screen and (min-width: 768px) {
  .middleWrap {
    margin-top: 1.074%;
  }
}
// 状态概览以下样式xs结束
// 中间区域开始

// 中间区域结束

// 底部区域开始
// .footerWrap {
//   width: 100%;
//   height: 50%;
//   min-height: 540px;
//   .el-col:nth-child(1) {
//     background-color: #1C1F30;
//   }
//   .el-col:nth-child(2) {
//     padding-left: 1%;
//     .equipmentList {
//       width: 100%;
//       height: 100%;
//     }
//   }
//   .chart {
//     width: 100%;
//     height: 100%;
//     #lineChart {
//       width: 100%;
//       height: 100%;
//     }
//   }
// }
.allActive {
  color: #15b6b0 !important;
}
.workActive {
  color: #00c994 !important;
}
.offlineActive {
  color: #cc81e5 !important;
}
.alarmActive {
  color: #ff4a46 !important;
}
.standbyActive {
  color: #0099ff !important;
}
.falutActive {
  color: #0099ff !important;
}
.disabledActive {
  color: #0099ff !important;
}

// 底部区域结束

:deep(.el-carousel__container) {
  width: 100%;
  height: 100%;
  button {
    display: none;
  }
}
:deep(.el-carousel) {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
}
:deep(.el-carousel__indicator--horizontal) {
  padding: 0;
}
:deep(.swiper-pagination) {
  bottom: -4px !important;
}
:deep(.swiper-pagination-bullet) {
  background-color: #ccc;
  width: 10%;
  height: 1px;
  border-radius: 0;
}
:deep(.swiper-pagination-bullet-active) {
  background-color: #0099ff;
}
</style>
