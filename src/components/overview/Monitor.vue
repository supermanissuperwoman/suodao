<template>
  <el-row>
    <el-col v-if="isShow">
      <div class="left">
        <div class="title">实时监控概览</div>
        <div class="descripe">
          <div
            class="projectName"
            :title="
              typeof singleEquip.projectName == undefined
                ? singleEquip.projectName
                : ''
            "
          >
            项目:
            <span>{{
              singleEquip.projectName ? singleEquip.projectName : ""
            }}</span>
          </div>
          <div class="equipName">
            设备:
            <span>{{
              singleEquip.equipmentName ? singleEquip.equipmentName : ""
            }}</span>
          </div>
          <div class="workState">
            运行状态: <span>{{ workState }}</span>
          </div>
        </div>
        <div class="image">
          <img :src="imgSrc" alt="" />
        </div>
      </div>
      <div class="right">
        <div id="board"></div>
        <span
          class="rightIcon el-icon-arrow-right"
          @click="toDetail(singleEquip)"
        ></span>
      </div>
    </el-col>
    <el-col v-if="!isShow" class="suodao">
      <div class="suodaoTitle">实时监控概览</div>
      <span
        class="rightIcon el-icon-arrow-right"
        @click="toDetail(singleEquip)"
      ></span>
      <div class="descrip">
        <span>{{ singleEquip.projectName }}</span>
        <span>设备：{{ singleEquip.equipmentName }}</span>
        <span>运行状态：{{ workState }}</span>
      </div>
      <div class="content">
        <div class="contentLeft">
          <img src="../../assets/image/suodaogif.png" alt="" />
          <span>索道运行图</span>
        </div>
        <div class="contentRight">
          <div class="barWrap">
            <bar-animation
              :topHeight="'16'"
              :percentData="damageEchartValue"
            ></bar-animation>
          </div>
          <span>实时风险</span>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import * as echarts from "echarts";
import { getItem, setItem } from "../../api/index";
import * as $ from "../../utils/jquery.min.js";
import signalr from "../../utils/jquery.signalR-2.4.0.min.js";
import hubs from "../../utils/hubs";
import BarAnimation from "../common/BarAnimation.vue";
export default {
  name: "MonitorOverview",
  components: {
    BarAnimation,
  },
  data() {
    return {
      // 监控概览数据
      monitorData: {},
      // 仪表盘设置数据
      boardDataOption: {
        tooltip: {
          trigger: "item",
        },
        legend: {
          top: "5%",
          left: "center",
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
            center: ["50%", "55%"],
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
                        offset: 1,
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
            center: ["50%", "55%"],
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
      },
      // 当前账户下的所有设备信息
      equipGroup: [],
      // 单个设备的设备信息
      singleEquip: {},
      // 图片src地址
      imgSrc: require("../../assets/image/stop.gif"),
      // 运行状态标志
      workState: "",
      probeCommercialConnection: null,
      // 仪表盘容器
      boardEchartInit: null,
      // 定时选择某个设备的定时器
      selectEquipTimer: null,
      // 仪表板分三段
      damageValue: { lower: 7, middle: 5, heavy: 2 },
      // 三种分险比例
      riskRatio: { lower: 1, middle: 0, heavy: 0 },
      // 设备注册标志
      register: false,
      // 工作中的设备
      workEquipGroup: [],
      //
      isShow: true,
      // 损伤值
      damageEchartValue: 0,
    };
  },
  async created() {
    this.boardDataOption = {
      tooltip: { trigger: "item" },
      legend: { top: "5%", left: "center" },
      series: [
        {
          z: 2,
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
          center: ["50%", "65%"],
          radius: "110%",
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
                      offset: 1,
                      color: "#35C78C",
                    },
                  ]),
                ],
              ],
              width: 25,
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
          center: ["50%", "65%"],
          radius: "110%",
          startAngle: -180,
          splitNumber: 10,
          endAngle: -360,
          clockwise: true,
          axisLine: {
            show: true,
            lineStyle: {
              width: 25,
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
      media: [
        {
          query: { minWidth: 131 },
          option: {
            series: [
              {
                radius: "90%",
                center: ["50%", "75%"],
              },
              {
                radius: "90%",
                center: ["50%", "75%"],
              },
            ],
          },
        },
        {
          query: { minWidth: 304 },
          option: {
            series: [
              {
                radius: "150%",
                center: ["50%", "75%"],
              },
              {
                radius: "150%",
                center: ["50%", "75%"],
              },
            ],
          },
        },
        {
          option: {
            series: [
              {
                radius: "110%",
                center: ["50%", "65%"],
              },
              {
                radius: "110%",
                center: ["50%", "65%"],
              },
            ],
          },
        },
      ],
    };
    const { data: res } = await this.$http.post(this.$urlObj.queryEquip, {
      userCode: getItem("userData").userCode,
    });
    if (res.resultCode === "0000") {
      this.workEquipGroup = [];
      this.equipGroup = res.data;
      for (let i = 0; i < this.equipGroup.length; i++) {
        if (this.equipGroup[i].workingStatus === 2) {
          this.workEquipGroup.push(this.equipGroup[i]);
        }
      }
      this.workEquipGroup = this.workEquipGroup.slice(0, 2);
      if (this.workEquipGroup.length == 0) {
        this.singleEquip = this.equipGroup[
          this.randomNum(0, this.equipGroup.length - 1)
        ];
      } else {
        this.singleEquip = this.workEquipGroup[
          this.randomNum(0, this.workEquipGroup.length - 1)
        ];
      }
    } else {
      console.log("error");
    }
    // 复制this，在注册方法时，通过copyThis可以访问到methods中的方法
    let copyThis = this;
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
      copyThis.updateCircularGraph(SerialAndID, result);
    };
    $.connection.hub
      .start()
      .done(function() {
        if (copyThis.workEquipGroup.length == 0) {
          copyThis.singleEquip =
            copyThis.equipGroup[
              copyThis.randomNum(0, copyThis.equipGroup.length - 1)
            ];
          copyThis.workEquipGroup = copyThis.equipGroup;
        } else {
          copyThis.singleEquip =
            copyThis.workEquipGroup[
              copyThis.randomNum(0, copyThis.workEquipGroup.length - 1)
            ];
        }
        copyThis.probeCommercialConnection.server.registerEquipment(
          copyThis.singleEquip.equipmentCode
        );
        copyThis.register = true;
        if (copyThis.register) {
          copyThis.withEquiptypeToShow(copyThis.singleEquip);
          window.selectEquipTimer = setInterval(() => {
            // 注销前一个设备
            copyThis.probeCommercialConnection.server.deregisterEquipment(
              copyThis.singleEquip.equipmentCode
            );
            // 随机获取一个新设备
            copyThis.singleEquip =
              copyThis.workEquipGroup[
                copyThis.randomNum(0, copyThis.workEquipGroup.length - 1)
              ];
            copyThis.withEquiptypeToShow(copyThis.singleEquip);
            console.log(
              copyThis.boardEchartInit,
              copyThis.singleEquip.equipmentCode,
              copyThis.isShow
            );
            // 注册新设备
            copyThis.probeCommercialConnection.server.registerEquipment(
              copyThis.singleEquip.equipmentCode
            );
          }, 3000);
        }
      })
      .fail(function() {
        console.log("连接失败");
      });
    $.connection.hub.disconnected(function() {
      window.location.reload();
    });
  },
  watch: {
    boardDataOption: {
      handler() {
        this.$nextTick(() => {
          if (this.boardEchartInit) {
            this.boardDataOption &&
              this.boardEchartInit.setOption(this.boardDataOption);
          }
        });
      },
      deep: true,
    },
    // boardDataOption() {

    // },
    isShow: {
      handler() {
        this.$nextTick(() => {
          if (this.isShow) {
            this.boardDataOption &&
              this.boardEchartInit.setOption(this.boardDataOption);
          }
        });
      },
    },
  },
  mounted() {
    let boardDiv = document.getElementById("board");
    this.boardEchartInit = echarts.init(boardDiv);
    this.boardDataOption &&
      this.boardEchartInit.setOption(this.boardDataOption);
  },
  methods: {
    myResize() {
      this.boardEchartInit.resize();
    },
    // 获取最小值和最大值之间的随机整数的方法
    randomNum(minNum, maxNum) {
      switch (arguments.length) {
        case 1:
          return parseInt(Math.random() * minNum + 1, 10);
          break;
        case 2:
          return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
          break;
        default:
          return 0;
          break;
      }
    },
    boardEchart() {
      let boardDiv = document.getElementById("board");
      this.boardEchartInit = echarts.init(boardDiv);
      this.boardDataOption &&
        this.boardEchartInit.setOption(this.boardDataOption);
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
    updateCircularGraph(SerialAndID, data) {
      this.updateColor(data / 10);
      if (this.singleEquip.equipmentCode == "6049b1343c5539dc439fd96b") {
        this.damageEchartValue = data / 10;
        console.log(data, this.damageEchartValue);
      } else {
        this.boardDataOption &&
          this.boardEchartInit.setOption(this.boardDataOption);
      }
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
    // 跳转到当前设备的详情页
    toDetail(singleEquip) {
      setItem("equipData", singleEquip);
      this.$router.push({
        name: "detail",
        params: {
          equipCode: singleEquip.equipmentCode,
          projectName: singleEquip.projectName,
          projectCode: singleEquip.projectCode,
          equipmentName: singleEquip.equipmentName,
        },
      });
    },
    // 根据设备类型判断显示的内容
    withEquiptypeToShow(singleEquip) {
      if (singleEquip.equipmentCode == "6049b1343c5539dc439fd96b") {
        this.isShow = false;
        if (this.boardEchartInit != null) {
          this.boardEchartInit.dispose();
          this.boardEchartInit = null;
          console.log(this.boardEchartInit);
        }
      } else {
        this.isShow = true;
        // 切换设备时，初始化设备的工作状态
        this.workState = "";
        // 初始化 设备运行状态图
        this.imgSrc = require("../../assets/image/stop.gif");
        this.$nextTick(() => {
          let dom = document.getElementById("board");
          this.boardEchartInit = echarts.init(dom);
          // 初始化环形图
          this.boardDataOption.series[0].endAngle = -180;
          this.boardDataOption &&
            this.boardEchartInit.setOption(this.boardDataOption);
        });
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
    width: 100%;
    height: 100%;
  }
}
.left {
  height: 100%;
  width: 50.65%;
  border-right: 1px solid #393c51;
  box-sizing: border-box;
  position: relative;
  padding-left: 18px;
  padding-top: 3.815%;
  float: left;
  .title {
    font-size: 18px;
    line-height: 16px;
    font-weight: bold;
    color: #fff;
  }
  .descripe {
    margin-top: 8%;
    font-size: 14px;
    color: #fefefe;
    .projectName {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  @media screen and (min-width: 768px) {
    .descripe {
      margin-top: 5%;
    }
  }
  .image {
    width: 100%;
    height: 60%;
    position: absolute;
    bottom: 0;
    img {
      width: 75%;
      height: 50%;
      max-width: 155px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 10%;
    }
    @media screen and (min-width: 375px) {
      img {
        width: 68%;
        height: 70%;
        bottom: 10%;
      }
    }
    @media screen and (min-width: 768px) {
      img {
        width: 75%;
        height: 70%;
        bottom: 18%;
      }
    }
    @media screen and (min-width: 1200px) {
      img {
        width: 68%;
        height: 70%;
        bottom: 26%;
        left: 40%;
      }
    }
  }
}
@media screen and (min-width: 1200px) {
  .left {
    padding-top: 18px;
  }
}
.right {
  width: 49.35%;
  float: right;
  position: relative;
  height: 100%;
  #board {
    height: 50%;
    width: 100%;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    top: 60%;
  }
  .health {
    position: absolute;
    left: 27px;
    top: 230px;
    color: #fefefe;
    font-size: 14px;
  }
  .overrun {
    position: absolute;
    right: 25px;
    color: #fefefe;
    top: 230px;
    font-size: 14px;
  }
}
.equipName {
  padding-top: 4px;
}
.workState {
  padding-top: 4px;
}
.suodao {
  padding-left: 17px;
  padding-top: 18px;
  box-sizing: border-box;
  .suodaoTitle {
    color: #fff;
    font-weight: bold;
    font-size: 18px;
  }
  .descrip {
    width: 100%;
    color: #fff;
    display: flex;
    padding-top: 10px;
    justify-content: space-around;
  }
  .content {
    width: 100%;
    height: 70%;
    padding-top: 20px;
    color: #fff;
    display: flex;
    justify-content: flex-start;
    .contentLeft {
      width: 50%;
      position: relative;
      span {
        position: absolute;
        margin-top: 10px;
        bottom: 0;
      }
    }
    .contentRight {
      width: 50%;
      height: 100%;
      position: relative;
      display: flex;
      justify-content: center;
      .barWrap {
        width: 40%;
        position: relative;
        transform: rotate(90deg);
      }
      span {
        position: absolute;
        bottom: 0;
      }
    }
  }
}
.rightIcon {
  position: absolute;
  top: 20px;
  right: 20px;
  color: #555c7e;
  font-size: 24px;
  cursor: pointer;
}
</style>
