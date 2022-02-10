<template>
  <el-row class="cablewayOverview">
    <el-col>
      <div class="overviewTitle">实时监测概览</div>
      <div class="tableWrap">
        <table cellspacing="0">
          <tbody class="big" v-if="isShow">
            <tr>
              <td>项目: {{ overviewData.projectName }}</td>
              <td>设备: {{ overviewData.equipmentName }}</td>
              <td>风险程度: {{ translateZh(overviewData.riskLevel) }}</td>
              <td
                style="position: relative;
              "
              >
                <div>
                  实时风险：
                </div>
                <div class="barAnimationWrap">
                  <bar-animation :percentData="percentData"></bar-animation>
                </div>
              </td>
            </tr>
            <tr>
              <td>地址: {{ overviewData.installLocation }}</td>
              <td>运行状态：{{ workState }}</td>
              <td>安装时间: {{ overviewData.installDate }}</td>
              <td>到期时间: {{ overviewData.validTime }}</td>
            </tr>
            <tr>
              <td>识别码序列号：{{ overviewData.serials }}</td>

              <td>工作状态：{{ workingZh(overviewData.workingStatus) }}</td>
              <td>平均损伤值: {{ overviewData.avgDamage }}</td>
              <td>损伤个数：{{ overviewData.damageCount }}</td>
            </tr>
            <tr>
              <td>当日运行里程: {{ overviewData.runningDistance }}&nbsp; km</td>
              <td>当日运行时长: {{ overviewData.runningTime }} &nbsp;h</td>
              <td>是否报警：否</td>
              <td>责任人: {{ overviewData.contactPerson }}</td>
            </tr>
          </tbody>
          <tbody class="small" v-if="!isShow">
            <tr>
              <td>项目: {{ overviewData.projectName }}</td>
              <td>设备: {{ overviewData.equipmentName }}</td>
            </tr>
            <tr>
              <td>风险程度: {{ translateZh(overviewData.riskLevel) }}</td>
              <td
                style="position: relative;
              "
              >
                <div>
                  实时风险：
                </div>
                <div class="barAnimationWrap">
                  <bar-animation :percentData="percentData"></bar-animation>
                </div>
              </td>
            </tr>
            <tr>
              <td>识别码序列号：{{ overviewData.serials }}</td>
              <td>地址: {{ overviewData.installLocation }}</td>
            </tr>
            <tr>
              <td>安装时间: {{ overviewData.installDate }}</td>
              <td>到期时间: {{ overviewData.validTime }}</td>
            </tr>
            <tr>
              <td>运行状态：运行</td>
              <td>工作状态：{{ workingZh(overviewData.workingStatus) }}</td>
            </tr>
            <tr>
              <td>平均损伤值: {{ overviewData.avgDamage }}</td>
              <td>损伤个数：{{ overviewData.damageCount }}</td>
            </tr>
            <tr>
              <td>当日运行里程: {{ overviewData.runningDistance }} km</td>
              <td>当日运行时长: {{ overviewData.runningTime }} h</td>
            </tr>
            <tr>
              <td>是否报警：否</td>
              <td>责任人: {{ overviewData.contactPerson }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="gifWrap">
        <img :src="imgSrc" alt="" />
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { eventBus } from "@ai-zen/event-bus";
import BarAnimation from "../../common/BarAnimation.vue";
import { getItem } from "../../../api";
import * as $ from "../../../utils/jquery.min.js";
import signalr from "../../../utils/jquery.signalR-2.4.0.min.js";
import hubs from "../../../utils/hubs";
export default {
  name: "CablewayOverview",
  components: {
    BarAnimation,
  },
  data() {
    return {
      // signlar对象
      signalrInstance: null,
      overviewData: {},
      percentData: 1,
      // 动图地址
      imgSrc: require("../../../assets/image/clockstop.gif"),
      // 运行状态
      workState: "",
      // 是否显示实时风险
      isShow: true,
    };
  },
  created() {
    let index = -1;
    setInterval(() => {
      if (index == 3) {
        index = -1;
      }
      index++;
      if (index == 0) {
        this.imgSrc = require("../../../assets/image/clockstop.gif");
      }
      if (index == 1) {
        this.imgSrc = require("../../../assets/image/anticlockwise.gif");
      }
      if (index == 3) {
        this.imgSrc = require("../../../assets/image/clockwise.gif");
      }
    }, 2000);
  },
  mounted() {
    this.initSignlarConnection();
    this.watchResize();
    window.addEventListener("resize", this.watchResize);
    // 如果从监控概览跳转而来，那么请求数据
    if (JSON.stringify(getItem("equipData")) != "{}") {
      let { projectCode, equipmentCode } = getItem("equipData");
      this.getOverviewData(projectCode, equipmentCode);
    }
  },
  unmounted() {
    window.removeEventListener("resize", this.watchResize);
  },
  methods: {
    // 请求概览数据
    async getOverviewData(projectCode, equipmentCode) {
      const res = await this.$http.post(this.$urlObj.queryRealtimeOverview, {
        userCode: getItem("userData").userCode,
        projectCode,
        equipmentCode,
      });
      if (res.status == 200 && res.data.resultCode == "0000") {
        this.overviewData = res.data.data;
      }
    },
    // 风险程度中文描述
    translateZh(status) {
      let str = "";
      switch (status) {
        case 0:
          str = "健康";
          break;
        case 1:
          str = "轻度";
          break;
        case 2:
          str = "中度";
          break;
        case 3:
          str = "重度";
          break;
        case 4:
          str = "超限";
          break;
      }
      return str;
    },
    // 工作状态中文描述
    workingZh(status) {
      let str = "";
      switch (status) {
        case 1:
          str = "离线";
          break;
        case 2:
          str = "工作";
          break;
        case 3:
          str = "待机";
          break;
        case 4:
          str = "停用";
          break;
        case 5:
          str = "故障";
          break;
        case 6:
          str = "报警";
          break;
      }
      return str;
    },
    // 实例化signlar
    initSignlarConnection() {
      $.connection.hub.url = "http://47.100.48.219:8090/signalr/hubs";
      this.signalrInstance = $.connection.ProbeConfigWSSHub;
      // 绑定编码器事件
      this.signalrInstance.client.bindIoTEncode = (
        equipmentCode,
        serial,
        user,
        direction,
        isMoving
      ) => {
        this.getEncodeDirection(equipmentCode, direction, isMoving);
      };
      // 绑定损伤值事件
      this.signalrInstance.client.ioT01BBindAlarmData = (
        equipmentCode,
        SerialAndID,
        result
      ) => {
        this.getAlarmData(SerialAndID, result);
      };
      // 实例化后，连接signlar
      this.connectSignlar();
    },
    getEncodeDirection(equipmentCode, direction, isMoving) {
      if (isMoving == 0) {
        this.workState = "停止";
        this.imgSrc = require("../../../assets/image/clockstop.gif");
      }
      if (isMoving != 0 && direction == 0) {
        this.workState = "逆时针";
        this.imgSrc = require("../../../assets/image/anticlockwise.gif");
      }
      if (isMoving != 0 && direction == 1) {
        this.workState = "顺时针";
        this.imgSrc = require("../../../assets/image/clockwise.gif");
      }
    },
    getAlarmData(SerialAndID, result) {
      this.percentData = result / 10;
    },
    // 连接signlar
    connectSignlar() {
      $.connection.hub
        .start()
        .done(() => {
          // // 参数不为空对象执行的操作
          // if (JSON.stringify(getItem("equipData")) != "null") {
          //   // 获取从监控概览页面传递过来的设备编码
          //   copyThis.monitorToDetailEquipCode = getItem(
          //     "equipData"
          //   ).equipmentCode;
          //   // 注册设备
          //   copyThis.probeCommercialConnection.server.registerEquipment(
          //     copyThis.monitorToDetailEquipCode
          //   );
          //   copyThis.previousEquipCode = copyThis.monitorToDetailEquipCode;
          //   copyThis.currentEquipCode = copyThis.monitorToDetailEquipCode;
          // }
          // // 初始化时，如果设备编码不为 '' 那么注册设备
          // if (copyThis.currentEquipCode !== "") {
          //   copyThis.probeCommercialConnection.server.registerEquipment(
          //     copyThis.currentEquipCode
          //   );
          // }
        })
        .fail(function() {
          console.log("连接失败");
        });
    },
    // 监听窗口大小事件
    watchResize() {
      if (document.body.clientWidth < 900) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    // 提供给父组件调用，重新渲染页面
    handleAgainRender(data) {
      this.getOverviewData(data.currentProjectCode, data.currentEquipCode);
      // 注册设备
      this.signalrInstance.server.registerEquipment(data.currentEquipCode);
    },
  },
};
</script>

<style lang="scss" scoped>
.cablewayOverview {
  width: 100%;
  height: 100%;

  color: #fff;
  padding-top: 18px;
  background: url("../../../assets/image/suodaobj.png") no-repeat;
  background-size: 69.588744% 50%;
  background-position: bottom center;
  background-color: #1c1f30;
  .overviewTitle {
    margin-left: 2.45%;
    font-size: 18px;
    font-weight: 800;
  }
  .tableWrap {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 28px;
    table {
      width: 94.372294%;
      border-left: 1px solid #292b3d;
      border-top: 1px solid #292b3d;
      tr {
        td {
          border-bottom: 1px solid #292b3d;
          border-right: 1px solid #292b3d;
          height: 44px;
          padding-left: 4px;
          box-sizing: border-box;
        }
      }
    }
    .big {
      width: 100%;
      .barAnimationWrap {
        position: absolute;
        right: 30%;
        width: 40%;
        height: 100%;
        top: 0;
      }
      @media screen and (min-width: 900px) {
        .barAnimationWrap {
          right: 10%;
        }
      }
      @media screen and (min-width: 1200px) {
        .barAnimationWrap {
          right: 0;
          width: 32%;
        }
      }
      @media screen and (min-width: 1768px) {
        .barAnimationWrap {
          width: 40%;
          right: 10%;
        }
      }
    }

    .small {
      width: 100%;
      .barAnimationWrap {
        position: absolute;
        width: 50%;
        right: 10%;
        height: 100%;
        top: 0;
      }
      @media screen and (min-width: 768px) {
        .barAnimationWrap {
          right: 18%;
        }
      }
    }
  }
  .gifWrap {
    width: 100%;
    height: 51.961%;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      max-height: 100%;
    }
  }
}
</style>
