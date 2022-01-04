<template>
  <el-row justify="start">
    <el-col :span="24">
      <!-- 左边开始 -->
      <div class="left">
        <div class="title">
          <h4>实时监测概览</h4>
        </div>
        <div class="table">
          <table cellspacing="0">
            <thead class="thead">
              <tr>
                <th colspan="2">
                  {{
                    typeof equipDetailInfo.projectName == undefined
                      ? ""
                      : equipDetailInfo.projectName
                  }}
                </th>
              </tr>
            </thead>
            <tbody class="tbody">
              <tr>
                <td>
                  设备:
                  {{
                    typeof equipDetailInfo.equipmentName == undefined
                      ? ""
                      : equipDetailInfo.equipmentName
                  }}
                </td>
                <td
                  v-if="
                    equipDetailInfo.workingStatus != undefined &&
                      equipDetailInfo.workingStatus == 1
                  "
                >
                  工作状态: 离线
                </td>
                <td
                  v-if="
                    equipDetailInfo.workingStatus != undefined &&
                      equipDetailInfo.workingStatus == 2
                  "
                >
                  工作状态: 工作
                </td>
                <td
                  v-if="
                    equipDetailInfo.workingStatus != undefined &&
                      equipDetailInfo.workingStatus == 3
                  "
                >
                  工作状态: 待机
                </td>
                <td
                  v-if="
                    equipDetailInfo.workingStatus != undefined &&
                      equipDetailInfo.workingStatus == 4
                  "
                >
                  工作状态: 停用
                </td>
                <td
                  v-if="
                    equipDetailInfo.workingStatus != undefined &&
                      equipDetailInfo.workingStatus == 5
                  "
                >
                  工作状态: 故障
                </td>
                <td
                  v-if="
                    equipDetailInfo.workingStatus != undefined &&
                      equipDetailInfo.workingStatus == 6
                  "
                >
                  工作状态: 报警
                </td>
                <td v-if="equipDetailInfo.workingStatus == undefined">
                  工作状态:
                </td>
              </tr>
              <tr>
                <td>识别码序列号: {{ equipDetailInfo.serials }}</td>
                <td>安装地址: {{ equipDetailInfo.installLocation }}</td>
              </tr>
              <tr>
                <td>安装时间：{{ equipDetailInfo.installDate }}</td>
                <td>到期时间：{{ equipDetailInfo.validTime }}</td>
              </tr>
              <tr>
                <td v-if="equipDetailInfo.riskLevel == 0">风险程度: 健康</td>
                <td v-else-if="equipDetailInfo.riskLevel == 1">
                  风险程度: 轻度
                </td>
                <td v-else-if="equipDetailInfo.riskLevel == 2">
                  风险程度: 中度
                </td>
                <td v-else-if="equipDetailInfo.riskLevel == 3">
                  风险程度: 重度
                </td>
                <td v-else-if="equipDetailInfo.riskLevel == 4">
                  风险程度: 超限
                </td>
                <td v-else>风险程度:</td>
                <td>报警：否</td>
              </tr>
              <tr>
                <td>
                  平均损伤值:
                  {{
                    typeof equipDetailInfo.avgDamage == "undefined"
                      ? ""
                      : equipDetailInfo.avgDamage
                  }}
                </td>
                <td>
                  损伤个数:
                  {{
                    typeof equipDetailInfo.damageCount == "undefined"
                      ? ""
                      : equipDetailInfo.damageCount + "个"
                  }}
                </td>
              </tr>
              <tr>
                <td>
                  当日运行时长:
                  {{
                    typeof equipDetailInfo.runningTime == "undefined"
                      ? ""
                      : equipDetailInfo.runningTime + "小时"
                  }}
                </td>
                <td>
                  当日监测里程:
                  {{
                    typeof equipDetailInfo.runningDistance == "undefined"
                      ? ""
                      : equipDetailInfo.runningDistance + "km"
                  }}
                </td>
              </tr>
              <tr>
                <!-- <td colspan="2">风险损伤位置: {{typeof(equipDetailInfo.damageLocation) == 'undefined'?'': equipDetailInfo.damageLocation+ 'cm'}}</td> -->
                <td>
                  风险损伤位置:
                  {{
                    typeof equipDetailInfo.damageLocation == "undefined"
                      ? ""
                      : equipDetailInfo.damageLocation + "cm"
                  }}
                </td>
                <td>运行状态：{{ workState }}</td>
              </tr>
              <tr style="color: #0099ff">
                <td colspan="2">
                  责任人:
                  {{
                    typeof equipDetailInfo.contactPerson == "undefined"
                      ? ""
                      : equipDetailInfo.contactPerson
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <!-- 左边结束 -->

      <!-- 右边开始 -->
      <div class="right">
        <div class="top">
          <div class="chart"></div>
        </div>
        <div class="splitLine"></div>
        <div class="down">
          <div class="stateChart">
            <img :src="imgSrc" alt="" />
          </div>
        </div>
      </div>
      <!-- 右边结束 -->
    </el-col>
  </el-row>
</template>

<script>
import { getItem } from "../../api/index";
import * as echarts from "echarts";
import { eventBus } from "@ai-zen/event-bus";
import * as $ from "../../utils/jquery.min.js";
import signalr from "../../utils/jquery.signalR-2.4.0.min.js";
import hubs from "../../utils/hubs";
const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj);
export default {
  name: "Overview",
  inject: ["reload"],
  data() {
    return {
      // 当前设备的设备编号
      currentEquipCode: "",
      // 当前设备所属项目的项目编码
      currentProjectCode: "",
      // 钢丝绳运行方向图的url
      imgSrc: require("../../assets/image/stop.gif"),
      // 仪表板分三段
      damageValue: { lower: 7, middle: 5, heavy: 2 },
      // 三种分险比例
      riskRatio: { lower: 1, middle: 0, heavy: 0 },
      // 仪表盘容器
      chartContainer: null,
      // 仪表盘设置数据
      boardDataOption: {},
      //
      probeCommercialConnection: null,
      // 上一个设备的设备编码
      previousEquipCode: "",
      // 监控概览页面传递过来的设备编码
      monitorToDetailEquipCode: "",
      // 设备详细信息
      equipDetailInfo: {},
      // 设备运行状态
      workState: "",
    };
  },
  created() {
    // 获取设备的详细信息
    this.getEquipDetailInfo();
    // 拷贝this,方便回调函数访问this中的变量和方法
    let copyThis = this;
    $.connection.hub.logging = true;
    $.connection.hub.url = "http://47.100.48.219:8090/signalr/hubs";
    this.probeCommercialConnection = $.connection.ProbeConfigWSSHub;
    // 注册绑定编码器的方法
    this.probeCommercialConnection.client.bindIoTEncode = function(
      equipmentCode,
      serial,
      user,
      direction,
      isMoving
    ) {
      copyThis.bindEncodeDirection(equipmentCode, direction, isMoving);
    };
    this.probeCommercialConnection.client.ioT01BBindAlarmData = function(
      equipmentCode,
      SerialAndID,
      result
    ) {
      copyThis.updateCircularGraph(equipmentCode, SerialAndID, result);
    };
    $.connection.hub
      .start()
      .done(function() {
        // 参数不为空对象执行的操作
        if (JSON.stringify(getItem("equipData")) != "null") {
          // 获取从监控概览页面传递过来的设备编码
          copyThis.monitorToDetailEquipCode = getItem(
            "equipData"
          ).equipmentCode;
          // 注册设备
          copyThis.probeCommercialConnection.server.registerEquipment(
            copyThis.monitorToDetailEquipCode
          );
          copyThis.previousEquipCode = copyThis.monitorToDetailEquipCode;
          copyThis.currentEquipCode = copyThis.monitorToDetailEquipCode;
        }
        // 初始化时，如果设备编码不为 '' 那么注册设备
        if (copyThis.currentEquipCode !== "") {
          copyThis.probeCommercialConnection.server.registerEquipment(
            copyThis.currentEquipCode
          );
        }
      })
      .fail(function() {
        console.log("连接失败");
      });

    $.connection.hub.disconnected(function() {
      $.connection.hub.start().done(function() {
        copyThis.probeCommercialConnection.server.registerEquipment(
          copyThis.currentEquipCode
        );
      });
    });
    // 监听兄弟组件search注册的事件，获取兄弟组件传过来的数据（设备编码）
    eventBus.on("queryEquipInfo", (data) => {
      this.monitorToDetailEquipCode = "";
      this.currentEquipCode = data.currentEquipCode;
      this.currentProjectCode = data.currentProjectCode;
      this.currentEquipInfo(this.currentEquipCode, this.currentProjectCode);

      if (this.previousEquipCode !== "") {
        // 点击查询后，注销上一个设备
        this.probeCommercialConnection.server.deregisterEquipment(
          this.previousEquipCode
        );
        this.previousEquipCode = data.currentEquipCode;
        if (this.chartContainer) {
          this.chartContainer.dispose();
        }

        let container = document.getElementsByClassName("chart")[0];
        setTimeout(() => {
          if (container) {
            this.chartContainer = echarts.init(container);
            this.boardDataOption.series[0].endAngle = -180;
            // 初始化仪表盘状态
            unwarp(this.chartContainer).setOption(this.boardDataOption);
          }
        }, 50);
        this.probeCommercialConnection.server.registerEquipment(
          this.currentEquipCode
        );
        // 初始化设备工作状态
        this.workState = "";
        // 初始化工作状态图
        this.imgSrc = require("../../assets/image/stop.gif");
      } else {
        // 点击查询后，注册新设备
        this.probeCommercialConnection.server.registerEquipment(
          this.currentEquipCode
        );
        // 初始化设备工作状态
        this.workState = "";
        // 初始化工作状态图
        this.imgSrc = require("../../assets/image/stop.gif");
        // 初始化仪表盘状态
        this.boardDataOption.series[0].endAngle = -180;
        unwarp(this.chartContainer).setOption(this.boardDataOption);
        this.previousEquipCode = data.currentEquipCode;
      }
    });
  },
  mounted() {
    // 初始化仪表盘数据
    this.boardDataOption = this.getOptions();
    let container = document.getElementsByClassName("chart")[0];
    this.chartContainer = echarts.init(container);
    this.boardDataOption &&
      unwarp(this.chartContainer).setOption(this.boardDataOption);
    // window.addEventListener('resize', function() {
    //   // 监听窗口缩放事件，将echarts图自适应
    //   copyThis.chartContainer.resize();
    // })
  },
  watch: {
    boardDataOption: {
      handler: function() {
        this.$nextTick(() => {
          this.boardDataOption &&
            unwarp(this.chartContainer).setOption(this.boardDataOption);
        });
      },
      deep: true,
    },
  },
  methods: {
    myResize() {
      this.chartContainer.resize();
    },
    // 绑定编码器方向的函数，用来指定钢丝绳方向
    bindEncodeDirection(equipmentCode, direction, isMoving) {
      if (isMoving == 0) {
        this.workState = "停止";
        this.imgSrc = require("../../assets/image/stop.gif");
      }
      if (isMoving != 0 && direction == 0) {
        this.workState = "下降";
        this.imgSrc = require("../../assets/image/drop.gif");
      }
      if (isMoving != 0 && direction == 1) {
        this.workState = "上升";
        this.imgSrc = require("../../assets/image/rise.gif");
      }
    },
    // 更新概览环形图
    updateCircularGraph(equipmentCode, SerialAndID, data) {
      // 更新颜色
      this.updateColor(data / 10);

      this.boardDataOption &&
        unwarp(this.chartContainer).setOption(this.boardDataOption);
    },

    // 更新颜色
    updateColor(damageValue) {
      let endAngle = -280;
      if (damageValue <= 3) {
        endAngle = -180 - (damageValue / 3) * 90;
        this.boardDataOption.series[0].endAngle = endAngle;
        this.boardDataOption.series[0].axisLine.lineStyle.color = [
          [
            1,
            new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 1,
                color: "#35C78C",
              },
            ]),
          ],
        ];
      } else if (damageValue > 3 && damageValue < this.damageValue.lower) {
        endAngle = -270 - ((damageValue - 3) / 4) * 10;
        this.boardDataOption.series[0].endAngle = endAngle;
        this.boardDataOption.series[0].axisLine.lineStyle.color = [
          [
            1,
            new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 1,
                color: "#35C78C",
              },
            ]),
          ],
        ];
      } else if (damageValue >= 7 && damageValue < 12) {
        endAngle =
          endAngle - ((damageValue - 7) / this.damageValue.middle) * 60;
        this.riskRatio.lower = 100 / (100 + ((damageValue - 7) / 5) * 60);
        this.riskRatio.middle = 1;
        this.boardDataOption.series[0].endAngle = endAngle;
        this.boardDataOption.series[0].axisLine.lineStyle.color = [
          [
            1,
            new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: this.riskRatio.lower,
                color: "#35C78C",
              },
              {
                offset: this.riskRatio.middle,
                color: "#F8DE42",
              },
            ]),
          ],
        ];
      } else {
        endAngle = -340 - ((damageValue - 12) / 88) * 20;
        this.riskRatio.lower = 100 / (160 + ((damageValue - 12) / 88) * 20);
        this.riskRatio.middle = 160 / (160 + ((damageValue - 12) / 88) * 20);
        this.riskRatio.heavy = 1;
        this.boardDataOption.series[0].endAngle = endAngle;
        this.boardDataOption.series[0].axisLine.lineStyle.color = [
          [
            1,
            new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: this.riskRatio.lower,
                color: "#35C78C",
              },
              {
                offset: this.riskRatio.middle,
                color: "#F8DE42",
              },
              {
                offset: this.riskRatio.heavy,
                color: "#F54B36",
              },
            ]),
          ],
        ];
      }
    },

    // 初始化仪表盘数据
    getOptions() {
      return {
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            z: 3,
            type: "gauge",
            axisLabel: false,
            detail: {
              formatter: "{value}",
            },
            splitLine: {
              show: false,
            },
            data: [
              {
                value: 50,
                detail: {
                  show: false,
                },
              },
            ],
            center: ["50%", "70%"],
            radius: "100%",
            startAngle: -180,
            splitNumber: 10,
            endAngle: -180,
            clockwise: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: [
                  [
                    1,
                    new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                      {
                        offset: 0.5,
                        color: "#35C78C",
                      },
                    ]),
                  ],
                ],
                width: 35,
              },
            },
            pointer: {
              show: false,
              length: "80%",
              width: 10,
              offsetCenter: ["0", "-20"],
              itemStyle: {
                color: "#fff",
              },
            },
            progress: {
              show: false,
              width: true,
            },
            axisTick: {
              show: false,
              splitNumber: 0,
              distance: 0,
            },
          },
          {
            z: 1,
            type: "gauge",
            axisLabel: false,
            detail: {
              formatter: "{value}",
            },
            splitLine: {
              show: false,
            },
            data: [
              {
                value: 60,
                detail: {
                  show: false,
                },
              },
            ],
            center: ["50%", "70%"],
            radius: "100%",
            startAngle: -180,
            splitNumber: 10,
            endAngle: -360,
            clockwise: true,
            axisLine: {
              show: true,
              lineStyle: {
                width: 35,
                color: [[1, "#393c51"]],
              },
            },
            pointer: {
              show: false,
              length: "80%",
              width: 10,
              offsetCenter: ["0", "-20"],
              itemStyle: {
                color: "#fff",
              },
            },
            progress: {
              show: false,
              width: true,
            },
            axisTick: {
              show: false,
              splitNumber: 0,
              distance: 0,
            },
          },
        ],
      };
    },

    // 获取从全局概览页面跳转来的设备的详细概览信息
    getEquipDetailInfo() {
      if (getItem("equipData")) {
        let equipmentCode = getItem("equipData").equipmentCode;
        let projectCode = getItem("equipData").projectCode;
        this.getEquipInfo(equipmentCode, projectCode);
      }
    },

    // 获取当前设备的详细概览信息
    currentEquipInfo(currentEquipCode, currentProjectCode) {
      this.getEquipInfo(currentEquipCode, currentProjectCode);
    },

    // 获取设备信息的方法
    async getEquipInfo(equipmentCode, projectCode) {
      const res = await this.$http.post(this.$urlObj.queryRealtimeOverview, {
        userCode: getItem("userData").userCode,
        projectCode: projectCode,
        equipmentCode: equipmentCode,
      });
      if (res.status === 200 && res.data.resultCode == "0000") {
        this.equipDetailInfo = res.data.data;
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
  // min-width: 330px;
  .el-col {
    height: 100%;
    width: 100%;
  }
  .left {
    width: 100%;
    height: 62.34375%;
    padding-top: 18px;
    box-sizing: border-box;
    .title {
      margin-left: 7px;
      color: #ffffff;
      h4 {
        font-size: 18px;
      }
    }
    .table {
      width: 100%;
      height: 318px;
      table {
        width: 100%;
        height: 100%;
        padding-top: 35px;
      }
      .thead {
        background-color: #292b3d;
        height: 46px;
        width: 100%;
        tr {
          width: 100%;
          height: 46px;
          th {
            width: 50%;
            height: 46px;
            color: #fefefe;
          }
        }
      }
      @media screen and (min-width: 1200px) {
        .thead {
          height: 30px;
          tr {
            height: 30px;
            th {
              height: 30px;
            }
          }
        }
      }

      .tbody {
        font-size: 16px;
        td {
          padding-left: 2%;
        }
      }

      .tbody {
        background-color: #1c1f30;
        color: #fefefe;
        tr {
          width: 100%;
          td {
            width: 50%;
            border-right: 1px solid #292b3d;
            border-bottom: 1px solid #292b3d;
          }
          @media screen and (min-width: 1200px) {
            td {
              height: 30px;
            }
          }
          td:nth-child(1) {
            border-left: 1px solid #292b3d;
          }
        }
      }
    }
  }
  @media screen and (min-width: 1200px) {
    .left {
      height: 100%;
      width: 63.88888%;
      float: left;
      position: relative;
      .table {
        height: 65.88235%;
        width: 95.58695%;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        table {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
    .splitLine {
      display: none;
    }
  }
  .right {
    width: 100%;
    height: 37.65625%;
    box-sizing: border-box;
    position: relative;
    .top {
      width: 50%;
      height: 100%;
      background-color: #1c1f30;
      box-sizing: border-box;
      float: left;
      display: flex;
      justify-content: center;
      align-items: center;
      .chart {
        width: 80%;
        height: 80%;
      }
    }
    .splitLine {
      width: 1px;
      height: 122px;
      background-color: #393c51;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .down {
      width: 50%;
      height: 100%;
      position: relative;
      float: left;
      .stateChart {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      img {
        display: inline-block;
        height: auto;
        // max-width: 80%;
        max-width: 191px;
      }
    }
  }
  @media screen and (min-width: 1200px) {
    .right {
      width: 36.11112%;
      float: left;
      height: 100%;
      border-left: 1px solid #393c51;
      .top {
        height: 50%;
        width: 100%;
        border-bottom: 1px solid #393c51;
      }
      .down {
        width: 100%;
        height: 50%;
        img {
          max-height: 120px;
        }
      }
    }
  }
}
</style>
