<template>
  <div class="lineMainWrap">
    <div class="top">
      <div class="lineRootWrapTop"></div>
      <div class="tabCutTop">
        <div
          class="perTop commonTop"
          :class="{ activeStyle: isActiveTop }"
          @click="toValue()"
        >
          平均损伤值(%)
        </div>
        <div
          class="numTop commonTop"
          :class="{ activeStyle: !isActiveTop }"
          @click="toNum()"
        >
          平均损伤个数(个)
        </div>
      </div>
    </div>
    <div class="down">
      <div class="lineRootWrapDown"></div>
      <div class="tabCutDown">
        <div
          class="perDown commonDown"
          :class="{ activeStyle: isActiveDown }"
          @click="toMileage()"
        >
          平均运行里程(km)
        </div>
        <div
          class="numDown commonDown"
          :class="{ activeStyle: !isActiveDown }"
          @click="toTime()"
        >
          平均运行时间(h)
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
import { getItem } from "../../api/index";
export default {
  name: "LineChart",
  data() {
    return {
      // 图形的所有数据(平均损伤值和个数，平均运行时间和里程)
      damageAndWorkData: {},
      // 组件初始化时备份图形的所有数据，当用户点击“全部项目”时不用再发请求，直接使用即可
      damageAndWorkDataBack: {},
      // 平均损伤值和平均损伤个数的数据配置
      damageOption: {},
      // 运行里程和运行时间的数据配置
      workingOption: {},
      // 上方图形tab切换开关
      isActiveTop: true,
      // 下方图形tab切换开关
      isActiveDown: true,
      // 上图的容器
      // lineChart,
      // 下图的容器
      lineChartDown: null,
    };
  },
  async created() {
    let date1 = new Date();
    let date2 = new Date(date1);
    date2.setDate(date1.getDate() - 30);
    let agoDay = `${date2.getFullYear()}-${
      date2.getMonth() + 1 < 10
        ? `0${date2.getMonth() + 1}`
        : date2.getMonth() + 1
    }-${date2.getDate()}`;
    //当前日期
    let nowDay = `${date1.getFullYear()}-${
      date1.getMonth() + 1 < 10
        ? `0${date1.getMonth() + 1}`
        : date1.getMonth() + 1
    }-${date1.getDate()}`;
    const { data: res } = await this.$http.post(this.$urlObj.queryReportInfo, {
      userCode: getItem("userData").userCode,
      startDate: agoDay,
      endDate: nowDay,
    });
    if (res.resultMessage === "Success") {
      for (let i = 0; i < res.data.length; i++) {
        this.damageAndWorkData = res.data;
        this.damageAndWorkDataBack = res.data;
      }
    }
  },
  watch: {
    damageAndWorkData() {
      this.$nextTick(() => {
        let damageValue = [];
        let goDistance = [];
        let xDate = [];
        for (let i = 0; i < this.damageAndWorkData.length - 1; i++) {
          damageValue.push(parseFloat(this.damageAndWorkData[i].avgDamage));
          goDistance.push(
            parseFloat(this.damageAndWorkData[i].avgRunningDistance)
          );
          xDate.push(this.damageAndWorkData[i].reportData.slice(-5));
        }
        this.damageOption = {
          xAxis: {
            name: "日期",
            nameTextStyle: {
              color: "#fff",
              align: "left",
            },
            type: "category",
            data: xDate,
            axisLabel: { interval: 3, color: "#d7d7d7" },
            nameLocation: "end",
            boundaryGap: false,
          },
          yAxis: {
            type: "value",
            axisLabel: {
              interval: 5,
              formatter: "{value} %",
              color: "#d7d7d7",
              fontSize: 14,
            },
            splitLine: {
              //分割线配置
              show: true,
              lineStyle: {
                color: "#292B3D",
              },
            },
          },
          grid: {
            bottom: "38px",
            right: "11%",
            left: "48px",
          },
          series: [
            {
              data: damageValue,
              type: "line",
              smooth: true,
              symbol: "none",
              color: "#0089ff",
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(0,137,255,0.3)",
                  },
                  {
                    offset: 1,
                    color: "rgba(28,31,48,0.3)",
                  },
                ]),
              },
            },
          ],
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: "none",
              },
              dataView: {
                show: false,
                readOnly: false,
              },
              magicType: {
                // type: ["line", "bar"]
              },
              // restore: {},
              // saveAsImage: {}
            },
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "line",
            },
          },
        };
        this.workingOption = {
          xAxis: {
            name: "日期",
            nameTextStyle: {
              color: "#fff",
            },
            type: "category",
            nameLocation: "end",
            data: xDate,
            axisLabel: { interval: 3, color: "#d7d7d7" },
            boundaryGap: false,
          },
          yAxis: {
            type: "value",
            axisLabel: {
              interval: 5,
              formatter: "{value} km",
              color: "#d7d7d7",
              fontSize: 14,
            },
            splitLine: {
              //分割线配置
              show: true,
              lineStyle: {
                color: "#292B3D",
              },
            },
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: "none",
              },
              dataView: {
                show: false,
                readOnly: false,
              },
              magicType: {
                // type: ["line", "bar"]
              },
              // restore: {},
              // saveAsImage: {}
            },
          },
          grid: {
            bottom: "38px",
            right: "11%",
            left: "58px",
          },
          series: [
            {
              data: goDistance,
              type: "line",
              smooth: true,
              symbol: "none",
              color: "#00cfff",
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: "rgba(0,207,255,0.3)",
                  },
                  {
                    offset: 1,
                    color: "rgba(28,31,48,0.3)",
                  },
                ]),
              },
            },
          ],
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "line",
            },
          },
        };
        this.damageEchart(this.damageOption);
        this.workingEchart(this.workingOption);
      });
    },
  },
  mounted() {
    let lineChart = document.getElementsByClassName("lineRootWrapTop")[0];
    let downChart = document.getElementsByClassName("lineRootWrapDown")[0];
    this.lineChartDown = echarts.init(downChart);
    this.lineChart = echarts.init(lineChart);
  },
  methods: {
    myResize() {
      this.lineChartDown.resize();
      this.lineChart.resize();
    },
    // 初始化平均损失值和平均损失个数图表
    damageEchart(damageOption) {
      // let lineWrap = document.getElementsByClassName("lineRootWrapTop")[0];
      // this.lineChart = echarts.init(lineWrap);
      damageOption && this.lineChart.setOption(damageOption);
    },
    // 初始化平均运行里程和平均运行时间图表
    workingEchart() {
      let workingWrap = document.getElementsByClassName("lineRootWrapDown")[0];
      let workChart = echarts.init(workingWrap);
      this.workingOption && workChart.setOption(this.workingOption);
    },
    // 将图标切换到平均损伤值
    toValue() {
      this.isActiveTop = true;
      let damageValue = [];
      for (let i = 0; i < this.damageAndWorkData.length - 1; i++) {
        damageValue.push(parseFloat(this.damageAndWorkData[i].avgDamage));
      }
      this.damageOption.series[0].data = damageValue;
      this.damageOption.yAxis.axisLabel.formatter = "{value} %";
      this.damageOption.grid.left = "48px";
      this.damageEchart(this.damageOption);
    },
    // 将图标切换到平均损伤个数
    toNum() {
      this.isActiveTop = false;
      let damageNum = [];
      for (let i = 0; i < this.damageAndWorkData.length - 1; i++) {
        damageNum.push(parseFloat(this.damageAndWorkData[i].avgDamageCount));
      }
      this.damageOption.series[0].data = damageNum;
      this.damageOption.yAxis.axisLabel.formatter = "{value}";
      this.damageOption.grid.left = "48px";
      this.damageEchart(this.damageOption);
    },
    // 将图标切换到平均运行里程
    toMileage() {
      this.isActiveDown = true;
      let workDistance = [];
      for (let i = 0; i < this.damageAndWorkData.length - 1; i++) {
        workDistance.push(
          parseFloat(this.damageAndWorkData[i].avgRunningDistance)
        );
      }
      this.workingOption.series[0].data = workDistance;
      this.workingOption.yAxis.axisLabel.formatter = "{value} km";
      this.workingOption.grid.left = "50px";
      this.workingEchart(this.workingOption);
    },
    //  将图标切换到平均运行时间
    toTime() {
      this.isActiveDown = false;
      let workTime = [];
      for (let i = 0; i < this.damageAndWorkData.length - 1; i++) {
        workTime.push(parseFloat(this.damageAndWorkData[i].avgRunningTime));
      }
      this.workingOption.series[0].data = workTime;
      this.workingOption.yAxis.axisLabel.formatter = "{value} h";
      this.workingOption.grid.left = "8%";
      this.workingEchart(this.workingOption);
    },
    // 获取当前所选项目的图形数据
    async getOneProjectLine(projectGroup) {
      let date1 = new Date();
      let date2 = new Date(date1);
      date2.setDate(date1.getDate() - 30);
      let agoDay = `${date2.getFullYear()}-${
        date2.getMonth() + 1 < 10
          ? `0${date2.getMonth() + 1}`
          : date2.getMonth() + 1
      }-${date2.getDate()}`;
      //当前日期
      let nowDay = `${date1.getFullYear()}-${
        date1.getMonth() + 1 < 10
          ? `0${date1.getMonth() + 1}`
          : date1.getMonth() + 1
      }-${date1.getDate()}`;
      const { data: res } = await this.$http.post(
        this.$urlObj.queryReportInfo,
        {
          userCode: getItem("userData").userCode,
          projectCode: projectGroup.projectCode,
          startDate: agoDay,
          endDate: nowDay,
        }
      );
      if (res.resultMessage === "Success") {
        this.isActiveTop = true;
        this.isActiveDown = true;
        this.damageAndWorkData = res.data;
      }
    },
    // 获取所有项目的图形数据
    async getAllProjectLine() {
      this.isActiveTop = true;
      this.isActiveDown = true;
      this.damageAndWorkData = this.damageAndWorkDataBack;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-row {
  width: 100%;
  height: 100%;
  .el-col {
    width: 100%;
    height: 100%;
  }
}
.lineMainWrap {
  position: relative;
  height: 100%;
  .top {
    border-bottom: 1px solid #393c51;
    box-sizing: border-box;
  }
  .lineRootWrapTop {
    height: 100%;
  }
  .down {
    position: relative;
    width: 100%;
    height: 50%;
    .lineRootWrapDown {
      height: 100%;
    }
    .tabCutDown {
      position: absolute;
      left: 0;
      top: 0;
      .perDown {
        float: left;
      }
      .numDown {
        border-top: 3px solid #1c1f30;
      }
      .commonDown {
        float: left;
        text-align: left;
        padding-left: 18px;
        box-sizing: border-box;
        line-height: 30px;
        height: 30px;
        cursor: pointer;
        color: #d8d8d8;
      }
    }
    .xNameDown {
      position: absolute;
      right: 25px;
      bottom: 19px;
      font-size: 12px;
    }
  }
  .top {
    position: relative;
    width: 100%;
    height: 50%;
    .tabCutTop {
      position: absolute;
      left: 0;
      top: 0;
      .perTop {
        border-top: 5px solid #1c1f30;
      }
      .numTop {
        border-top: 3px solid #1c1f30;
      }
      .commonTop {
        height: 30px;
        float: left;
        padding-left: 18px;
        text-align: left;
        box-sizing: border-box;
        line-height: 30px;
        cursor: pointer;
        color: #d8d8d8;
      }
    }
    .xNameTop {
      position: absolute;
      right: 25px;
      bottom: 19px;
      font-size: 12px;
    }
  }
  .changeBigger {
    width: 22px;
    height: 22px;
    position: absolute;
    right: 20px;
    top: 20px;
    font-size: 24px;
    color: #555c7e;
    cursor: pointer;
  }
  .activeStyle {
    border-top: 3px solid #3158ff !important;
    color: #3158ff !important;
  }
}
</style>
