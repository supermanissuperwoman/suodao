<template>
  <el-row>
    <el-col style="height: 100%" :span="24">
      <div class="goDistanceWrap">
        <div class="title">
          <h4>当日运行里程</h4>
        </div>
        <div class="distanceContainer"></div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { eventBus } from "@ai-zen/event-bus";
import { getItem } from "../../api/index";
import * as echarts from "echarts";
const unwarp = (obj) => obj && (obj.__v_raw || obj.valueOf() || obj);
export default {
  name: "GoDistance",
  data() {
    return {
      // 图表数据
      chartOptions: {},
      // 图表容器
      chartContainer: null,
      // X轴坐标值
      xdata: [],
      // Y轴坐标值
      ydata: [],
      // 编码器行驶距离Y轴坐标值
      ydata2: [],
    };
  },
  created() {
    // 获取初始化图表数据
    this.chartOptions = this.getOptions();
    // 更新图表数据，当前设备的
    this.getOptionsData();
  },
  mounted() {
    let container = document.getElementsByClassName("distanceContainer")[0];
    this.chartContainer = echarts.init(container);
  },
  methods: {
    myResize() {
      this.chartContainer.resize();
    },
    // 图表初始化数据
    getOptions() {
      return {
        tooltip: {
          formatter: "",
          trigger: "item",
          // axisPointer: {
          //   type: "cross",
          //   crossStyle: {
          //     color: "#999",
          //   },
          // },
        },
        grid: {
          right: "55px",
          bottom: "32px",
          left: "50px",
          top: "12%",
        },
        legend: {
          data: ["监测里程", "运行里程"],
          right: "10%",
          itemWidth: 20,
          itemHeight: 5,
          textStyle: {
            color: "#fff",
          },
        },
        toolbox: {
          feature: {
            dataZoom: { show: true },
          },
        },
        xAxis: [
          {
            type: "category",
            name: "时间(h)",
            nameGap: 8,
            nameLocation: "end",
            axisLine: {
              show: false,
            },
            axisPointer: {
              type: "shadow",
            },
            axisLabel: {
              show: true,
              color: "#B9B9B9", //更改坐标轴文字颜色
            },
            nameTextStyle: {
              // padding: [0,0,0,650]
              color: "#fff",
            },
            axisTick: {
              show: false,
              alignWithLabel: true,
            },
            data: [
              "01:00",
              "02:00",
              "03:00",
              "04:00",
              "05:00",
              "06:00",
              "07:00",
              "08:00",
              "09:00",
              "10:00",
              "11:00",
              "12:00",
              "13:00",
              "14:00",
              "15:00",
              "16:00",
              "17:00",
              "18:00",
              "19:00",
              "20:00",
              "21:00",
              "22:00",
              "23:00",
              "24:00",
            ],
          },
        ],
        yAxis: [
          {
            type: "value",
            name: "里程(km)",
            min: 0,
            // max: 2,
            splitNumber: 10,
            position: "left",
            nameTextStyle: {
              color: "#fff",
            },
            splitLine: {
              //分割线配置
              show: true,
              lineStyle: {
                color: "#292B3D",
              },
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: "#B9B9B9",
              },
            },
            axisLabel: {
              formatter: "{value}km",
            },
          },
        ],
        series: [
          {
            name: "监测里程",
            type: "bar",
            data: this.ydata,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#83bff6" },
                { offset: 0.5, color: "#188df0" },
                { offset: 1, color: "#188df0" },
              ]),
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" },
                ]),
              },
            },
          },
          // 编码器行驶距离
          {
            name: "运行里程",
            type: "bar",
            data: this.ydata2,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#B994FF" },
                { offset: 0.5, color: "#6E41C5" },
                { offset: 1, color: "#6E41C5" },
              ]),
            },
            emphasis: {
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#6E41C5" },
                  { offset: 0.7, color: "#6E41C5" },
                  { offset: 1, color: "#B994FF" },
                ]),
              },
            },
          },
        ],
      };
    },

    // 获取从全局概览界面跳转过来的设备的图表数据
    async getOptionsData() {
      if (getItem("equipData")) {
        let equipmentCode = getItem("equipData").equipmentCode;
        // 请求数据
        this.getDistance(equipmentCode);
      }
    },

    // 点击查询后请求当前设备的图表数据
    currentEquipOptions(equipmentCode) {
      this.xdata = [];
      this.ydata = [];
      this.chartContainer.dispose();
      // 请求数据
      this.getDistance(equipmentCode);
    },

    // 请求设备运行里程的方法
    async getDistance(equipmentCode) {
      const res = await this.$http.post(this.$urlObj.queryEquipDistance, {
        userCode: getItem("userData").userCode,
        equipmentCode: equipmentCode,
      });
      if (res.status === 200) {
        this.xdata = [];
        this.ydata = [];
        this.ydata2 = [];
        let data = res.data.data;
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          this.xdata.push(data[i].time);
          this.ydata.push(data[i].runningDistance);
          sum += data[i].runningDistance;
        }
        this.chartOptions.xAxis[0].data = this.xdata;
        this.chartOptions.series[0].data = this.ydata;
        if (getItem("userData").userCode == "999999") {
          const res2 = await this.$http.post(
            this.$urlObj.queryRealtimeRunningCache,
            {
              userCode: getItem("userData").userCode,
              equipmentCode: equipmentCode,
            }
          );
          if (res2.status == 200 && res2.data.resultCode == "0000") {
            for (let j = 0; j < res2.data.data.length; j++) {
              this.ydata2.push(res2.data.data[j].runningDistance);
            }
          }
          this.chartOptions.series[1].data = this.ydata2;
        } else {
          this.chartOptions.series[1].data = [];
          this.chartOptions.legend.data = [];
        }

        // 通过回调函数设置tooltip提示框
        this.chartOptions.tooltip.formatter = function(params) {
          let str = "";
          if (params.componentIndex == 0) {
            str =
              "时间: " +
              params.name +
              "<br />" +
              "监测里程: " +
              params.data +
              "km" +
              "<br />" +
              "监测里程/总里程: " +
              ((params.data / sum) * 100).toFixed(2) +
              "%";
          } else {
            str =
              "时间：" +
              params.name +
              "<br />" +
              "运行里程: " +
              params.data +
              "km";
          }

          return str;
        };
        this.$nextTick(() => {
          let dom = document.getElementsByClassName("distanceContainer")[0];

          this.chartContainer = echarts.init(dom);
          this.chartOptions &&
            unwarp(this.chartContainer).setOption(this.chartOptions);
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
  .goDistanceWrap {
    width: 100%;
    height: 100%;
    padding-top: 2.45%;
    background-color: #1c1f30;
    box-sizing: border-box;
    .title {
      margin-left: 2.45%;
      color: #ffffff;
      h4 {
        font-size: 18px;
      }
    }
    .distanceContainer {
      width: 100%;
      height: 88.66%;
      margin-top: 18px;
    }
  }
}
</style>
