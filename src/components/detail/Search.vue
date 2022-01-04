<template>
  <el-row>
    <el-col class="topSearchCol" :xs="24" :sm="24" :md="24" :lg="12">
      <!-- 选择项目的搜索框 开始 -->
      <el-select
        class="projectSelect"
        v-model="projectValue"
        placeholder="请选择项目"
        @change="getCurrentProjectEquip"
        :title="currentProjectName"
        :popper-append-to-body="false"
      >
        <el-option
          v-for="item in projectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <!-- 选择项目的搜索框 结束 -->

      <!-- 选择设备的搜索框 开始 -->
      <el-select
        v-model="equipValue"
        :disabled="equipFlag"
        placeholder="请选择设备"
        @change="getCurrentEquipCode"
      >
        <el-option
          v-for="item in equipOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <!-- 选择设备的搜索框 结束 -->
      <el-button
        :disabled="buttonFlag"
        :class="{ active: !buttonFlag }"
        @click="queryEquipInfo"
        >查询</el-button
      >
    </el-col>
    <el-col
      v-if="isShow"
      class="downTextCol"
      :xs="24"
      :sm="24"
      :md="24"
      :lg="12"
    >
      <div @click.stop="refreshItemData" class="updateBtn">
        <i class="el-icon-refresh-right"></i>
        刷新
      </div>
      <div class="textWrap">
        <div class="textLeft">
          <p>传感器损伤数据：{{ sensorEncodeData.sensorDataCount }}&nbsp; 条</p>
          <p>
            编码器行驶距离：{{ sensorEncodeData.encodeRunningDistance }}&nbsp; m
          </p>
        </div>
        <div class="textRight">
          <div class="connectTimeWrap">
            <span
              >上电联络时间：{{ sensorEncodeData.sensorLastHandshake }}</span
            >
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>心跳时间：{{ sensorEncodeData.sensorLastKeepalive }}</span>
            <i
              @click.stop="handleClickConnectTime"
              :class="{
                'el-icon-tickets': true,
                connectTime: true,
                isActiveConnectTime: isActiveConnectTimeShow,
              }"
            ></i>
          </div>
          <div class="heartbeatTimeWrap">
            <span
              >上电联络时间：{{ sensorEncodeData.encodeLastHandshake }}</span
            >
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span>心跳时间：{{ sensorEncodeData.encodeLastKeepalive }}</span>
            <i
              @click.stop="handleClickHeartbeatTime"
              :class="{
                'el-icon-tickets': true,
                heartbeatTime: true,
                isActiveHeartbeatTime: isActiveHeartbeatTimeShow,
              }"
            ></i>
          </div>
        </div>
      </div>
      <div
        @click.stop="isItemWrapShow = true"
        v-show="isItemWrapShow"
        class="itemListWrap"
      >
        <div class="itemListWrapHeader">{{ listOptions.name }}</div>
        <ul>
          <li v-for="(item, index) in listOptions.data" :key="index">
            {{ item }}
          </li>
        </ul>
      </div>
      <div v-show="isItemWrapShow" class="modeSelectWrap"></div>
    </el-col>
  </el-row>
</template>

<script>
import { eventBus } from "@ai-zen/event-bus";
import { getItem, removeItem } from "../../api/index";
import SensorEncodeInfor from "../child/SensorEncodeInfor.vue";
export default {
  name: "Search",
  data() {
    return {
      // 项目搜索框的列表值
      projectOptions: [],
      // 设备搜索框的列表值
      equipOptions: [],
      // 双向绑定项目的选项值
      projectValue: "",
      // 双向绑定设备的选项值
      equipValue: "",
      // 设备禁用开关，false：激活，true：禁用
      equipFlag: true,
      // 查询按钮禁用开关,false：激活，true：禁用
      buttonFlag: true,
      // 当前项目的项目名称
      currentProjectName: "",
      // 当前项目的项目编码
      currentProjectCode: "",
      // 当前设备的设备编码
      currentEquipCode: "",
      // 记录点击查询事件
      isClickSearch: false,
      //
      isShow: false,
      // 列表容器是否显示
      isItemWrapShow: false,
      // 列表容器数据
      listOptions: { name: "", data: [] },
      // 传感器损伤数据和编码器行驶距离
      sensorEncodeData: {
        // 传感器当天数据回传条数
        sensorDataCount: "",
        // 编码器当天行驶距离
        encodeRunningDistance: "",
        //编码器 最新上电联络时间
        encodeLastHandshake: "",
        // 传感器最新上电联络时间
        sensorLastHandshake: "",
        //传感器 最新心跳时间
        sensorLastKeepalive: "",
        // 编码器 最新心跳时间
        encodeLastKeepalive: "",
      },
      // 列表数据对象
      listDataObj: {
        connectTime: { name: "上电联络时间", data: [] },
        heartbeatTime: { name: "心跳时间", data: [] },
      },
      // 查询传感器和编码器数据的定时器
      querySensorEncodeTimer: null,
      // 上电联络时间 激活时的样式的开关
      isActiveConnectTimeShow: false,
      // 心跳时间 激活时的样式的开关
      isActiveHeartbeatTimeShow: false,
    };
  },
  components: {
    SensorEncodeInfor,
  },
  async created() {
    let userCode = getItem("userData").userCode;
    if (userCode && userCode == "999999") {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
    this.listDataObj.connectTime.data = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
    ];
    this.listDataObj.heartbeatTime.data = [
      14,
      13,
      12,
      11,
      10,
      9,
      8,
      7,
      6,
      5,
      4,
      3,
      2,
      1,
    ];
    // 请求当前账户下的所有项目
    const res = await this.$http.post(this.$urlObj.queryProject, {
      userCode: getItem("userData").userCode,
    });
    if (res.status === 200) {
      // 项目数据
      let data = res.data.data;
      for (let i = 0; i < data.length; i++) {
        let options = { value: "", label: "" };
        options.value = data[i].projectCode;
        options.label = data[i].projectName;
        this.projectOptions.push(options);
      }
      if (getItem("equipData")) {
        this.bindSelect(getItem("equipData"));
      }
    }
  },
  mounted() {
    if (getItem("equipData")) {
      this.quickQuerySensorEncodeInfor(
        getItem("equipData").equipmentCode,
        true
      );
      this.getComponentFlag(getItem("equipData").equipmentCode);
    }

    document.addEventListener("click", this.documentClick);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.documentClick);
    clearInterval(this.querySensorEncodeTimer);
    this.querySensorEncodeTimer = null;
  },

  methods: {
    // 监听点击事件
    documentClick() {
      this.isItemWrapShow = false;
      this.isActiveConnectTimeShow = false;
      this.isActiveHeartbeatTimeShow = false;
    },
    // 获取当前项目的所有设备
    async getCurrentProjectEquip(projectCode) {
      this.equipOptions = [];
      this.equipValue = "";
      this.currentProjectCode = projectCode;
      this.isClickSearch = false;

      // 获取当前项目的项目名称，传递给兄弟组件overview使用
      for (let i = 0; i < this.projectOptions.length; i++) {
        if (this.projectOptions[i].value == projectCode) {
          this.currentProjectName = this.projectOptions[i].label;
        }
      }
      const res = await this.$http.post(this.$urlObj.queryEquip, {
        userCode: getItem("userData").userCode,
        projectCode: projectCode,
      });
      if (res.status === 200 && res.data.data) {
        let data = res.data.data;
        for (let i = 0; i < data.length; i++) {
          let options = { value: "", label: "" };
          options.value = data[i].equipmentCode;
          options.label = data[i].equipmentName;
          this.equipOptions.push(options);
        }
        // 激活设备查询框
        this.equipFlag = false;
      }
      // 禁用查询按钮
      this.buttonFlag = true;
    },
    // 判断设备类型，改变组件展示标志
    getComponentFlag(equipmentCode) {
      let flag = "";
      if (equipmentCode == "6143f67cf80a12edc1314d92") {
        flag = "suodao";
      } else {
        flag = "nosuodao";
      }
      this.$emit("showComponent", { flag: flag });
    },
    // 获取当前设备的设备编码及所属项目的项目编码
    async getCurrentEquipCode(equipmentCode) {
      this.isClickSearch = false;
      this.currentEquipCode = equipmentCode;
      this.getComponentFlag(equipmentCode);
      // 如果当前项目编码为空，说明是从全局概览页面跳转而来，则路由中携带的项目编码即为当前的项目编码
      if (this.currentProjectCode == "") {
        this.currentProjectCode = this.$route.params.projectCode;
      }
      // 否则，当前项目的项目编码是用户点击项目选择框后的
      this.buttonFlag = false;
      removeItem("equipData");
    },
    // 注册设备信息查询的方法，传递数据给兄弟组件
    queryEquipInfo() {
      this.isClickSearch = true;
      // 查询传感器编码器信息
      this.querySonserEncodeInfor();
      eventBus.emit("clickSearch", { isClickSearch: this.isClickSearch });
      eventBus.emit("queryEquipInfo", {
        currentEquipCode: this.currentEquipCode,
        currentProjectCode: this.currentProjectCode,
      });
    },

    // 绑定搜索的内容
    async bindSelect(data) {
      this.projectValue = data.projectCode;
      this.equipValue = data.equipmentCode;
      this.currentEquipCode = data.equipmentCode;
      this.currentProjectName = data.projectName;
      this.currentProjectCode = data.projectCode;
      const res = await this.$http.post(this.$urlObj.queryEquip, {
        userCode: getItem("userData").userCode,
        projectCode: data.projectCode,
      });
      if (res.status === 200) {
        this.equipOptions = [];
        let data = res.data.data;
        for (let i = 0; i < data.length; i++) {
          let options = { value: "", label: "" };
          options.value = data[i].equipmentCode;
          options.label = data[i].equipmentName;
          this.equipOptions.push(options);
        }
      }
      // 激活设备查询框
      this.equipFlag = false;
      // 激活查询按钮
      this.buttonFlag = false;
    },
    // 点击上电联络时间事件
    handleClickConnectTime() {
      this.listOptions.data = this.listDataObj.connectTime.data;
      this.listOptions.name = this.listDataObj.connectTime.name;
      this.isActiveConnectTimeShow = true;
      this.isActiveHeartbeatTimeShow = false;
      if (this.isClickSearch && !this.buttonFlag) {
        this.isItemWrapShow = !this.isItemWrapShow;
      }
      if (!this.isItemWrapShow) {
        this.isActiveConnectTimeShow = false;
      }
    },
    // 点击心跳时间事件
    handleClickHeartbeatTime() {
      this.listOptions.data = this.listDataObj.heartbeatTime.data;
      this.listOptions.name = this.listDataObj.heartbeatTime.name;
      this.isActiveConnectTimeShow = false;
      this.isActiveHeartbeatTimeShow = true;
      if (this.isClickSearch && !this.buttonFlag) {
        this.isItemWrapShow = !this.isItemWrapShow;
      }
      if (!this.isItemWrapShow) {
        this.isActiveHeartbeatTimeShow = false;
      }
    },
    // 刷新列表数据事件
    refreshItemData() {
      this.quickQuerySensorEncodeInfor(this.currentEquipCode, true);
      if (this.isClickSearch && !this.buttonFlag) {
        this.isItemWrapShow = false;
        this.isActiveConnectTimeShow = false;
        this.isActiveHeartbeatTimeShow = false;
      }
    },
    // 查询传感器编码器信息
    querySonserEncodeInfor() {
      this.quickQuerySensorEncodeInfor(this.currentEquipCode, true);
      clearInterval(this.querySensorEncodeTimer);
      this.querySensorEncodeTimer = null;
      this.querySensorEncodeTimer = setInterval(() => {
        this.quickQuerySensorEncodeInfor(this.currentEquipCode, false);
      }, 30000);
    },

    // 立即查询传感器和编码器信息
    async quickQuerySensorEncodeInfor(equipmentCode, isInit) {
      if (isInit) {
        Object.keys(this.sensorEncodeData).forEach((key) => {
          this.sensorEncodeData[key] = "";
        });
      }
      const res = await this.$http.post(this.$urlObj.queryRealtimeCache, {
        equipmentCode,
      });
      if (res.status == 200 && res.data.resultCode == "0000") {
        let data = res.data.data;
        for (let key in data) {
          this.sensorEncodeData[key] = data[key];
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  width: 100%;
  height: 100%;
  background-color: #1c1f30;
  .el-col {
    display: flex;
    justify-content: left;
    align-items: center;
    background-color: #1c1f30;
  }
  .topSearchCol {
    height: 80px;
    width: 100%;
  }
  .downTextCol {
    width: 100%;
    height: 230px;
    margin-top: 20px;
    position: relative;
  }
  @media screen and (min-width: 1200px) {
    .downTextCol {
      height: 100%;
      margin-top: 0;
      width: 100%;
      .textWrap {
        width: 100%;
        height: 100%;
        top: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        .textLeft {
          width: 25%;
          float: left;
          padding-top: 0;
          height: 80%;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .textRight {
          width: 64%;
          float: left;
          padding-left: 0;
          padding-top: 0;
          height: 80%;
          border-left: 0;
          border-top: 1px solid #393c51;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 12px;
        }
      }
      .updateBtn {
        right: 20px;
      }
    }
  }
  .el-select {
    padding-left: 1%;
  }
  .el-button {
    margin-left: 23px;
    width: 96px;
    height: 40px;
    background-color: #33394e;
    border: 0;
    border-radius: 2px;
    color: #ffffff;
  }
  .updateBtn {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    position: absolute;
    top: 22px;
    right: 14px;
    z-index: 999;
    .el-icon-refresh-right {
      color: #0099ff;
      font-size: 18px;
      margin-right: 6px;
    }
  }
  .updateBtn:hover {
    cursor: pointer;
  }
  .textWrap {
    background-color: #1c1f30;
    height: 140px;
    width: 94.0217%;
    position: absolute;
    top: 58px;
    left: 50%;
    transform: translateX(-50%);
    .textLeft {
      font-size: 16px;
      height: 50%;
      box-sizing: border-box;
      padding-top: 0.5%;
      color: #ffffff;
      border: 1px solid #393c51;
      padding-left: 12px;
      padding-top: 12px;
      p:nth-child(1) {
        margin-bottom: 5px;
      }
    }
    .textRight {
      padding-top: 12px;
      height: 50%;
      color: #ffffff;
      border: 1px solid #393c51;
      border-top: 0;
      padding-left: 12px;
      box-sizing: border-box;
      div {
        position: relative;
      }
      div:nth-child(1) {
        margin-bottom: 5px;
      }
      .connectTime {
        position: absolute;
        right: 2%;
        top: 4%;
        cursor: pointer;
      }
      .heartbeatTime {
        position: absolute;
        right: 2%;
        top: 4%;
        cursor: pointer;
      }
      .el-icon-tickets:hover {
        color: #0099ff;
      }
    }
  }
  .itemListWrap {
    width: 193px;
    height: 290px;
    background-color: #1c1f30;
    position: absolute;
    right: 0;
    top: 100%;
    z-index: 2;
    border: 1px solid #393c51;
    box-sizing: border-box;
    .itemListWrapHeader {
      width: 100%;
      height: 14%;
      color: #ffffff;
      background-color: #33394e;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    ul {
      height: 86%;
      overflow: auto;
    }
    ul::-webkit-scrollbar {
      width: 2px;
      background-color: #1c1f30;
    }
    ul::-webkit-scrollbar-thumb {
      background-color: #0099ff;
    }

    li {
      height: 30px;
      text-align: center;
      line-height: 30px;
      color: #dcdddf;
      font-size: 14px;
      border-bottom: 1px solid #292b3d;
    }
  }
  .modeSelectWrap {
    width: 50%;
    height: 100%;
    background-color: #fff;
    position: absolute;
    left: 0;
    opacity: 0;
  }
}
:deep(.el-select .select-trigger .el-input .el-input__inner) {
  background-color: #1c1f30 !important;
}
.active {
  background-color: #0099ff !important;
}
.isActiveConnectTime {
  color: #0099ff;
}
.isActiveHeartbeatTime {
  color: #0099ff;
}
:deep(.select-trigger) {
  border: 1px solid #758aaa;
  border-radius: 4px;
}
:deep(.el-select__popper) {
  width: 95vw !important;
  max-width: 357px !important;
}
.el-select-dropdown__item.selected {
  background-color: #0099ff;
}
</style>
